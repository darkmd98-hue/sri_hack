import 'dart:async';

import 'package:flutter/foundation.dart';

import '../api/api_client.dart';
import '../api/chat_api.dart';
import '../models/chat_message.dart';
import '../models/conversation.dart';

class ChatState extends ChangeNotifier {
  ChatState(this._api);

  final ChatApi _api;
  List<Conversation> _conversations = [];
  final Map<int, List<ChatMessage>> _messagesByConversation = <int, List<ChatMessage>>{};
  Timer? _pollTimer;
  int? _activeConversationId;
  bool _loading = false;
  String? _error;

  List<Conversation> get conversations => _conversations;
  bool get isLoading => _loading;
  String? get error => _error;

  List<ChatMessage> messagesFor(int conversationId) {
    return _messagesByConversation[conversationId] ?? const [];
  }

  Future<void> loadConversations() async {
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      _conversations = await _api.listConversations();
    } on ApiException catch (e) {
      _error = e.message;
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<void> loadMessages(int conversationId) async {
    try {
      final messages = await _api.messages(conversationId: conversationId, afterId: 0);
      _messagesByConversation[conversationId] = messages;
      notifyListeners();
    } on ApiException catch (e) {
      _error = e.message;
      notifyListeners();
    }
  }

  Future<void> sendMessage(int conversationId, String content) async {
    if (content.trim().isEmpty) {
      return;
    }
    try {
      final message = await _api.send(conversationId: conversationId, content: content.trim());
      final current = _messagesByConversation[conversationId] ?? <ChatMessage>[];
      _messagesByConversation[conversationId] = [...current, message];
      notifyListeners();
    } on ApiException catch (e) {
      _error = e.message;
      notifyListeners();
    }
  }

  void startPolling(int conversationId) {
    _activeConversationId = conversationId;
    _pollTimer?.cancel();
    _pollTimer = Timer.periodic(const Duration(seconds: 2), (_) async {
      final current = _messagesByConversation[conversationId] ?? const <ChatMessage>[];
      final afterId = current.isEmpty ? 0 : current.last.id;
      try {
        final fresh = await _api.messages(conversationId: conversationId, afterId: afterId);
        if (fresh.isEmpty) {
          return;
        }
        _messagesByConversation[conversationId] = [...current, ...fresh];
        notifyListeners();
      } on ApiException {
        // Poll errors are intentionally ignored to keep UI responsive.
      }
    });
  }

  void stopPolling({int? conversationId}) {
    if (conversationId != null && _activeConversationId != conversationId) {
      return;
    }
    _pollTimer?.cancel();
    _pollTimer = null;
    _activeConversationId = null;
  }

  @override
  void dispose() {
    _pollTimer?.cancel();
    super.dispose();
  }
}

