<?php
declare(strict_types=1);

final class TokenService
{
    public static function issue(PDO $pdo, int $userId, int $ttlHours): string
    {
        $rawToken = bin2hex(random_bytes(32));
        $tokenHash = hash('sha256', $rawToken);

        $stmt = $pdo->prepare(
            'INSERT INTO auth_tokens (user_id, token_hash, expires_at, created_at, last_used_at)
             VALUES (:user_id, :token_hash, DATE_ADD(NOW(), INTERVAL :ttl HOUR), NOW(), NOW())'
        );
        $stmt->bindValue('user_id', $userId, PDO::PARAM_INT);
        $stmt->bindValue('token_hash', $tokenHash, PDO::PARAM_STR);
        $stmt->bindValue('ttl', $ttlHours, PDO::PARAM_INT);
        $stmt->execute();

        return $rawToken;
    }

    public static function revoke(PDO $pdo, string $token): void
    {
        $stmt = $pdo->prepare('DELETE FROM auth_tokens WHERE token_hash = :token_hash');
        $stmt->execute([
            'token_hash' => hash('sha256', $token),
        ]);
    }
}

