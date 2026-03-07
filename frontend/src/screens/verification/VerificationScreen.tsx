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
import { colors, radius, spacing } from '../../ui/theme';

const DOC_TYPES = ['college_id', 'email', 'other'] as const;
const DOC_LABEL: Record<(typeof DOC_TYPES)[number], string> = {
  college_id: 'College ID',
  email: 'Campus Email',
  other: 'Other',
};

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
      <View style={styles.heroCard}>
        <Text style={styles.title}>Account Verification</Text>
        <Text style={styles.subtitle}>
          Upload a clear photo so your profile can be marked as trusted.
        </Text>
      </View>

      <View style={styles.sectionCard}>
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
                {DOC_LABEL[type]}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.label}>Selected File</Text>
        <View style={styles.filePreview}>
          <Text style={styles.filePreviewText}>
            {selectedFileName ?? 'No file selected yet'}
          </Text>
        </View>
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
          {uploading ? 'Uploading...' : 'Pick from Gallery and Upload'}
        </Text>
      </Pressable>

      <View style={styles.hintCard}>
        <Text style={styles.hintTitle}>Quick Tips</Text>
        <Text style={styles.hintText}>Use bright lighting and keep text readable.</Text>
      </View>

      {status !== null ? <Text style={styles.statusText}>{status}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.bg,
  },
  heroCard: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 4,
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  sectionCard: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.xs,
  },
  label: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 14,
  },
  docTypeRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  docTypeButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#fffefb',
  },
  activeDocType: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  docTypeText: {
    color: colors.textMuted,
    fontWeight: '600',
    fontSize: 13,
  },
  activeDocTypeText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  filePreview: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fffefb',
    minHeight: 42,
  },
  filePreviewText: {
    color: colors.text,
    fontSize: 14,
  },
  uploadButton: {
    minHeight: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  hintCard: {
    backgroundColor: colors.panelMuted,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  hintTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  hintText: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  statusText: {
    color: colors.primary,
    fontSize: 13,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.7,
  },
});
