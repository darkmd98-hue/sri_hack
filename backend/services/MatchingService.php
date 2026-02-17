<?php
declare(strict_types=1);

final class MatchingService
{
    public static function recommended(PDO $pdo, int $currentUserId, int $limit = 25): array
    {
        $limit = max(1, min(100, $limit));

        $profileStmt = $pdo->prepare('SELECT dept, year FROM users WHERE id = :user_id');
        $profileStmt->execute(['user_id' => $currentUserId]);
        $profile = $profileStmt->fetch();
        if (!$profile) {
            return [];
        }

        $sql = '
            SELECT
                u.id,
                u.name,
                u.dept,
                u.year,
                u.avatar_url,
                u.verification_status,
                COALESCE(rv.avg_rating, 0) AS avg_rating,
                (
                    SELECT COUNT(*)
                    FROM user_teach_skills uts_b
                    INNER JOIN user_learn_skills ul_a
                        ON ul_a.skill_id = uts_b.skill_id
                       AND ul_a.user_id = :current_user_id_1
                    WHERE uts_b.user_id = u.id
                      AND uts_b.is_active = 1
                ) AS reciprocal_teach_count,
                (
                    SELECT COUNT(*)
                    FROM user_learn_skills ul_b
                    INNER JOIN user_teach_skills uts_a
                        ON uts_a.skill_id = ul_b.skill_id
                       AND uts_a.user_id = :current_user_id_2
                       AND uts_a.is_active = 1
                    WHERE ul_b.user_id = u.id
                ) AS reciprocal_learn_count,
                (
                    SELECT COUNT(*)
                    FROM availability_slots a1
                    INNER JOIN availability_slots a2
                        ON a1.day_of_week = a2.day_of_week
                       AND a1.start_time < a2.end_time
                       AND a2.start_time < a1.end_time
                    WHERE a1.user_id = :current_user_id_3
                      AND a2.user_id = u.id
                ) AS overlap_count,
                COALESCE(rep.report_count, 0) AS report_count
            FROM users u
            LEFT JOIN (
                SELECT to_user_id, AVG(rating) AS avg_rating
                FROM reviews
                GROUP BY to_user_id
            ) rv ON rv.to_user_id = u.id
            LEFT JOIN (
                SELECT reported_id, COUNT(*) AS report_count
                FROM reports
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 90 DAY)
                GROUP BY reported_id
            ) rep ON rep.reported_id = u.id
            WHERE u.id <> :current_user_id_4
              AND NOT EXISTS (
                  SELECT 1
                  FROM blocks b
                  WHERE (b.blocker_id = :current_user_id_5 AND b.blocked_id = u.id)
                     OR (b.blocker_id = u.id AND b.blocked_id = :current_user_id_6)
              )
            ORDER BY u.id ASC
            LIMIT :limit';

        $stmt = $pdo->prepare($sql);
        $stmt->bindValue('current_user_id_1', $currentUserId, PDO::PARAM_INT);
        $stmt->bindValue('current_user_id_2', $currentUserId, PDO::PARAM_INT);
        $stmt->bindValue('current_user_id_3', $currentUserId, PDO::PARAM_INT);
        $stmt->bindValue('current_user_id_4', $currentUserId, PDO::PARAM_INT);
        $stmt->bindValue('current_user_id_5', $currentUserId, PDO::PARAM_INT);
        $stmt->bindValue('current_user_id_6', $currentUserId, PDO::PARAM_INT);
        $stmt->bindValue('limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll();

        $result = [];
        foreach ($rows as $row) {
            $teachCount = (int) $row['reciprocal_teach_count'];
            $learnCount = (int) $row['reciprocal_learn_count'];
            $overlapCount = (int) $row['overlap_count'];
            $avgRating = (float) $row['avg_rating'];
            $reportCount = (int) $row['report_count'];

            $score = 0;
            $score += $teachCount * 50;
            $score += $learnCount * 30;
            if ($row['dept'] !== null && $profile['dept'] !== null && $row['dept'] === $profile['dept']) {
                $score += 10;
            }
            if ($overlapCount > 0) {
                $score += 10;
            }
            if ($avgRating > 0 && $avgRating < 3.0) {
                $score -= 30;
            }
            if ($reportCount >= 3) {
                $score -= 20;
            }

            $skillsStmt = $pdo->prepare(
                '(SELECT s.id, s.name
                  FROM skills s
                  INNER JOIN user_teach_skills uts_b ON uts_b.skill_id = s.id AND uts_b.user_id = :candidate_1 AND uts_b.is_active = 1
                  INNER JOIN user_learn_skills ul_a ON ul_a.skill_id = s.id AND ul_a.user_id = :current_1)
                 UNION
                 (SELECT s.id, s.name
                  FROM skills s
                  INNER JOIN user_teach_skills uts_a ON uts_a.skill_id = s.id AND uts_a.user_id = :current_2 AND uts_a.is_active = 1
                  INNER JOIN user_learn_skills ul_b ON ul_b.skill_id = s.id AND ul_b.user_id = :candidate_2)
                 LIMIT 5'
            );
            $skillsStmt->bindValue('candidate_1', (int) $row['id'], PDO::PARAM_INT);
            $skillsStmt->bindValue('candidate_2', (int) $row['id'], PDO::PARAM_INT);
            $skillsStmt->bindValue('current_1', $currentUserId, PDO::PARAM_INT);
            $skillsStmt->bindValue('current_2', $currentUserId, PDO::PARAM_INT);
            $skillsStmt->execute();

            $result[] = [
                'id' => (int) $row['id'],
                'name' => (string) $row['name'],
                'dept' => $row['dept'] !== null ? (string) $row['dept'] : null,
                'year' => $row['year'] !== null ? (int) $row['year'] : null,
                'avatar_url' => $row['avatar_url'] !== null ? (string) $row['avatar_url'] : null,
                'verification_status' => (string) $row['verification_status'],
                'avg_rating' => round($avgRating, 2),
                'reciprocal_teach_count' => $teachCount,
                'reciprocal_learn_count' => $learnCount,
                'availability_overlap_count' => $overlapCount,
                'match_score' => max(0, min(100, $score)),
                'top_matching_skills' => $skillsStmt->fetchAll(),
            ];
        }

        usort(
            $result,
            static fn(array $a, array $b): int =>
                ($b['match_score'] <=> $a['match_score']) ?: ($b['avg_rating'] <=> $a['avg_rating'])
        );

        return $result;
    }
}

