import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../state/auth_state.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  bool _registerMode = false;

  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final auth = context.read<AuthState>();
    final email = _emailController.text.trim();
    final password = _passwordController.text;
    if (_registerMode) {
      await auth.register(_nameController.text.trim(), email, password);
    } else {
      await auth.login(email, password);
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthState>();
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 420),
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(_registerMode ? 'Create account' : 'Welcome back', style: Theme.of(context).textTheme.headlineMedium),
                  const SizedBox(height: 20),
                  if (_registerMode) ...[
                    TextField(
                      controller: _nameController,
                      decoration: const InputDecoration(labelText: 'Name'),
                    ),
                    const SizedBox(height: 12),
                  ],
                  TextField(
                    controller: _emailController,
                    decoration: const InputDecoration(labelText: 'Email'),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _passwordController,
                    obscureText: true,
                    decoration: const InputDecoration(labelText: 'Password'),
                  ),
                  if (auth.error != null) ...[
                    const SizedBox(height: 12),
                    Text(
                      auth.error!,
                      style: const TextStyle(color: Colors.red),
                    ),
                  ],
                  const SizedBox(height: 16),
                  FilledButton(
                    onPressed: auth.isLoading ? null : _submit,
                    child: auth.isLoading
                        ? const SizedBox(
                            width: 18,
                            height: 18,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : Text(_registerMode ? 'Register' : 'Login'),
                  ),
                  const SizedBox(height: 8),
                  TextButton(
                    onPressed: auth.isLoading
                        ? null
                        : () => setState(() => _registerMode = !_registerMode),
                    child: Text(_registerMode ? 'Already have an account? Login' : 'New here? Register'),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

