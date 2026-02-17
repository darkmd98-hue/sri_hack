class Conversation {
  Conversation({
    required this.id,
    required this.otherUserId,
    required this.otherUserName,
    required this.unreadCount,
    this.lastMessage,
    this.lastMessageTime,
  });

  final int id;
  final int otherUserId;
  final String otherUserName;
  final int unreadCount;
  final String? lastMessage;
  final String? lastMessageTime;

  factory Conversation.fromJson(Map<String, dynamic> json) {
    return Conversation(
      id: _asInt(json['id']),
      otherUserId: _asInt(json['other_user_id']),
      otherUserName: (json['other_user_name'] ?? 'Unknown') as String,
      unreadCount: _asInt(json['unread_count']),
      lastMessage: json['last_message'] as String?,
      lastMessageTime: json['last_message_time'] as String?,
    );
  }
}

int _asInt(dynamic value) {
  if (value is int) {
    return value;
  }
  return int.tryParse('$value') ?? 0;
}
