<?php
declare(strict_types=1);

final class AvailabilityController
{
    private static function normalizeTime(string $value): string
    {
        $raw = trim($value);
        if (!preg_match('/^\d{2}:\d{2}(?::\d{2})?$/', $raw)) {
            jsonResponse(422, false, null, 'Invalid time format. Use HH:MM or HH:MM:SS');
        }
        if (strlen($raw) === 5) {
            return $raw . ':00';
        }
        return $raw;
    }

    public static function mine(PDO $pdo): void
    {
        $user = requireAuth($pdo);
        $stmt = $pdo->prepare(
            'SELECT id, day_of_week, start_time, end_time, created_at
             FROM availability_slots
             WHERE user_id = :user_id
             ORDER BY day_of_week ASC, start_time ASC'
        );
        $stmt->execute(['user_id' => $user['id']]);
        jsonResponse(200, true, $stmt->fetchAll());
    }

    public static function upsert(PDO $pdo): void
    {
        $user = requireAuth($pdo);
        $input = jsonInput();
        requireFields($input, ['day_of_week', 'start_time', 'end_time']);

        $id = isset($input['id']) ? (int) $input['id'] : 0;
        $dayOfWeek = (int) $input['day_of_week'];
        $startTime = self::normalizeTime((string) $input['start_time']);
        $endTime = self::normalizeTime((string) $input['end_time']);

        if ($dayOfWeek < 0 || $dayOfWeek > 6) {
            jsonResponse(422, false, null, 'day_of_week must be between 0 and 6');
        }
        if ($startTime >= $endTime) {
            jsonResponse(422, false, null, 'end_time must be later than start_time');
        }

        if ($id > 0) {
            $updateStmt = $pdo->prepare(
                'UPDATE availability_slots
                 SET day_of_week = :day_of_week,
                     start_time = :start_time,
                     end_time = :end_time
                 WHERE id = :id
                   AND user_id = :user_id'
            );
            $updateStmt->execute([
                'day_of_week' => $dayOfWeek,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'id' => $id,
                'user_id' => $user['id'],
            ]);

            if ($updateStmt->rowCount() === 0) {
                jsonResponse(404, false, null, 'Availability slot not found');
            }

            jsonResponse(200, true, ['id' => $id, 'message' => 'Availability updated']);
        }

        $insertStmt = $pdo->prepare(
            'INSERT INTO availability_slots (user_id, day_of_week, start_time, end_time, created_at)
             VALUES (:user_id, :day_of_week, :start_time, :end_time, NOW())'
        );
        $insertStmt->execute([
            'user_id' => $user['id'],
            'day_of_week' => $dayOfWeek,
            'start_time' => $startTime,
            'end_time' => $endTime,
        ]);

        jsonResponse(201, true, [
            'id' => (int) $pdo->lastInsertId(),
            'message' => 'Availability added',
        ]);
    }

    public static function delete(PDO $pdo): void
    {
        $user = requireAuth($pdo);
        $input = jsonInput();
        requireFields($input, ['id']);

        $stmt = $pdo->prepare(
            'DELETE FROM availability_slots
             WHERE id = :id
               AND user_id = :user_id'
        );
        $stmt->execute([
            'id' => (int) $input['id'],
            'user_id' => $user['id'],
        ]);

        if ($stmt->rowCount() === 0) {
            jsonResponse(404, false, null, 'Availability slot not found');
        }

        jsonResponse(200, true, ['message' => 'Availability removed']);
    }
}

