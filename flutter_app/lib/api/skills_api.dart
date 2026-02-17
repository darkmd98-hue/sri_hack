import 'api_client.dart';

class SkillsApi {
  SkillsApi(this._client);

  final ApiClient _client;

  Future<List<Map<String, dynamic>>> listSkills() async {
    final data = await _client.get('/skills/list') as List<dynamic>;
    return data.map((dynamic e) => Map<String, dynamic>.from(e as Map)).toList();
  }

  Future<List<Map<String, dynamic>>> searchTeach({
    String? query,
    int? skillId,
    String? level,
    String? mode,
  }) async {
    final params = <String, String>{};
    if (query != null && query.isNotEmpty) {
      params['q'] = query;
    }
    if (skillId != null) {
      params['skill_id'] = '$skillId';
    }
    if (level != null && level.isNotEmpty) {
      params['level'] = level;
    }
    if (mode != null && mode.isNotEmpty) {
      params['mode'] = mode;
    }

    final data = await _client.get('/teach/search', query: params) as List<dynamic>;
    return data.map((dynamic e) => Map<String, dynamic>.from(e as Map)).toList();
  }

  Future<void> addTeach({
    required int skillId,
    required String level,
    required String mode,
    String? description,
  }) async {
    await _client.post('/teach/add', body: {
      'skill_id': skillId,
      'level': level,
      'mode': mode,
      'description': description,
    });
  }

  Future<void> addLearn({
    required int skillId,
    required String levelNeeded,
    String? notes,
  }) async {
    await _client.post('/learn/add', body: {
      'skill_id': skillId,
      'level_needed': levelNeeded,
      'notes': notes,
    });
  }
}

