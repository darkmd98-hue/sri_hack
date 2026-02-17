import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../state/match_state.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() => context.read<MatchState>().loadRecommended());
  }

  @override
  Widget build(BuildContext context) {
    final state = context.watch<MatchState>();
    if (state.isLoading) {
      return const Center(child: CircularProgressIndicator());
    }
    if (state.error != null) {
      return Center(child: Text(state.error!));
    }
    if (state.recommended.isEmpty) {
      return const Center(child: Text('No recommendations yet.'));
    }

    return RefreshIndicator(
      onRefresh: state.loadRecommended,
      child: ListView.separated(
        physics: const AlwaysScrollableScrollPhysics(),
        itemCount: state.recommended.length,
        separatorBuilder: (_, __) => const Divider(height: 1),
        itemBuilder: (context, index) {
          final user = state.recommended[index];
          return ListTile(
            leading: CircleAvatar(child: Text(user.name.isNotEmpty ? user.name[0].toUpperCase() : '?')),
            title: Text(user.name),
            subtitle: Text(
              'Match ${user.matchScore}% • Rating ${user.avgRating.toStringAsFixed(1)}\n'
              '${user.skills.join(', ')}',
            ),
            isThreeLine: true,
            trailing: user.verificationStatus == 'verified'
                ? const Icon(Icons.verified, color: Colors.green)
                : null,
          );
        },
      ),
    );
  }
}

