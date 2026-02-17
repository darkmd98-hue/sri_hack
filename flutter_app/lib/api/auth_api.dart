import '../models/user.dart';
import 'api_client.dart';

class AuthApi {
  AuthApi(this._client);

  final ApiClient _client;

  Future<(String, User)> login({
    required String email,
    required String password,
  }) async {
    final data = await _client.post('/auth/login', body: {
      'email': email,
      'password': password,
    }) as Map<String, dynamic>;
    return (
      data['token'] as String,
      User.fromJson(Map<String, dynamic>.from(data['user'] as Map)),
    );
  }

  Future<(String, User)> register({
    required String name,
    required String email,
    required String password,
  }) async {
    final data = await _client.post('/auth/register', body: {
      'name': name,
      'email': email,
      'password': password,
    }) as Map<String, dynamic>;
    return (
      data['token'] as String,
      User.fromJson(Map<String, dynamic>.from(data['user'] as Map)),
    );
  }

  Future<User> me() async {
    final data = await _client.get('/me') as Map<String, dynamic>;
    return User.fromJson(Map<String, dynamic>.from(data['user'] as Map));
  }

  Future<void> logout() async {
    await _client.post('/auth/logout');
  }
}

