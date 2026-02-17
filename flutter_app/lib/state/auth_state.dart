import 'package:flutter/foundation.dart';

import '../api/auth_api.dart';
import '../api/api_client.dart';
import '../core/token_storage.dart';
import '../models/user.dart';

class AuthState extends ChangeNotifier {
  AuthState(this._authApi, this._tokenStorage);

  final AuthApi _authApi;
  final TokenStorage _tokenStorage;

  User? _user;
  bool _loading = false;
  String? _error;

  User? get user => _user;
  bool get isLoading => _loading;
  String? get error => _error;
  bool get isLoggedIn => _user != null;

  Future<void> bootstrap() async {
    _loading = true;
    notifyListeners();
    try {
      final token = await _tokenStorage.readToken();
      if (token == null || token.isEmpty) {
        _user = null;
      } else {
        _user = await _authApi.me();
      }
      _error = null;
    } on ApiException catch (e) {
      _error = e.message;
      _user = null;
      await _tokenStorage.clearToken();
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<bool> login(String email, String password) async {
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      final (token, user) = await _authApi.login(email: email, password: password);
      await _tokenStorage.saveToken(token);
      _user = user;
      return true;
    } on ApiException catch (e) {
      _error = e.message;
      return false;
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<bool> register(String name, String email, String password) async {
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      final (token, user) = await _authApi.register(name: name, email: email, password: password);
      await _tokenStorage.saveToken(token);
      _user = user;
      return true;
    } on ApiException catch (e) {
      _error = e.message;
      return false;
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    _loading = true;
    notifyListeners();
    try {
      await _authApi.logout();
    } catch (_) {
      // Ignore API logout errors and clear local session.
    }
    await _tokenStorage.clearToken();
    _user = null;
    _error = null;
    _loading = false;
    notifyListeners();
  }
}

