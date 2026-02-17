import '../models/chat_message.dart';
import '../models/conversation.dart';
import 'api_client.dart';

class ChatApi {
  ChatApi(this._client);

  final ApiClient _client;

  Future<int> startConversation(int otherUserId) async {
    final data = await _client.post('/chat/start', body: {
      'other_user_id': otherUserId,
    }) as Map<String, dynamic>;
    return data['conversation_id'] as int;
  }

  Future<List<Conversation>> listConversations() async {
    final data = await _client.get('/chat/conversations') as List<dynamic>;
    return data
        .map((dynamic e) => Conversation.fromJson(Map<String, dynamic>.from(e as Map)))
        .toList();
  }

  Future<List<ChatMessage>> messages({
    required int conversationId,
    int afterId = 0,
  }) async {
    final data = await _client.get('/chat/messages', query: {
      'conversation_id': '$conversationId',
      'after_id': '$afterId',
    }) as List<dynamic>;
    return data
        .map((dynamic e) => ChatMessage.fromJson(Map<String, dynamic>.from(e as Map)))
        .toList();
  }

  Future<List<ChatMessage>> longPoll({
    required int conversationId,
    int afterId = 0,
    int timeout = 30,
  }) async {
    final data = await _client.get('/chat/longpoll', query: {
      'conversation_id': '$conversationId',
      'after_id': '$afterId',
      'timeout': '$timeout',
    }) as Map<String, dynamic>;
    final messages = data['messages'] as List<dynamic>? ?? const [];
    return messages
        .map((dynamic e) => ChatMessage.fromJson(Map<String, dynamic>.from(e as Map)))
        .toList();
  }

  Future<ChatMessage> send({
    required int conversationId,
    required String content,
  }) async {
    final data = await _client.post('/chat/send', body: {
      'conversation_id': conversationId,
      'content': content,
      'message_type': 'text',
    }) as Map<String, dynamic>;
    return ChatMessage.fromJson(data);
  }

  Future<void> markRead(int conversationId) async {
    await _client.post('/chat/mark-read', body: {
      'conversation_id': conversationId,
    });
  }
}

