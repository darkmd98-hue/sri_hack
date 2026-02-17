<?php
declare(strict_types=1);

function requireAuth(PDO $pdo): array
{
    $token = getBearerToken();
    if ($token === null || $token === '') {
        jsonResponse(401, false, null, 'Missing bearer token');
    }

    $tokenHash = hash('sha256', $token);
    $stmt = $pdo->prepare(
        'SELECT at.id AS token_id, at.user_id, at.expires_at, u.id, u.role, u.name, u.email, u.dept, u.year, u.bio, u.avatar_url, u.verification_status
         FROM auth_tokens at
         INNER JOIN users u ON u.id = at.user_id
         WHERE at.token_hash = :token_hash
         LIMIT 1'
    );
    $stmt->execute(['token_hash' => $tokenHash]);
    $row = $stmt->fetch();

    if (!$row) {
        jsonResponse(401, false, null, 'Invalid token');
    }

    if (strtotime((string) $row['expires_at']) < time()) {
        $deleteStmt = $pdo->prepare('DELETE FROM auth_tokens WHERE id = :token_id');
        $deleteStmt->execute(['token_id' => $row['token_id']]);
        jsonResponse(401, false, null, 'Token expired');
    }

    $touchStmt = $pdo->prepare('UPDATE auth_tokens SET last_used_at = NOW() WHERE id = :token_id');
    $touchStmt->execute(['token_id' => $row['token_id']]);

    return [
        'id' => (int) $row['id'],
        'role' => (string) $row['role'],
        'name' => (string) $row['name'],
        'email' => (string) $row['email'],
        'dept' => $row['dept'] !== null ? (string) $row['dept'] : null,
        'year' => $row['year'] !== null ? (int) $row['year'] : null,
        'bio' => $row['bio'] !== null ? (string) $row['bio'] : null,
        'avatar_url' => $row['avatar_url'] !== null ? (string) $row['avatar_url'] : null,
        'verification_status' => (string) $row['verification_status'],
    ];
}

