<?php
declare(strict_types=1);

final class SafetyController
{
    public static function block(PDO $pdo): void
    {
        $user = requireAuth($pdo);
        $input = jsonInput();
        requireFields($input, ['blocked_id']);

        $blockedId = (int) $input['blocked_id'];
        if ($blockedId <= 0 || $blockedId === $user['id']) {
            jsonResponse(422, false, null, 'Invalid blocked_id');
        }

        $stmt = $pdo->prepare(
            'INSERT INTO blocks (blocker_id, blocked_id, created_at)
             VALUES (:blocker_id, :blocked_id, NOW())
             ON DUPLICATE KEY UPDATE created_at = VALUES(created_at)'
        );
        $stmt->execute([
            'blocker_id' => $user['id'],
            'blocked_id' => $blockedId,
        ]);

        jsonResponse(201, true, ['message' => 'User blocked']);
    }

    public static function report(PDO $pdo): void
    {
        $user = requireAuth($pdo);
        $input = jsonInput();
        requireFields($input, ['reported_id', 'reason']);

        $reportedId = (int) $input['reported_id'];
        $reason = trim((string) $input['reason']);
        $details = isset($input['details']) ? trim((string) $input['details']) : null;

        if ($reportedId <= 0 || $reportedId === $user['id']) {
            jsonResponse(422, false, null, 'Invalid reported_id');
        }
        if ($reason === '') {
            jsonResponse(422, false, null, 'Reason is required');
        }

        $stmt = $pdo->prepare(
            'INSERT INTO reports (reporter_id, reported_id, reason, details, status, created_at)
             VALUES (:reporter_id, :reported_id, :reason, :details, \'open\', NOW())'
        );
        $stmt->execute([
            'reporter_id' => $user['id'],
            'reported_id' => $reportedId,
            'reason' => $reason,
            'details' => $details,
        ]);

        jsonResponse(201, true, ['message' => 'Report submitted']);
    }
}

