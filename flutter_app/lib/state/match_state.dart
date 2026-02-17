import 'package:flutter/foundation.dart';

import '../api/api_client.dart';
import '../api/match_api.dart';
import '../models/match_user.dart';

class MatchState extends ChangeNotifier {
  MatchState(this._api);

  final MatchApi _api;
  List<MatchUser> _recommended = [];
  bool _loading = false;
  String? _error;

  List<MatchUser> get recommended => _recommended;
  bool get isLoading => _loading;
  String? get error => _error;

  Future<void> loadRecommended() async {
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      _recommended = await _api.recommended(limit: 25);
    } on ApiException catch (e) {
      _error = e.message;
    } finally {
      _loading = false;
      notifyListeners();
    }
  }
}

