import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../state/auth_state.dart';
import 'chats/conversations_screen.dart';
import 'explore/explore_screen.dart';
import 'home/home_screen.dart';
import 'profile/profile_screen.dart';
import 'requests/requests_screen.dart';

class AppShell extends StatefulWidget {
  const AppShell({super.key});

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  int _index = 0;

  final _pages = const [
    HomeScreen(),
    ExploreScreen(),
    RequestsScreen(),
    ConversationsScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthState>();
    return Scaffold(
      appBar: AppBar(
        title: const Text('Skill Swap'),
        actions: [
          IconButton(
            onPressed: auth.isLoading ? null : auth.logout,
            icon: const Icon(Icons.logout),
            tooltip: 'Logout',
          ),
        ],
      ),
      body: _pages[_index],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (index) => setState(() => _index = index),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_outlined), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.explore_outlined), label: 'Explore'),
          NavigationDestination(icon: Icon(Icons.swap_horiz), label: 'Requests'),
          NavigationDestination(icon: Icon(Icons.chat_bubble_outline), label: 'Chats'),
          NavigationDestination(icon: Icon(Icons.person_outline), label: 'Profile'),
        ],
      ),
    );
  }
}

