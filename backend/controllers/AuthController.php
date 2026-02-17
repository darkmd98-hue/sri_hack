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
}

