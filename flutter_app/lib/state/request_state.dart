import 'package:flutter/foundation.dart';

import '../api/api_client.dart';
import '../api/swap_api.dart';
import '../models/swap_request.dart';

class RequestState extends ChangeNotifier {
  RequestState(this._api);

  final SwapApi _api;
  List<SwapRequest> _inbox = [];
  List<SwapRequest> _sent = [];
  bool _loading = false;
  String? _error;

  List<SwapRequest> get inbox => _inbox;
  List<SwapRequest> get sent => _sent;
  bool get isLoading => _loading;
  String? get error => _error;

  Future<void> refresh() async {
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      _inbox = await _api.inbox();
      _sent = await _api.sent();
    } on ApiException catch (e) {
      _error = e.message;
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<void> respond(int requestId, String action) async {
    await _api.respond(swapRequestId: requestId, action: action);
    await refresh();
  }
}

