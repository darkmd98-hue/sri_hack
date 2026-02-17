import 'api_client.dart';

class ProfileApi {
  ProfileApi(this._client);

  final ApiClient _client;

  Future<Map<String, dynamic>> updateProfile({
    String? name,
    String? dept,
    int? year,
    String? bio,
  }) async {
    final body = <String, dynamic>{};
    if (name != null) {
      body['name'] = name;
    }
    if (dept != null) {
      body['dept'] = dept;
    }
    if (year != null) {
      body['year'] = year;
    }
    if (bio != null) {
      body['bio'] = bio;
    }
    final data = await _client.post('/profile/update', body: body) as Map<String, dynamic>;
    return data;
  }

  Future<Map<String, dynamic>> uploadVerificationDoc({
    required String filePath,
    required String docType,
  }) async {
    final data = await _client.postMultipart(
      '/verification/upload-doc',
      fields: {'doc_type': docType},
      fileField: 'document',
      filePath: filePath,
    ) as Map<String, dynamic>;
    return data;
  }
}

