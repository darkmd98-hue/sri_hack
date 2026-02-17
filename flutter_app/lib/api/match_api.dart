import '../models/match_user.dart';
import 'api_client.dart';

class MatchApi {
  MatchApi(this._client);

  final ApiClient _client;

  Future<List<MatchUser>> recommended({int limit = 25}) async {
    final data = await _client.get('/match/recommended', query: {'limit': '$limit'}) as List<dynamic>;
    return data
        .map((dynamic item) => MatchUser.fromJson(Map<String, dynamic>.from(item as Map)))
        .toList();
  }
}

