<?php
declare(strict_types=1);

final class MatchController
{
    public static function recommended(PDO $pdo): void
    {
        $user = requireAuth($pdo);
        $limit = intQuery('limit', 25);
        $results = MatchingService::recommended($pdo, $user['id'], $limit);
        jsonResponse(200, true, $results);
    }

    public static function bySkill(PDO $pdo): void
    {
        $viewer = requireAuth($pdo);
        $skillId = intQuery('skill_id', 0);
        if ($skillId <= 0) {
            jsonResponse(422, false, null, 'skill_id is required');
        }

        $stmt = $pdo->prepare(
            'SELECT
                u.id,
                u.name,
                u.dept,
                u.year,
                u.avatar_url,
                u.verification_status,
                uts.level,
                uts.mode,
                uts.description,
                COALESCE(rv.avg_rating, 0) AS avg_rating
             FROM user_teach_skills uts
             INNER JOIN users u ON u.id = uts.user_id
             LEFT JOIN (
                SELECT to_user_id, AVG(rating) AS avg_rating
                FROM reviews
                GROUP BY to_user_id
             ) rv ON rv.to_user_id = u.id
             WHERE uts.skill_id = :skill_id
               AND uts.is_active = 1
               AND u.id <> :viewer_id
               AND NOT EXISTS (
                   SELECT 1 FROM blocks b
                   WHERE (b.blocker_id = :viewer_blocker AND b.blocked_id = u.id)
                      OR (b.blocker_id = u.id AND b.blocked_id = :viewer_blocked)
               )
             ORDER BY u.verification_status = \'verified\' DESC, avg_rating DESC'
        );
        $stmt->execute([
            'skill_id' => $skillId,
            'viewer_id' => $viewer['id'],
            'viewer_blocker' => $viewer['id'],
            'viewer_blocked' => $viewer['id'],
        ]);

        jsonResponse(200, true, $stmt->fetchAll());
    }
}

