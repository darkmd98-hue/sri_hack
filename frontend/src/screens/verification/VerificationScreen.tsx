import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

import { useAppServices } from '../../context/AppContext';

const DOC_TYPES = ['college_id', 'email', 'other'] as const;

export function VerificationScreen() {
  const { profileApi } = useAppServices();
  const [docType, setDocType] = useState<(typeof DOC_TYPES)[number]>('college_id');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickAndUpload = async (): Promise<void> => {
    const picker = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.9,
    });
    if (picker.didCancel) {
      return;
    }
    const asset = picker.assets?.[0];
    if (asset?.uri === undefined || asset.uri.length === 0) {
      setStatus('Could not read selected image.');
      return;
    }

    setSelectedFileName(asset.fileName ?? 'Selected image');
    setUploading(true);
    setStatus(null);
    try {
      const data = await profileApi.uploadVerificationDoc(
        {
          uri: asset.uri,
          name: asset.fileName ?? 'verification.jpg',
          type: asset.type ?? 'image/jpeg',
        },
        docType,
      );
      const uploadStatus = String(data.status ?? 'pending');
      setStatus(`Uploaded: ${uploadStatus}`);
    } catch (error) {
      setStatus(String(error));
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Document Type</Text>
      <View style={styles.docTypeRow}>
        {DOC_TYPES.map(type => (
          <Pressable
            key={type}
            onPress={() => setDocType(type)}
            style={[
              styles.docTypeButton,
              docType === type ? styles.activeDocType : null,
            ]}
          >
            <Text style={docType === type ? styles.activeDocTypeText : styles.docTypeText}>
              {type}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Selected File</Text>
      <View style={styles.filePreview}>
        <Text style={styles.filePreviewText}>
          {selectedFileName ?? 'No file selected yet'}
        </Text>
      </View>

      <Pressable
        disabled={uploading}
        onPress={() => {
          pickAndUpload().catch(() => {
            // Screen state handles upload errors.
          });
        }}
        style={({ pressed }) => [
          styles.uploadButton,
          uploading ? styles.disabled : null,
          pressed ? styles.pressed : null,
        ]}
      >
        <Text style={styles.uploadText}>
          {uploading ? 'Uploading...' : 'Pick from Gallery & Upload'}
        </Text>
      </Pressable>

      {status !== null ? <Text style={styles.statusText}>{status}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    gap: 10,
  },
  label: {
    color: '#1a3b30',
    fontWeight: '700',
    fontSize: 14,
  },
  docTypeRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  docTypeButton: {
    borderWidth: 1,
    borderColor: '#9eb8a9',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#ffffff',
  },
  activeDocType: {
    borderColor: '#0a7a5a',
    backgroundColor: '#0a7a5a',
  },
  docTypeText: {
    color: '#2f5548',
    fontWeight: '600',
  },
  activeDocTypeText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  filePreview: {
    borderWidth: 1,
    borderColor: '#c3d1c6',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    minHeight: 42,
  },
  filePreviewText: {
    color: '#17382d',
    fontSize: 14,
  },
  uploadButton: {
    minHeight: 44,
    borderRadius: 10,
    backgroundColor: '#0a7a5a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  statusText: {
    color: '#1d6a50',
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.7,
  },
});
