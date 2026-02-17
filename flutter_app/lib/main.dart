import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'api/api_client.dart';
import 'api/auth_api.dart';
import 'api/chat_api.dart';
import 'api/match_api.dart';
import 'api/profile_api.dart';
import 'api/review_api.dart';
import 'api/safety_api.dart';
import 'api/skills_api.dart';
import 'api/swap_api.dart';
import 'core/token_storage.dart';
import 'screens/app_shell.dart';
import 'screens/auth/auth_screen.dart';
import 'state/auth_state.dart';
import 'state/chat_state.dart';
import 'state/match_state.dart';
import 'state/request_state.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  final tokenStorage = TokenStorage();
  final apiClient = ApiClient(tokenStorage);

  runApp(
    MultiProvider(
      providers: [
        Provider<TokenStorage>.value(value: tokenStorage),
        Provider<ApiClient>.value(value: apiClient),
        Provider<AuthApi>(create: (_) => AuthApi(apiClient)),
        Provider<MatchApi>(create: (_) => MatchApi(apiClient)),
        Provider<SkillsApi>(create: (_) => SkillsApi(apiClient)),
        Provider<SwapApi>(create: (_) => SwapApi(apiClient)),
        Provider<ChatApi>(create: (_) => ChatApi(apiClient)),
        Provider<ProfileApi>(create: (_) => ProfileApi(apiClient)),
        Provider<ReviewApi>(create: (_) => ReviewApi(apiClient)),
        Provider<SafetyApi>(create: (_) => SafetyApi(apiClient)),
        ChangeNotifierProvider<AuthState>(
          create: (context) => AuthState(
            context.read<AuthApi>(),
            context.read<TokenStorage>(),
          )..bootstrap(),
        ),
        ChangeNotifierProvider<MatchState>(
          create: (context) => MatchState(context.read<MatchApi>()),
        ),
        ChangeNotifierProvider<RequestState>(
          create: (context) => RequestState(context.read<SwapApi>()),
        ),
        ChangeNotifierProvider<ChatState>(
          create: (context) => ChatState(context.read<ChatApi>()),
        ),
      ],
      child: const SkillSwapApp(),
    ),
  );
}

class SkillSwapApp extends StatelessWidget {
  const SkillSwapApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Skill Swap',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF0A7A5A)),
        useMaterial3: true,
      ),
      home: Consumer<AuthState>(
        builder: (context, auth, _) {
          if (auth.isLoading) {
            return const Scaffold(
              body: Center(child: CircularProgressIndicator()),
            );
          }
          return auth.isLoggedIn ? const AppShell() : const AuthScreen();
        },
      ),
    );
  }
}

