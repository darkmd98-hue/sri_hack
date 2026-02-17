import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';

import '../../api/profile_api.dart';

class VerificationScreen extends StatefulWidget {
  const VerificationScreen({super.key});

  @override
  State<VerificationScreen> createState() => _VerificationScreenState();
}

class _VerificationScreenState extends State<VerificationScreen> {
  String _docType = 'college_id';
  bool _uploading = false;
  String? _status;

  Future<void> _pickAndUpload() async {
    final picker = ImagePicker();
    final file = await picker.pickImage(source: ImageSource.gallery);
    if (file == null) {
      return;
    }

    setState(() {
      _uploading = true;
      _status = null;
    });
    try {
      final api = context.read<ProfileApi>();
      final data = await api.uploadVerificationDoc(
        filePath: file.path,
        docType: _docType,
      );
      setState(() => _status = 'Uploaded: ${data['status'] ?? 'pending'}');
    } catch (e) {
      setState(() => _status = '$e');
    } finally {
      setState(() => _uploading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Verification')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Document Type'),
            DropdownButton<String>(
              value: _docType,
              items: const [
                DropdownMenuItem(value: 'college_id', child: Text('College ID')),
                DropdownMenuItem(value: 'email', child: Text('College Email Proof')),
                DropdownMenuItem(value: 'other', child: Text('Other')),
              ],
              onChanged: (value) {
                if (value != null) {
                  setState(() => _docType = value);
                }
              },
            ),
            const SizedBox(height: 16),
            FilledButton.icon(
              onPressed: _uploading ? null : _pickAndUpload,
              icon: const Icon(Icons.upload_file),
              label: Text(_uploading ? 'Uploading...' : 'Pick & Upload'),
            ),
            const SizedBox(height: 12),
            if (_status != null) Text(_status!),
          ],
        ),
      ),
    );
  }
}

