import '../models/swap_request.dart';
import 'api_client.dart';

class SwapApi {
  SwapApi(this._client);

  final ApiClient _client;

  Future<void> requestSwap({
    required int toUserId,
    int? teachSkillId,
    int? learnSkillId,
    String? message,
    String? proposedTime,
  }) async {
    await _client.post('/swap/request', body: {
      'to_user_id': toUserId,
      'teach_skill_id': teachSkillId,
      'learn_skill_id': learnSkillId,
      'message': message,
      'proposed_time': proposedTime,
    });
  }

  Future<void> respond({
    required int swapRequestId,
    required String action,
  }) async {
    await _client.post('/swap/respond', body: {
      'swap_request_id': swapRequestId,
      'action': action,
    });
  }

  Future<void> complete(int swapRequestId) async {
    await _client.post('/swap/complete', body: {
      'swap_request_id': swapRequestId,
    });
  }

  Future<List<SwapRequest>> inbox() async {
    final data = await _client.get('/swap/inbox') as List<dynamic>;
    return data
        .map((dynamic item) => SwapRequest.fromJson(Map<String, dynamic>.from(item as Map), inbox: true))
        .toList();
  }

  Future<List<SwapRequest>> sent() async {
    final data = await _client.get('/swap/sent') as List<dynamic>;
    return data
        .map((dynamic item) => SwapRequest.fromJson(Map<String, dynamic>.from(item as Map), inbox: false))
        .toList();
  }
}

