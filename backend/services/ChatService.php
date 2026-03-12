<?php
declare(strict_types=1);

final class ChatService
{
    public static function startConversation(PDO $pdo, int $userA, int $userB): int
    {
        if ($userA === $userB) {
            jsonResponse(422, false, null, 'Cannot start a conversation with yourself');
        }

        $small = min($userA, $userB);
        $large = max($userA, $userB);

        $blockStmt = $pdo->prepare(
            'SELECT 1 FROM blocks
             WHERE (blocker_id = :a1 AND blocked_id = :b1)
                OR (blocker_id = :a2 AND blocked_id = :b2)
             LIMIT 1'
        );
        $blockStmt->execute([
            'a1' => $small,
            'b1' => $large,
            'a2' => $large,
            'b2' => $small,
        ]);
        if ($blockStmt->fetch()) {
            jsonResponse(403, false, null, 'Cannot start conversation due to block settings');
        }

        $findStmt = $pdo->prepare(
            'SELECT id
             FROM conversations
             WHERE user1_id = :user1 AND user2_id = :user2
             LIMIT 1'
        );
        $findStmt->execute([
            'user1' => $small,
            'user2' => $large,
        ]);
        $conversation = $findStmt->fetch();
        if ($conversation) {
            return (int) $conversation['id'];
        }

        $insertStmt = $pdo->prepare(
            'INSERT INTO conversations (user1_id, user2_id, last_message_at, created_at)
             VALUES (:user1, :user2, NOW(), NOW())'
        );
        $insertStmt->execute([
            'user1' => $small,
            'user2' => $large,
        ]);

        return (int) $pdo->lastInsertId();
    }

    public static function assertParticipant(PDO $pdo, int $conversationId, int $userId): void
    {
        $stmt = $pdo->prepare(
            'SELECT 1
             FROM conversations
             WHERE id = :conversation_id
               AND (user1_id = :user_id_1 OR user2_id = :user_id_2)
             LIMIT 1'
        );
        $stmt->execute([
            'conversation_id' => $conversationId,
            'user_id_1' => $userId,
            'user_id_2' => $userId,
        ]);

        if (!$stmt->fetch()) {
            jsonResponse(403, false, null, 'Not authorized for this conversation');
        }
    }

    public static function listConversations(PDO $pdo, int $userId): array
    {
        $stmt = $pdo->prepare(
            'SELECT
                c.id,
                c.last_message_at,
                u.id AS other_user_id,
                u.name AS other_user_name,
                u.avatar_url AS other_user_avatar,
                u.verification_status AS other_user_verification_status,
                m.content AS last_message,
                m.created_at AS last_message_time,
                (
                    SELECT COUNT(*)
                    FROM messages um
                    WHERE um.conversation_id = c.id
                      AND um.sender_id <> :viewer_id_1
                      AND um.is_read = 0
                ) AS unread_count
            FROM conversations c
            INNER JOIN users u
                ON u.id = CASE
                    WHEN c.user1_id = :viewer_id_2 THEN c.user2_id
                    ELSE c.user1_id
                END
            LEFT JOIN messages m
                ON m.id = (
                    SELECT id
                    FROM messages mm
                    WHERE mm.conversation_id = c.id
                    ORDER BY mm.id DESC
                    LIMIT 1
                )
            WHERE c.user1_id = :viewer_id_3 OR c.user2_id = :viewer_id_4
            ORDER BY c.last_message_at DESC'
        );
        $stmt->execute([
            'viewer_id_1' => $userId,
            'viewer_id_2' => $userId,
            'viewer_id_3' => $userId,
            'viewer_id_4' => $userId,
        ]);

        return $stmt->fetchAll();
    }

    public static function sendMessage(
        PDO $pdo,
        int $conversationId,
        int $senderId,
        string $content,
        string $messageType = 'text'
    ): array {
        self::assertParticipant($pdo, $conversationId, $senderId);
        if (trim($content) === '') {
            jsonResponse(422, false, null, 'Message content is required');
        }

        if (!in_array($messageType, ['text', 'image'], true)) {
            jsonResponse(422, false, null, 'Invalid message type');
        }

        $insertStmt = $pdo->prepare(
            'INSERT INTO messages (conversation_id, sender_id, message_type, content, created_at, is_read)
             VALUES (:conversation_id, :sender_id, :message_type, :content, NOW(), 0)'
        );
        $insertStmt->execute([
            'conversation_id' => $conversationId,
            'sender_id' => $senderId,
            'message_type' => $messageType,
            'content' => $content,
        ]);

        $messageId = (int) $pdo->lastInsertId();
        $touchStmt = $pdo->prepare(
            'UPDATE conversations SET last_message_at = NOW() WHERE id = :conversation_id'
        );
        $touchStmt->execute(['conversation_id' => $conversationId]);

        $fetchStmt = $pdo->prepare(
            'SELECT id, conversation_id, sender_id, message_type, content, created_at, is_read
             FROM messages
             WHERE id = :id'
        );
        $fetchStmt->execute(['id' => $messageId]);
        $message = $fetchStmt->fetch();

        return $message ?: [];
    }

    public static function fetchMessages(
        PDO $pdo,
        int $conversationId,
        int $viewerId,
        int $afterId = 0,
        int $limit = 100
    ): array {
        self::assertParticipant($pdo, $conversationId, $viewerId);
        $limit = max(1, min(200, $limit));

        $stmt = $pdo->prepare(
            'SELECT id, conversation_id, sender_id, message_type, content, created_at, is_read
             FROM messages
             WHERE conversation_id = :conversation_id
               AND id > :after_id
             ORDER BY id ASC
             LIMIT :limit'
        );
        $stmt->bindValue('conversation_id', $conversationId, PDO::PARAM_INT);
        $stmt->bindValue('after_id', $afterId, PDO::PARAM_INT);
        $stmt->bindValue('limit', $limit, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    public static function longPollMessages(
        PDO $pdo,
        int $conversationId,
        int $viewerId,
        int $afterId,
        int $timeoutSeconds
    ): array {
        $timeoutSeconds = max(5, min(60, $timeoutSeconds));
        $start = time();
        set_time_limit($timeoutSeconds + 5);

        while ((time() - $start) < $timeoutSeconds) {
            $messages = self::fetchMessages($pdo, $conversationId, $viewerId, $afterId, 200);
            if ($messages !== []) {
                return $messages;
            }
            // 2.5s keeps long-poll latency acceptable while avoiding the heavier DB churn from sub-second polling.
            usleep(2500000);
        }

        return [];
    }
}

