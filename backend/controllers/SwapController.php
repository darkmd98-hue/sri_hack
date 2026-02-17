<?php
declare(strict_types=1);

final class SwapController
{
    public static function create(PDO $pdo): void
    {
        $user = requireAuth($pdo);
        $input = jsonInput();
        requireFields($input, ['to_user_id']);

        $toUserId = (int) $input['to_user_id'];
        $teachSkillId = isset($input['teach_skill_id']) ? (int) $input['teach_skill_id'] : null;
        $learnSkillId = isset($input['learn_skill_id']) ? (int) $input['learn_skill_id'] : null;
        $message = isset($input['message']) ? trim((string) $input['message']) : null;
        $proposedTime = isset($input['proposed_time']) ? (string) $input['proposed_time'] : null;

        if ($toUserId <= 0 || $toUserId === $user['id']) {
            jsonResponse(422, false, null, 'Invalid to_user_id');
        }

        $blockStmt = $pdo->prepare(
            'SELECT 1 FROM blocks
             WHERE (blocker_id = :from_1 AND blocked_id = :to_1)
                OR (blocker_id = :to_2 AND blocked_id = :from_2)
             LIMIT 1'
        );
        $blockStmt->execute([
            'from_1' => $user['id'],
            'to_1' => $toUserId,
            'to_2' => $toUserId,
            'from_2' => $user['id'],
        ]);
        if ($blockStmt->fetch()) {
            jsonResponse(403, false, null, 'Cannot create swap request due to block settings');
        }

        $stmt = $pdo->prepare(
            'INSERT INTO swap_requests
                (from_user_id, to_user_id, teach_skill_id, learn_skill_id, message, status, proposed_time, created_at, updated_at)
             VALUES
                (:from_user_id, :to_user_id, :teach_skill_id, :learn_skill_id, :message, \'pending\', :proposed_time, NOW(), NOW())'
        );
        $stmt->execute([
            'from_user_id' => $user['id'],
            'to_user_id' => $toUserId,
            'teach_skill_id' => $teachSkillId,
            'learn_skill_id' => $learnSkillId,
            'message' => $message,
            'proposed_time' => $proposedTime,
        ]);

        jsonResponse(201, true, ['swap_request_id' => (int) $pdo->lastInsertId()]);
    }

    public static function respond(PDO $pdo): void
    {
        $user = requireAuth($pdo);
        $input = jsonInput();
        requireFields($input, ['swap_request_id', 'action']);

        $swapId = (int) $input['swap_request_id'];
        $action = (string) $input['action'];
        if (!in_array($action, ['accept', 'reject', 'cancel'], true)) {
            jsonResponse(422, false, null, 'Invalid action');
        }

        $requestStmt = $pdo->prepare(
            'SELECT id, from_user_id, to_user_id, status
             FROM swap_requests
             WHERE id = :id
             LIMIT 1'
        );
        $requestStmt->execute(['id' => $swapId]);
        $swap = $requestStmt->fetch();
        if (!$swap) {
            jsonResponse(404, false, null, 'Swap request not found');
        }
        if ($swap['status'] !== 'pending') {
            jsonResponse(409, false, null, 'Swap request is already finalized');
        }

        $nextStatus = '';
        if ($action === 'cancel') {
            if ((int) $swap['from_user_id'] !== $user['id']) {
                jsonResponse(403, false, null, 'Only requester can cancel');
            }
            $nextStatus = 'cancelled';
        } elseif ($action === 'accept') {
            if ((int) $swap['to_user_id'] !== $user['id']) {
                jsonResponse(403, false, null, 'Only receiver can accept');
            }
            $nextStatus = 'accepted';
        } else {
            if ((int) $swap['to_user_id'] !== $user['id']) {
                jsonResponse(403, false, null, 'Only receiver can reject');
            }
            $nextStatus = 'rejected';
        }

        $conversationId = null;
        $pdo->beginTransaction();
        try {
            if ($nextStatus === 'accepted') {
                $conversationId = ChatService::startConversation(
                    $pdo,
                    (int) $swap['from_user_id'],
                    (int) $swap['to_user_id']
                );
            }

            $updateStmt = $pdo->prepare(
                'UPDATE swap_requests
                 SET status = :status,
                     conversation_id = :conversation_id,
                     updated_at = NOW()
                 WHERE id = :id'
            );
            $updateStmt->execute([
                'status' => $nextStatus,
                'conversation_id' => $conversationId,
                'id' => $swapId,
            ]);
            $pdo->commit();
        } catch (Throwable $error) {
            $pdo->rollBack();
            throw $error;
        }

        jsonResponse(200, true, [
            'swap_request_id' => $swapId,
            'status' => $nextStatus,
            'conversation_id' => $conversationId,
        ]);
    }

    public static function complete(PDO $pdo): void
    {
        $user = requireAuth($pdo);
        $input = jsonInput();
        requireFields($input, ['swap_request_id']);
        $swapId = (int) $input['swap_request_id'];

        $stmt = $pdo->prepare(
            'UPDATE swap_requests
             SET status = \'completed\', updated_at = NOW()
             WHERE id = :id
               AND status = \'accepted\'
               AND (from_user_id = :user_1 OR to_user_id = :user_2)'
        );
        $stmt->execute([
            'id' => $swapId,
            'user_1' => $user['id'],
            'user_2' => $user['id'],
        ]);

        if ($stmt->rowCount() === 0) {
            jsonResponse(404, false, null, 'Accepted swap request not found');
        }
        jsonResponse(200, true, ['swap_request_id' => $swapId, 'status' => 'completed']);
    }

    public static function inbox(PDO $pdo): void
    {
        $user = requireAuth($pdo);
        $stmt = $pdo->prepare(
            'SELECT
                sr.id,
                sr.from_user_id,
                sr.to_user_id,
                sr.teach_skill_id,
                sr.learn_skill_id,
                sr.message,
                sr.status,
                sr.proposed_time,
                sr.conversation_id,
                sr.created_at,
                sr.updated_at,
                fu.name AS from_user_name,
                ts.name AS teach_skill_name,
                ls.name AS learn_skill_name
             FROM swap_requests sr
             INNER JOIN users fu ON fu.id = sr.from_user_id
             LEFT JOIN skills ts ON ts.id = sr.teach_skill_id
             LEFT JOIN skills ls ON ls.id = sr.learn_skill_id
             WHERE sr.to_user_id = :user_id
             ORDER BY sr.updated_at DESC'
        );
        $stmt->execute(['user_id' => $user['id']]);
        jsonResponse(200, true, $stmt->fetchAll());
    }

    public static function sent(PDO $pdo): void
    {
        $user = requireAuth($pdo);
        $stmt = $pdo->prepare(
            'SELECT
                sr.id,
                sr.from_user_id,
                sr.to_user_id,
                sr.teach_skill_id,
                sr.learn_skill_id,
                sr.message,
                sr.status,
                sr.proposed_time,
                sr.conversation_id,
                sr.created_at,
                sr.updated_at,
                tu.name AS to_user_name,
                ts.name AS teach_skill_name,
                ls.name AS learn_skill_name
             FROM swap_requests sr
             INNER JOIN users tu ON tu.id = sr.to_user_id
             LEFT JOIN skills ts ON ts.id = sr.teach_skill_id
             LEFT JOIN skills ls ON ls.id = sr.learn_skill_id
             WHERE sr.from_user_id = :user_id
             ORDER BY sr.updated_at DESC'
        );
        $stmt->execute(['user_id' => $user['id']]);
        jsonResponse(200, true, $stmt->fetchAll());
    }
}

