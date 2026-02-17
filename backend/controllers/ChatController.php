<?php
declare(strict_types=1);

final class ChatController
{
    public static function start(PDO $pdo): void
    {
        $user = requireAuth($pdo);
        $input = jsonInput();
        requireFields($input, ['other_user_id']);

        $otherUserId = (int) $input['other_user_id'];
        $conversationId = ChatService::startConversation($pdo, $user['id'], $otherUserId);
        jsonResponse(201, true, ['conversation_id' => $conversationId]);
    }

    public static function listConversations(PDO $pdo): void
    {
        $user = requireAuth($pdo);
        $conversations = ChatService::listConversations($pdo, $user['id']);
        jsonResponse(200, true, $conversations);
    }

    public static function messages(PDO $pdo): void
    {
        $user = requireAuth($pdo);
        $conversationId = intQuery('conversation_id', 0);
        if ($conversationId <= 0) {
            jsonResponse(422, false, null, 'conversation_id is required');
        }
        $afterId = intQuery('after_id', 0);
        $limit = intQuery('limit', 100);

        $messages = ChatService::fetchMessages($pdo, $conversationId, $user['id'], $afterId, $limit);
        jsonResponse(200, true, $messages);
    }

    public static function longPoll(PDO $pdo): void
    {
        $user = requireAuth($pdo);
        $conversationId = intQuery('conversation_id', 0);
        if ($conversationId <= 0) {
            jsonResponse(422, false, null, 'conversation_id is required');
        }
        $afterId = intQuery('after_id', 0);
        $timeout = intQuery('timeout', 30);

        $messages = ChatService::longPollMessages($pdo, $conversationId, $user['id'], $afterId, $timeout);
        jsonResponse(200, true, [
            'messages' => $messages,
            'timed_out' => $messages === [],
        ]);
    }

    public static function send(PDO $pdo): void
    {
        $user = requireAuth($pdo);
        $input = jsonInput();
        requireFields($input, ['conversation_id', 'content']);

        $conversationId = (int) $input['conversation_id'];
        $content = (string) $input['content'];
        $messageType = isset($input['message_type']) ? (string) $input['message_type'] : 'text';

        $message = ChatService::sendMessage($pdo, $conversationId, $user['id'], $content, $messageType);
        jsonResponse(201, true, $message);
    }

    public static function markRead(PDO $pdo): void
    {
        $user = requireAuth($pdo);
        $input = jsonInput();
        requireFields($input, ['conversation_id']);
        $conversationId = (int) $input['conversation_id'];
        ChatService::assertParticipant($pdo, $conversationId, $user['id']);

        $stmt = $pdo->prepare(
            'UPDATE messages
             SET is_read = 1
             WHERE conversation_id = :conversation_id
               AND sender_id <> :viewer_id
               AND is_read = 0'
        );
        $stmt->execute([
            'conversation_id' => $conversationId,
            'viewer_id' => $user['id'],
        ]);

        jsonResponse(200, true, ['updated' => $stmt->rowCount()]);
    }
}

