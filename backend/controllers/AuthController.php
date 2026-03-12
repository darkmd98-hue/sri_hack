<?php
declare(strict_types=1);

final class AuthController
{
    public static function register(PDO $pdo): void
    {
        $input = jsonInput();
        requireFields($input, ['name', 'email', 'password']);

        $name = trim((string) $input['name']);
        $email = strtolower(trim((string) $input['email']));
        $password = (string) $input['password'];
        $dept = isset($input['dept']) ? trim((string) $input['dept']) : null;
        $year = isset($input['year']) ? (int) $input['year'] : null;
        $bio = isset($input['bio']) ? trim((string) $input['bio']) : null;

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            jsonResponse(422, false, null, 'Invalid email');
        }
        if (strlen($password) < 8) {
            jsonResponse(422, false, null, 'Password must be at least 8 characters');
        }
        if ($name === '') {
            jsonResponse(422, false, null, 'Name is required');
        }

        $env = require __DIR__ . '/../config/env.php';
        try {
            $insertStmt = $pdo->prepare(
                'INSERT INTO users (role, name, email, password_hash, dept, year, bio, verification_status, created_at, updated_at)
                 VALUES (\'user\', :name, :email, :password_hash, :dept, :year, :bio, \'unverified\', NOW(), NOW())'
            );
            $insertStmt->execute([
                'name' => $name,
                'email' => $email,
                'password_hash' => password_hash($password, PASSWORD_DEFAULT),
                'dept' => $dept,
                'year' => $year,
                'bio' => $bio,
            ]);
        } catch (PDOException $error) {
            if ((string) $error->getCode() === '23000') {
                jsonResponse(409, false, null, 'Email already exists');
            }
            throw $error;
        }

        $userId = (int) $pdo->lastInsertId();
        $token = TokenService::issue($pdo, $userId, $env['token_ttl_hours']);

        $userStmt = $pdo->prepare(
            'SELECT id, role, name, email, dept, year, bio, avatar_url, verification_status, created_at
             FROM users WHERE id = :id'
        );
        $userStmt->execute(['id' => $userId]);
        $user = $userStmt->fetch();

        jsonResponse(201, true, [
            'token' => $token,
            'user' => $user,
        ]);
    }

    public static function login(PDO $pdo): void
    {
        $input = jsonInput();
        requireFields($input, ['email', 'password']);

        $email = strtolower(trim((string) $input['email']));
        $password = (string) $input['password'];

        $stmt = $pdo->prepare(
            'SELECT id, role, name, email, dept, year, bio, avatar_url, verification_status, password_hash
             FROM users WHERE email = :email LIMIT 1'
        );
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch();
        if (!$user) {
            jsonResponse(401, false, null, 'Invalid credentials');
        }

        if (!password_verify($password, (string) $user['password_hash'])) {
            jsonResponse(401, false, null, 'Invalid credentials');
        }

        $env = require __DIR__ . '/../config/env.php';
        $token = TokenService::issue($pdo, (int) $user['id'], $env['token_ttl_hours']);
        unset($user['password_hash']);

        jsonResponse(200, true, [
            'token' => $token,
            'user' => $user,
        ]);
    }

    public static function forgot(PDO $pdo): void
    {
        $input = jsonInput();
        requireFields($input, ['email']);

        $email = strtolower(trim((string) $input['email']));
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            jsonResponse(422, false, null, 'Invalid email');
        }

        self::ensurePasswordResetTable($pdo);
        $pdo->exec('DELETE FROM password_reset_tokens WHERE expires_at < NOW()');

        $lookupStmt = $pdo->prepare('SELECT id FROM users WHERE email = :email LIMIT 1');
        $lookupStmt->execute(['email' => $email]);
        $userId = $lookupStmt->fetchColumn();

        if ($userId !== false) {
            $env = require __DIR__ . '/../config/env.php';
            $ttlMinutes = max(5, (int) $env['password_reset_ttl_minutes']);
            $plainToken = bin2hex(random_bytes(32));
            $tokenHash = hash('sha256', $plainToken);
            $expiresAt = (new DateTimeImmutable(sprintf('+%d minutes', $ttlMinutes)))->format('Y-m-d H:i:s');

            $deleteStmt = $pdo->prepare('DELETE FROM password_reset_tokens WHERE user_id = :user_id');
            $deleteStmt->execute(['user_id' => (int) $userId]);

            $insertStmt = $pdo->prepare(
                'INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
                 VALUES (:user_id, :token_hash, :expires_at)'
            );
            $insertStmt->execute([
                'user_id' => (int) $userId,
                'token_hash' => $tokenHash,
                'expires_at' => $expiresAt,
            ]);

            if (($env['log_reset_tokens'] ?? false) === true) {
                error_log(sprintf('[SkillSwap] Password reset token for %s: %s', $email, $plainToken));
            }
        }

        jsonResponse(200, true, [
            'message' => 'If an account exists for that email, password reset instructions will be sent shortly.',
        ]);
    }

    public static function resetPassword(PDO $pdo): void
    {
        $input = jsonInput();
        requireFields($input, ['token', 'new_password']);

        $token = trim((string) $input['token']);
        $newPassword = (string) $input['new_password'];

        if ($token === '') {
            jsonResponse(422, false, null, 'Reset token is required');
        }
        if (strlen($newPassword) < 8) {
            jsonResponse(422, false, null, 'Password must be at least 8 characters');
        }

        self::ensurePasswordResetTable($pdo);
        $pdo->exec('DELETE FROM password_reset_tokens WHERE expires_at < NOW()');

        $tokenHash = hash('sha256', $token);
        $tokenStmt = $pdo->prepare(
            'SELECT user_id
             FROM password_reset_tokens
             WHERE token_hash = :token_hash AND expires_at >= NOW()
             LIMIT 1'
        );
        $tokenStmt->execute(['token_hash' => $tokenHash]);
        $resetRow = $tokenStmt->fetch();
        if (!$resetRow) {
            jsonResponse(400, false, null, 'Invalid or expired reset token');
        }

        $userId = (int) $resetRow['user_id'];
        $passwordHash = password_hash($newPassword, PASSWORD_DEFAULT);

        try {
            $pdo->beginTransaction();

            $updateStmt = $pdo->prepare(
                'UPDATE users
                 SET password_hash = :password_hash, updated_at = NOW()
                 WHERE id = :user_id'
            );
            $updateStmt->execute([
                'password_hash' => $passwordHash,
                'user_id' => $userId,
            ]);

            $deleteResetStmt = $pdo->prepare('DELETE FROM password_reset_tokens WHERE user_id = :user_id');
            $deleteResetStmt->execute(['user_id' => $userId]);

            $deleteAuthStmt = $pdo->prepare('DELETE FROM auth_tokens WHERE user_id = :user_id');
            $deleteAuthStmt->execute(['user_id' => $userId]);

            $pdo->commit();
        } catch (Throwable $error) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            throw $error;
        }

        jsonResponse(200, true, [
            'message' => 'Password updated successfully.',
        ]);
    }

    public static function logout(PDO $pdo): void
    {
        $token = getBearerToken();
        if ($token === null || $token === '') {
            jsonResponse(400, false, null, 'Missing token');
        }

        TokenService::revoke($pdo, $token);
        jsonResponse(200, true, ['message' => 'Logged out']);
    }

    public static function me(PDO $pdo): void
    {
        $authUser = requireAuth($pdo);
        $statsStmt = $pdo->prepare(
            'SELECT
                (SELECT COUNT(*) FROM user_teach_skills WHERE user_id = :uid1 AND is_active = 1) AS teach_count,
                (SELECT COUNT(*) FROM user_learn_skills WHERE user_id = :uid2) AS learn_count'
        );
        $statsStmt->execute([
            'uid1' => $authUser['id'],
            'uid2' => $authUser['id'],
        ]);
        $stats = $statsStmt->fetch() ?: ['teach_count' => 0, 'learn_count' => 0];

        jsonResponse(200, true, [
            'user' => $authUser,
            'stats' => [
                'teach_count' => (int) $stats['teach_count'],
                'learn_count' => (int) $stats['learn_count'],
            ],
        ]);
    }

    private static function ensurePasswordResetTable(PDO $pdo): void
    {
        $pdo->exec(
            'CREATE TABLE IF NOT EXISTS password_reset_tokens (
                id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                user_id INT UNSIGNED NOT NULL,
                token_hash CHAR(64) NOT NULL UNIQUE,
                expires_at DATETIME NOT NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_password_reset_tokens_user (user_id),
                INDEX idx_password_reset_tokens_expiry (expires_at),
                CONSTRAINT fk_password_reset_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB'
        );
    }
}

