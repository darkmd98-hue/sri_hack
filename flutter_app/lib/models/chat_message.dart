class ChatMessage {
  ChatMessage({
    required this.id,
    required this.conversationId,
    required this.senderId,
    required this.content,
    required this.createdAt,
    this.messageType = 'text',
    this.isRead = false,
  });

  final int id;
  final int conversationId;
  final int senderId;
  final String content;
  final String createdAt;
  final String messageType;
  final bool isRead;

  factory ChatMessage.fromJson(Map<String, dynamic> json) {
    final rawRead = json['is_read'];
    return ChatMessage(
      id: _asInt(json['id']),
      conversationId: _asInt(json['conversation_id']),
      senderId: _asInt(json['sender_id']),
      content: (json['content'] ?? '') as String,
      createdAt: (json['created_at'] ?? '') as String,
      messageType: (json['message_type'] ?? 'text') as String,
      isRead: rawRead is bool ? rawRead : _asInt(rawRead) == 1,
    );
  }
}

int _asInt(dynamic value) {
  if (value is int) {
    return value;
  }
  return int.tryParse('$value') ?? 0;
}
