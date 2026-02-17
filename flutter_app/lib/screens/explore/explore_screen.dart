import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../api/skills_api.dart';

class ExploreScreen extends StatefulWidget {
  const ExploreScreen({super.key});

  @override
  State<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends State<ExploreScreen> {
  final _queryController = TextEditingController();
  List<Map<String, dynamic>> _results = const [];
  bool _loading = false;
  String? _error;

  @override
  void dispose() {
    _queryController.dispose();
    super.dispose();
  }

  Future<void> _search() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final api = context.read<SkillsApi>();
      final items = await api.searchTeach(query: _queryController.text.trim());
      setState(() => _results = items);
    } catch (e) {
      setState(() => _error = '$e');
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _queryController,
                  decoration: const InputDecoration(
                    labelText: 'Search skill or person',
                    border: OutlineInputBorder(),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              FilledButton(
                onPressed: _loading ? null : _search,
                child: const Text('Search'),
              ),
            ],
          ),
          const SizedBox(height: 12),
          if (_loading) const LinearProgressIndicator(),
          if (_error != null) Text(_error!, style: const TextStyle(color: Colors.red)),
          const SizedBox(height: 8),
          Expanded(
            child: ListView.builder(
              itemCount: _results.length,
              itemBuilder: (context, index) {
                final row = _results[index];
                return ListTile(
                  title: Text('${row['skill_name'] ?? 'Skill'} • ${row['user_name'] ?? 'User'}'),
                  subtitle: Text(
                    '${row['level'] ?? '-'} • ${row['mode'] ?? '-'} • '
                    'Rating ${(row['avg_rating'] ?? 0).toString()}',
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

