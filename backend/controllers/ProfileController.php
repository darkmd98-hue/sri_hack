<?php
declare(strict_types=1);

final class ProfileController
{
    public static function update(PDO $pdo): void
    {
        $authUser = requireAuth($pdo);
        $input = jsonInput();

        $allowed = ['name', 'dept', 'year', 'bio'];
        $updates = [];
        $params = ['id' => $authUser['id']];

        foreach ($allowed as $field) {
            if (!array_key_exists($field, $input)) {
                continue;
            }
            $updates[] = $field . ' = :' . $field;
            $params[$field] = $field === 'year'
                ? (int) $input[$field]
                : trim((string) $input[$field]);
        }

        if ($updates === []) {
            jsonResponse(422, false, null, 'No updatable fields found');
        }

        $sql = 'UPDATE users SET ' . implode(', ', $updates) . ', updated_at = NOW() WHERE id = :id';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        $fetchStmt = $pdo->prepare(
            'SELECT id, role, name, email, dept, year, bio, avatar_url, verification_status
             FROM users
             WHERE id = :id'
        );
        $fetchStmt->execute(['id' => $authUser['id']]);
        $user = $fetchStmt->fetch();

        jsonResponse(200, true, $user);
    }

    public static function uploadAvatar(PDO $pdo): void
    {
        $authUser = requireAuth($pdo);
        if (!isset($_FILES['avatar'])) {
            jsonResponse(422, false, null, 'Avatar file is required');
        }

        $env = require __DIR__ . '/../config/env.php';
        $storedPath = UploadService::storeUploadedFile(
            $_FILES['avatar'],
            [
                'image/jpeg' => 'jpg',
                'image/png' => 'png',
            ],
            2 * 1024 * 1024,
            $env['upload_dir'],
            'avatars'
        );
        $avatarUrl = rtrim($env['base_upload_url'], '/') . '/' . $storedPath;

        $stmt = $pdo->prepare('UPDATE users SET avatar_url = :avatar_url, updated_at = NOW() WHERE id = :id');
        $stmt->execute([
            'avatar_url' => $avatarUrl,
            'id' => $authUser['id'],
        ]);

        jsonResponse(200, true, ['avatar_url' => $avatarUrl]);
    }

    public static function uploadVerificationDoc(PDO $pdo): void
    {
        $authUser = requireAuth($pdo);
        $docType = $_POST['doc_type'] ?? '';
        if (!in_array($docType, ['college_id', 'email', 'other'], true)) {
            jsonResponse(422, false, null, 'Invalid doc_type');
        }
        if (!isset($_FILES['document'])) {
            jsonResponse(422, false, null, 'Document file is required');
        }

        $env = require __DIR__ . '/../config/env.php';
        $storedPath = UploadService::storeUploadedFile(
            $_FILES['document'],
            [
                'image/jpeg' => 'jpg',
                'image/png' => 'png',
                'application/pdf' => 'pdf',
            ],
            5 * 1024 * 1024,
            $env['upload_dir'],
            'verification'
        );
        $docUrl = rtrim($env['base_upload_url'], '/') . '/' . $storedPath;

        $stmt = $pdo->prepare(
            'INSERT INTO verification_docs (user_id, doc_type, doc_url, status, created_at)
             VALUES (:user_id, :doc_type, :doc_url, \'pending\', NOW())'
        );
        $stmt->execute([
            'user_id' => $authUser['id'],
            'doc_type' => $docType,
            'doc_url' => $docUrl,
        ]);

        $userStmt = $pdo->prepare(
            'UPDATE users
             SET verification_status = \'pending\', updated_at = NOW()
             WHERE id = :id'
        );
        $userStmt->execute(['id' => $authUser['id']]);

        jsonResponse(201, true, ['doc_url' => $docUrl, 'status' => 'pending']);
    }

    public static function getUser(PDO $pdo, int $userId): void
    {
        $viewer = requireAuth($pdo);
        if ($viewer['id'] !== $userId) {
            $blockStmt = $pdo->prepare(
                'SELECT 1
                 FROM blocks
                 WHERE (blocker_id = :viewer_1 AND blocked_id = :target_1)
                    OR (blocker_id = :target_2 AND blocked_id = :viewer_2)
                 LIMIT 1'
            );
            $blockStmt->execute([
                'viewer_1' => $viewer['id'],
                'target_1' => $userId,
                'target_2' => $userId,
                'viewer_2' => $viewer['id'],
            ]);
            if ($blockStmt->fetch()) {
                jsonResponse(403, false, null, 'Profile not available');
            }
        }

        $stmt = $pdo->prepare(
            'SELECT
                u.id, u.name, u.dept, u.year, u.bio, u.avatar_url, u.verification_status, u.created_at,
                COALESCE(r.avg_rating, 0) AS avg_rating,
                COALESCE(r.rating_count, 0) AS rating_count
             FROM users u
             LEFT JOIN (
                SELECT to_user_id, AVG(rating) AS avg_rating, COUNT(*) AS rating_count
                FROM reviews
                GROUP BY to_user_id
             ) r ON r.to_user_id = u.id
             WHERE u.id = :id
             LIMIT 1'
        );
        $stmt->execute(['id' => $userId]);
        $user = $stmt->fetch();
        if (!$user) {
            jsonResponse(404, false, null, 'User not found');
        }

        jsonResponse(200, true, $user);
    }

    public static function reviewVerificationDoc(PDO $pdo): void
    {
        $admin = requireAuth($pdo);
        if ($admin['role'] !== 'admin') {
            jsonResponse(403, false, null, 'Admin access required');
        }

        $input = jsonInput();
        requireFields($input, ['doc_id', 'action']);

        $docId = (int) $input['doc_id'];
        $action = (string) $input['action'];
        if (!in_array($action, ['approve', 'reject'], true)) {
            jsonResponse(422, false, null, 'Invalid action');
        }
        $status = $action === 'approve' ? 'approved' : 'rejected';
        $userStatus = $action === 'approve' ? 'verified' : 'rejected';

        $docStmt = $pdo->prepare('SELECT user_id FROM verification_docs WHERE id = :id LIMIT 1');
        $docStmt->execute(['id' => $docId]);
        $doc = $docStmt->fetch();
        if (!$doc) {
            jsonResponse(404, false, null, 'Verification document not found');
        }

        $pdo->beginTransaction();
        try {
            $updateDoc = $pdo->prepare(
                'UPDATE verification_docs
                 SET status = :status, reviewed_by = :reviewed_by, reviewed_at = NOW()
                 WHERE id = :id'
            );
            $updateDoc->execute([
                'status' => $status,
                'reviewed_by' => $admin['id'],
                'id' => $docId,
            ]);

            $updateUser = $pdo->prepare(
                'UPDATE users
                 SET verification_status = :verification_status, updated_at = NOW()
                 WHERE id = :id'
            );
            $updateUser->execute([
                'verification_status' => $userStatus,
                'id' => (int) $doc['user_id'],
            ]);

            $pdo->commit();
        } catch (Throwable $error) {
            $pdo->rollBack();
            throw $error;
        }

        jsonResponse(200, true, ['doc_id' => $docId, 'status' => $status]);
    }
}

