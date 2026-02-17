import 'api_client.dart';

class ReviewApi {
  ReviewApi(this._client);

  final ApiClient _client;

  Future<void> addReview({
    required int swapRequestId,
    required int rating,
    String? comment,
  }) async {
    await _client.post('/review/add', body: {
      'swap_request_id': swapRequestId,
      'rating': rating,
      'comment': comment,
    });
  }

  Future<Map<String, dynamic>> userReviews(int userId) async {
    final data = await _client.get('/review/user/$userId') as Map<String, dynamic>;
    return data;
  }
}

