import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../state/request_state.dart';

class RequestsScreen extends StatefulWidget {
  const RequestsScreen({super.key});

  @override
  State<RequestsScreen> createState() => _RequestsScreenState();
}

class _RequestsScreenState extends State<RequestsScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() => context.read<RequestState>().refresh());
  }

  @override
  Widget build(BuildContext context) {
    final state = context.watch<RequestState>();
    return DefaultTabController(
      length: 2,
      child: Column(
        children: [
          const TabBar(
            tabs: [
              Tab(text: 'Inbox'),
              Tab(text: 'Sent'),
            ],
          ),
          if (state.isLoading) const LinearProgressIndicator(),
          Expanded(
            child: TabBarView(
              children: [
                _RequestList(
                  isInbox: true,
                  state: state,
                ),
                _RequestList(
                  isInbox: false,
                  state: state,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _RequestList extends StatelessWidget {
  const _RequestList({
    required this.isInbox,
    required this.state,
  });

  final bool isInbox;
  final RequestState state;

  @override
  Widget build(BuildContext context) {
    final items = isInbox ? state.inbox : state.sent;
    if (items.isEmpty) {
      return Center(
        child: Text(isInbox ? 'No incoming requests' : 'No sent requests'),
      );
    }

    return RefreshIndicator(
      onRefresh: state.refresh,
      child: ListView.builder(
        itemCount: items.length,
        itemBuilder: (context, index) {
          final request = items[index];
          return ListTile(
            title: Text(request.otherUserName ?? 'Unknown'),
            subtitle: Text('${request.status} • ${request.message ?? ''}'),
            trailing: isInbox && request.status == 'pending'
                ? Wrap(
                    spacing: 8,
                    children: [
                      IconButton(
                        onPressed: () => state.respond(request.id, 'accept'),
                        icon: const Icon(Icons.check, color: Colors.green),
                      ),
                      IconButton(
                        onPressed: () => state.respond(request.id, 'reject'),
                        icon: const Icon(Icons.close, color: Colors.red),
                      ),
                    ],
                  )
                : null,
          );
        },
      ),
    );
  }
}

