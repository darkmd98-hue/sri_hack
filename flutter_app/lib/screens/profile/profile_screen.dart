import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../api/profile_api.dart';
import '../../models/user.dart';
import '../../state/auth_state.dart';
import '../verification/verification_screen.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _nameController = TextEditingController();
  final _deptController = TextEditingController();
  final _yearController = TextEditingController();
  final _bioController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _deptController.dispose();
    _yearController.dispose();
    _bioController.dispose();
    super.dispose();
  }

  void _loadFromUser(User? user) {
    if (user == null) {
      return;
    }
    _nameController.text = user.name;
    _deptController.text = user.dept ?? '';
    _yearController.text = user.year?.toString() ?? '';
    _bioController.text = user.bio ?? '';
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthState>();
    _loadFromUser(auth.user);
    final user = auth.user;
    if (user == null) {
      return const Center(child: Text('Please login.'));
    }

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        ListTile(
          title: Text(user.name),
          subtitle: Text(user.email),
          trailing: Chip(
            label: Text(user.verificationStatus ?? 'unverified'),
          ),
        ),
        const SizedBox(height: 12),
        TextField(controller: _nameController, decoration: const InputDecoration(labelText: 'Name')),
        const SizedBox(height: 8),
        TextField(controller: _deptController, decoration: const InputDecoration(labelText: 'Department')),
        const SizedBox(height: 8),
        TextField(
          controller: _yearController,
          decoration: const InputDecoration(labelText: 'Year'),
          keyboardType: TextInputType.number,
        ),
        const SizedBox(height: 8),
        TextField(
          controller: _bioController,
          decoration: const InputDecoration(labelText: 'Bio'),
          maxLines: 3,
        ),
        const SizedBox(height: 12),
        FilledButton(
          onPressed: () async {
            final profileApi = context.read<ProfileApi>();
            await profileApi.updateProfile(
              name: _nameController.text.trim(),
              dept: _deptController.text.trim(),
              year: int.tryParse(_yearController.text.trim()),
              bio: _bioController.text.trim(),
            );
            if (mounted) {
              await context.read<AuthState>().bootstrap();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Profile updated')),
              );
            }
          },
          child: const Text('Save Profile'),
        ),
        const SizedBox(height: 8),
        OutlinedButton.icon(
          onPressed: () {
            Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => const VerificationScreen()),
            );
          },
          icon: const Icon(Icons.verified_user),
          label: const Text('Upload Verification Doc'),
        ),
      ],
    );
  }
}

