import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../state/auth_state.dart';
import '../../state/chat_state.dart';

class ChatScreen extends StatefulWidget {
  const ChatScreen({
    super.key,
    required this.conversationId,
    required this.title,
  });

  final int conversationId;
  final String title;

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final _textController = TextEditingController();

  @override
  void initState() {
    super.initState();
    final chat = context.read<ChatState>();
    Future.microtask(() async {
      await chat.loadMessages(widget.conversationId);
      chat.startPolling(widget.conversationId);
    });
  }

  @override
  void dispose() {
    context.read<ChatState>().stopPolling(conversationId: widget.conversationId);
    _textController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final myId = context.watch<AuthState>().user?.id ?? -1;
    final chatState = context.watch<ChatState>();
    final messages = chatState.messagesFor(widget.conversationId);

    return Scaffold(
      appBar: AppBar(title: Text(widget.title)),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(12),
              itemCount: messages.length,
              itemBuilder: (context, index) {
                final message = messages[index];
                final mine = message.senderId == myId;
                return Align(
                  alignment: mine ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.symmetric(vertical: 4),
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    decoration: BoxDecoration(
                      color: mine ? Colors.green.shade100 : Colors.grey.shade200,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(message.content),
                  ),
                );
              },
            ),
          ),
          SafeArea(
            top: false,
            child: Padding(
              padding: const EdgeInsets.all(8),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _textController,
                      decoration: const InputDecoration(
                        hintText: 'Type message',
                        border: OutlineInputBorder(),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton(
                    onPressed: () async {
                      final text = _textController.text;
                      _textController.clear();
                      await chatState.sendMessage(widget.conversationId, text);
                    },
                    icon: const Icon(Icons.send),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

