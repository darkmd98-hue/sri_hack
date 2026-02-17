class SwapRequest {
  SwapRequest({
    required this.id,
    required this.status,
    this.message,
    this.otherUserName,
    this.createdAt,
  });

  final int id;
  final String status;
  final String? message;
  final String? otherUserName;
  final String? createdAt;

  factory SwapRequest.fromJson(Map<String, dynamic> json, {required bool inbox}) {
    return SwapRequest(
      id: _asInt(json['id']),
      status: (json['status'] ?? 'pending') as String,
      message: json['message'] as String?,
      otherUserName: (inbox ? json['from_user_name'] : json['to_user_name']) as String?,
      createdAt: json['created_at'] as String?,
    );
  }
}

int _asInt(dynamic value) {
  if (value is int) {
    return value;
  }
  return int.tryParse('$value') ?? 0;
}
