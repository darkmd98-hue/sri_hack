import 'dart:convert';

import 'package:http/http.dart' as http;

import '../core/app_config.dart';
import '../core/token_storage.dart';

class ApiException implements Exception {
  final String message;
  final int? statusCode;

  ApiException(this.message, {this.statusCode});

  @override
  String toString() => 'ApiException($statusCode): $message';
}

class ApiClient {
  ApiClient(this._tokenStorage);

  final TokenStorage _tokenStorage;

  Uri _buildUri(String route, [Map<String, String>? query]) {
    final normalizedRoute = route.startsWith('/') ? route.substring(1) : route;
    return Uri.parse(AppConfig.baseUrl).replace(
      queryParameters: <String, String>{
        'route': normalizedRoute,
        ...?query,
      },
    );
  }

  Future<Map<String, String>> _headers({bool jsonBody = true}) async {
    final token = await _tokenStorage.readToken();
    final headers = <String, String>{};
    if (jsonBody) {
      headers['Content-Type'] = 'application/json';
    }
    if (token != null && token.isNotEmpty) {
      headers['Authorization'] = 'Bearer $token';
    }
    return headers;
  }

  Future<dynamic> get(String route, {Map<String, String>? query}) async {
    final response = await http.get(
      _buildUri(route, query),
      headers: await _headers(),
    );
    return _decodeResponse(response);
  }

  Future<dynamic> post(String route, {Map<String, dynamic>? body}) async {
    final response = await http.post(
      _buildUri(route),
      headers: await _headers(),
      body: jsonEncode(body ?? <String, dynamic>{}),
    );
    return _decodeResponse(response);
  }

  Future<dynamic> postMultipart(
    String route, {
    required Map<String, String> fields,
    required String fileField,
    required String filePath,
  }) async {
    final request = http.MultipartRequest('POST', _buildUri(route));
    final token = await _tokenStorage.readToken();
    if (token != null && token.isNotEmpty) {
      request.headers['Authorization'] = 'Bearer $token';
    }
    request.fields.addAll(fields);
    request.files.add(await http.MultipartFile.fromPath(fileField, filePath));
    final streamed = await request.send();
    final response = await http.Response.fromStream(streamed);
    return _decodeResponse(response);
  }

  dynamic _decodeResponse(http.Response response) {
    final Map<String, dynamic> payload = jsonDecode(response.body) as Map<String, dynamic>;
    final success = payload['success'] == true;
    if (response.statusCode >= 200 && response.statusCode < 300 && success) {
      return payload['data'];
    }
    throw ApiException(
      (payload['error'] ?? 'Request failed').toString(),
      statusCode: response.statusCode,
    );
  }
}

