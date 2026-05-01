<?php
declare(strict_types=1);

function clientIpAddress(): string
{
    $forwardedFor = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
    if (is_string($forwardedFor) && $forwardedFor !== '') {
        foreach (explode(',', $forwardedFor) as $candidate) {
            $ip = trim($candidate);
            if (filter_var($ip, FILTER_VALIDATE_IP) !== false) {
                return $ip;
            }
        }
    }

    $remoteAddr = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    if (is_string($remoteAddr) && filter_var($remoteAddr, FILTER_VALIDATE_IP) !== false) {
        return $remoteAddr;
    }

    return 'unknown';
}

function enforceRateLimit(
    PDO $pdo,
    string $action,
    int $limit,
    int $windowSeconds,
    ?string $identifier = null,
    string $scope = 'either'
): void
{
    $limit = max(1, $limit);
    $windowSeconds = max(1, $windowSeconds);
    $scope = in_array($scope, ['either', 'ip', 'identifier'], true) ? $scope : 'either';

    $ipAddress = clientIpAddress();
    $identifierHash = null;
    if ($identifier !== null) {
        $normalizedIdentifier = trim($identifier);
        if ($normalizedIdentifier !== '') {
            $identifierHash = hash('sha256', $normalizedIdentifier);
        }
    }

    $cutoff = (new DateTimeImmutable(sprintf('-%d seconds', $windowSeconds)))->format('Y-m-d H:i:s');
    $cleanupBefore = (new DateTimeImmutable('-1 day'))->format('Y-m-d H:i:s');

    $cleanupStmt = $pdo->prepare('DELETE FROM rate_limit_events WHERE created_at < :cleanup_before');
    $cleanupStmt->execute(['cleanup_before' => $cleanupBefore]);

    if ($identifierHash !== null && $scope === 'identifier') {
        $countStmt = $pdo->prepare(
            'SELECT COUNT(*)
             FROM rate_limit_events
             WHERE action = :action
               AND created_at >= :cutoff
               AND identifier_hash = :identifier_hash'
        );
        $countStmt->execute([
            'action' => $action,
            'cutoff' => $cutoff,
            'identifier_hash' => $identifierHash,
        ]);
    } elseif ($scope === 'ip' || $identifierHash === null) {
        $countStmt = $pdo->prepare(
            'SELECT COUNT(*)
             FROM rate_limit_events
             WHERE action = :action
               AND created_at >= :cutoff
               AND ip_address = :ip_address'
        );
        $countStmt->execute([
            'action' => $action,
            'cutoff' => $cutoff,
            'ip_address' => $ipAddress,
        ]);
    } else {
        $countStmt = $pdo->prepare(
            'SELECT COUNT(*)
             FROM rate_limit_events
             WHERE action = :action
               AND created_at >= :cutoff
               AND (ip_address = :ip_address OR identifier_hash = :identifier_hash)'
        );
        $countStmt->execute([
            'action' => $action,
            'cutoff' => $cutoff,
            'ip_address' => $ipAddress,
            'identifier_hash' => $identifierHash,
        ]);
    }

    if ((int) $countStmt->fetchColumn() >= $limit) {
        jsonResponse(429, false, null, 'Too many requests. Please try again later.');
    }

    // Attempts are recorded before the protected handler completes so failed logins, invalid payloads,
    // and other early exits still consume the same budget and remain expensive to brute-force.
    $insertStmt = $pdo->prepare(
        'INSERT INTO rate_limit_events (action, ip_address, identifier_hash, created_at)
         VALUES (:action, :ip_address, :identifier_hash, NOW())'
    );
    $insertStmt->execute([
        'action' => $action,
        'ip_address' => $ipAddress,
        'identifier_hash' => $identifierHash,
    ]);
}
