<?php
declare(strict_types=1);

final class ReviewController
{
    public static function add(PDO $pdo): void
    {
        $user = requireAuth($pdo);
        $input = jsonInput();
        requireFields($input, ['swap_request_id', 'rating']);

        $swapRequestId = (int) $input['swap_request_id'];
        $rating = (int) $input['rating'];
        $comment = isset($input['comment']) ? trim((string) $input['comment']) : null;

        if ($rating < 1 || $rating > 5) {
            jsonResponse(422, false, null, 'Rating must be between 1 and 5');
        }

        $swapStmt = $pdo->prepare(
            'SELECT id, from_user_id, to_user_id, status
             FROM swap_requests
             WHERE id = :id
             LIMIT 1'
        );
        $swapStmt->execute(['id' => $swapRequestId]);
        $swap = $swapStmt->fetch();
        if (!$swap) {
            jsonResponse(404, false, null, 'Swap request not found');
        }
        if ($swap['status'] !== 'completed') {
            jsonResponse(409, false, null, 'Review allowed only after completion');
        }
        if ((int) $swap['from_user_id'] !== $user['id'] && (int) $swap['to_user_id'] !== $user['id']) {
            jsonResponse(403, false, null, 'Not authorized to review this swap');
        }

        $toUserId = ((int) $swap['from_user_id'] === $user['id'])
            ? (int) $swap['to_user_id']
            : (int) $swap['from_user_id'];

        $insertStmt = $pdo->prepare(
            'INSERT INTO reviews
                (swap_request_id, from_user_id, to_user_id, rating, comment, created_at)
             VALUES
                (:swap_request_id, :from_user_id, :to_user_id, :rating, :comment, NOW())'
        );
        try {
            $insertStmt->execute([
                'swap_request_id' => $swapRequestId,
                'from_user_id' => $user['id'],
                'to_user_id' => $toUserId,
                'rating' => $rating,
                'comment' => $comment,
            ]);
        } catch (PDOException $error) {
            if ((string) $error->getCode() === '23000') {
                jsonResponse(409, false, null, 'You already reviewed this swap');
            }
            throw $error;
        }

        jsonResponse(201, true, ['message' => 'Review added']);
    }

    public static function listByUser(PDO $pdo, int $userId): void
    {
        requireAuth($pdo);
        $stmt = $pdo->prepare(
            'SELECT
                r.id,
                r.swap_request_id,
                r.from_user_id,
                u.name AS from_user_name,
                r.to_user_id,
                r.rating,
                r.comment,
                r.created_at
             FROM reviews r
             INNER JOIN users u ON u.id = r.from_user_id
             WHERE r.to_user_id = :user_id
             ORDER BY r.created_at DESC'
        );
        $stmt->execute(['user_id' => $userId]);
        $reviews = $stmt->fetchAll();

        $summaryStmt = $pdo->prepare(
            'SELECT AVG(rating) AS avg_rating, COUNT(*) AS total_reviews
             FROM reviews
             WHERE to_user_id = :user_id'
        );
        $summaryStmt->execute(['user_id' => $userId]);
        $summary = $summaryStmt->fetch() ?: ['avg_rating' => 0, 'total_reviews' => 0];

        jsonResponse(200, true, [
            'summary' => [
                'avg_rating' => round((float) $summary['avg_rating'], 2),
                'total_reviews' => (int) $summary['total_reviews'],
            ],
            'reviews' => $reviews,
        ]);
    }
}

