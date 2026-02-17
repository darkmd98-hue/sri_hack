import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../state/chat_state.dart';
import 'chat_screen.dart';

class ConversationsScreen extends StatefulWidget {
  const ConversationsScreen({super.key});

  @override
  State<ConversationsScreen> createState() => _ConversationsScreenState();
}

class _ConversationsScreenState extends State<ConversationsScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() => context.read<ChatState>().loadConversations());
  }

  @override
  Widget build(BuildContext context) {
    final state = context.watch<ChatState>();
    if (state.isLoading) {
      return const Center(child: CircularProgressIndicator());
    }
    if (state.error != null) {
      return Center(child: Text(state.error!));
    }
    if (state.conversations.isEmpty) {
      return const Center(child: Text('No conversations yet.'));
    }

    return RefreshIndicator(
      onRefresh: state.loadConversations,
      child: ListView.builder(
        itemCount: state.conversations.length,
        itemBuilder: (context, index) {
          final c = state.conversations[index];
          return ListTile(
            title: Text(c.otherUserName),
            subtitle: Text(c.lastMessage ?? 'No messages yet'),
            trailing: c.unreadCount > 0
                ? CircleAvatar(
                    radius: 10,
                    child: Text('${c.unreadCount}', style: const TextStyle(fontSize: 12)),
                  )
                : null,
            onTap: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (_) => ChatScreen(
                    conversationId: c.id,
                    title: c.otherUserName,
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}

