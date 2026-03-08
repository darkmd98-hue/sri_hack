<?php
declare(strict_types=1);

final class SkillController
{
    public static function myTeach(PDO $pdo): void
    {
        $user = requireAuth($pdo);
        $stmt = $pdo->prepare(
            'SELECT
                uts.id,
                uts.skill_id,
                s.name AS skill_name,
                s.category,
                uts.level,
                uts.mode,
                uts.description,
                uts.hourly_commitment,
                uts.is_active,
                uts.updated_at
             FROM user_teach_skills uts
             INNER JOIN skills s ON s.id = uts.skill_id
             WHERE uts.user_id = :user_id
               AND uts.is_active = 1
             ORDER BY s.name ASC'
        );
        $stmt->execute(['user_id' => $user['id']]);
        jsonResponse(200, true, $stmt->fetchAll());
    }

    public static function myLearn(PDO $pdo): void
    {
        $user = requireAuth($pdo);
        $stmt = $pdo->prepare(
            'SELECT
                uls.id,
                uls.skill_id,
                s.name AS skill_name,
                s.category,
                uls.level_needed,
                uls.notes,
                uls.updated_at
             FROM user_learn_skills uls
             INNER JOIN skills s ON s.id = uls.skill_id
             WHERE uls.user_id = :user_id
             ORDER BY s.name ASC'
        );
        $stmt->execute(['user_id' => $user['id']]);
        jsonResponse(200, true, $stmt->fetchAll());
    }

    public static function list(PDO $pdo): void
    {
        $stmt = $pdo->query('SELECT id, name, category FROM skills ORDER BY name ASC');
        jsonResponse(200, true, $stmt->fetchAll());
    }

    public static function addTeach(PDO $pdo): void
    {
        $user = requireAuth($pdo);
        $input = jsonInput();
        requireFields($input, ['skill_id', 'level', 'mode']);

        $skillId = (int) $input['skill_id'];
        $level = (string) $input['level'];
        $mode = (string) $input['mode'];
        $description = isset($input['description']) ? trim((string) $input['description']) : null;
        $hourlyCommitment = isset($input['hourly_commitment']) ? (float) $input['hourly_commitment'] : null;

        if (!in_array($level, ['beginner', 'intermediate', 'advanced'], true)) {
            jsonResponse(422, false, null, 'Invalid level');
        }
        if (!in_array($mode, ['online', 'offline', 'both'], true)) {
            jsonResponse(422, false, null, 'Invalid mode');
        }

        $stmt = $pdo->prepare(
            'INSERT INTO user_teach_skills
                (user_id, skill_id, level, mode, description, hourly_commitment, is_active, created_at, updated_at)
             VALUES
                (:user_id, :skill_id, :level, :mode, :description, :hourly_commitment, 1, NOW(), NOW())
             ON DUPLICATE KEY UPDATE
                level = VALUES(level),
                mode = VALUES(mode),
                description = VALUES(description),
                hourly_commitment = VALUES(hourly_commitment),
                is_active = 1,
                updated_at = NOW()'
        );
        $stmt->execute([
            'user_id' => $user['id'],
            'skill_id' => $skillId,
            'level' => $level,
            'mode' => $mode,
            'description' => $description,
            'hourly_commitment' => $hourlyCommitment,
        ]);

        jsonResponse(201, true, ['message' => 'Teach skill saved']);
    }

    public static function updateTeach(PDO $pdo): void
    {
        $user = requireAuth($pdo);
        $input = jsonInput();
        requireFields($input, ['id']);

        $teachId = (int) $input['id'];
        $allowed = ['level', 'mode', 'description', 'hourly_commitment', 'is_active'];
        $updates = [];
        $params = ['id' => $teachId, 'user_id' => $user['id']];

        foreach ($allowed as $field) {
            if (!array_key_exists($field, $input)) {
                continue;
            }
            $updates[] = $field . ' = :' . $field;
            $params[$field] = $field === 'hourly_commitment'
                ? (float) $input[$field]
                : ($field === 'is_active' ? ((int) $input[$field] ? 1 : 0) : (string) $input[$field]);
        }

        if ($updates === []) {
            jsonResponse(422, false, null, 'Nothing to update');
        }

        $sql = 'UPDATE user_teach_skills
                SET ' . implode(', ', $updates) . ', updated_at = NOW()
                WHERE id = :id AND user_id = :user_id';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        if ($stmt->rowCount() === 0) {
            jsonResponse(404, false, null, 'Teach skill not found');
        }

        jsonResponse(200, true, ['message' => 'Teach skill updated']);
    }

    public static function deleteTeach(PDO $pdo): void
    {
        $user = requireAuth($pdo);
        $input = jsonInput();
        requireFields($input, ['id']);

        $stmt = $pdo->prepare(
            'UPDATE user_teach_skills
             SET is_active = 0, updated_at = NOW()
             WHERE id = :id AND user_id = :user_id'
        );
        $stmt->execute([
            'id' => (int) $input['id'],
            'user_id' => $user['id'],
        ]);

        if ($stmt->rowCount() === 0) {
            jsonResponse(404, false, null, 'Teach skill not found');
        }
        jsonResponse(200, true, ['message' => 'Teach skill removed']);
    }

    public static function addLearn(PDO $pdo): void
    {
        $user = requireAuth($pdo);
        $input = jsonInput();
        requireFields($input, ['skill_id', 'level_needed']);

        $skillId = (int) $input['skill_id'];
        $levelNeeded = (string) $input['level_needed'];
        $notes = isset($input['notes']) ? trim((string) $input['notes']) : null;

        if (!in_array($levelNeeded, ['beginner', 'intermediate', 'advanced'], true)) {
            jsonResponse(422, false, null, 'Invalid level_needed');
        }

        $stmt = $pdo->prepare(
            'INSERT INTO user_learn_skills (user_id, skill_id, level_needed, notes, created_at, updated_at)
             VALUES (:user_id, :skill_id, :level_needed, :notes, NOW(), NOW())
             ON DUPLICATE KEY UPDATE
                level_needed = VALUES(level_needed),
                notes = VALUES(notes),
                updated_at = NOW()'
        );
        $stmt->execute([
            'user_id' => $user['id'],
            'skill_id' => $skillId,
            'level_needed' => $levelNeeded,
            'notes' => $notes,
        ]);

        jsonResponse(201, true, ['message' => 'Learn skill saved']);
    }

    public static function deleteLearn(PDO $pdo): void
    {
        $user = requireAuth($pdo);
        $input = jsonInput();
        requireFields($input, ['id']);

        $stmt = $pdo->prepare(
            'DELETE FROM user_learn_skills
             WHERE id = :id
               AND user_id = :user_id'
        );
        $stmt->execute([
            'id' => (int) $input['id'],
            'user_id' => $user['id'],
        ]);

        if ($stmt->rowCount() === 0) {
            jsonResponse(404, false, null, 'Learn skill not found');
        }
        jsonResponse(200, true, ['message' => 'Learn skill removed']);
    }

    public static function searchTeach(PDO $pdo): void
    {
        $viewer = requireAuth($pdo);
        $skillId = intQuery('skill_id', 0);
        $level = strQuery('level');
        $mode = strQuery('mode');
        $query = strQuery('q');

        $sql = '
            SELECT
                uts.id,
                uts.user_id,
                u.name AS user_name,
                u.dept,
                u.year,
                u.avatar_url,
                u.verification_status,
                s.id AS skill_id,
                s.name AS skill_name,
                uts.level,
                uts.mode,
                uts.description,
                uts.hourly_commitment,
                COALESCE(rv.avg_rating, 0) AS avg_rating
            FROM user_teach_skills uts
            INNER JOIN users u ON u.id = uts.user_id
            INNER JOIN skills s ON s.id = uts.skill_id
            LEFT JOIN (
                SELECT to_user_id, AVG(rating) AS avg_rating
                FROM reviews
                GROUP BY to_user_id
            ) rv ON rv.to_user_id = u.id
            WHERE uts.is_active = 1
              AND uts.user_id <> :viewer_id
              AND NOT EXISTS (
                  SELECT 1 FROM blocks b
                  WHERE (b.blocker_id = :viewer_blocker AND b.blocked_id = uts.user_id)
                     OR (b.blocker_id = uts.user_id AND b.blocked_id = :viewer_blocked)
              )';
        $params = [
            'viewer_id' => $viewer['id'],
            'viewer_blocker' => $viewer['id'],
            'viewer_blocked' => $viewer['id'],
        ];

        if ($skillId > 0) {
            $sql .= ' AND s.id = :skill_id';
            $params['skill_id'] = $skillId;
        }
        if ($level !== '') {
            $sql .= ' AND uts.level = :level';
            $params['level'] = $level;
        }
        if ($mode !== '') {
            $sql .= ' AND uts.mode = :mode';
            $params['mode'] = $mode;
        }
        if ($query !== '') {
            $sql .= ' AND s.name LIKE :q';
            $params['q'] = '%' . $query . '%';
        }
        $sql .= ' ORDER BY u.verification_status = \'verified\' DESC, avg_rating DESC, uts.updated_at DESC LIMIT 100';

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        jsonResponse(200, true, $stmt->fetchAll());
    }
}

