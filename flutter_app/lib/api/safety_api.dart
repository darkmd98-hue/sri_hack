import 'api_client.dart';

class SafetyApi {
  SafetyApi(this._client);

  final ApiClient _client;

  Future<void> blockUser(int blockedId) async {
    await _client.post('/block', body: {
      'blocked_id': blockedId,
    });
  }

  Future<void> reportUser({
    required int reportedId,
    required String reason,
    String? details,
  }) async {
    await _client.post('/report', body: {
      'reported_id': reportedId,
      'reason': reason,
      'details': details,
    });
  }
}

