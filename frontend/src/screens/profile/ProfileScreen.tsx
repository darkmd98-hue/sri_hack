import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAppServices } from '../../context/AppContext';
import { useStoreSelector } from '../../state/store';

export function ProfileScreen({
  onOpenVerification,
}: {
  onOpenVerification: () => void;
}) {
  const { authStore, profileApi } = useAppServices();
  const user = useStoreSelector(authStore, store => store.user);
  const authLoading = useStoreSelector(authStore, store => store.isLoading);

  const [name, setName] = useState('');
  const [dept, setDept] = useState('');
  const [year, setYear] = useState('');
  const [bio, setBio] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user === null) {
      return;
    }
    setName(user.name);
    setDept(user.dept ?? '');
    setYear(user.year !== undefined ? String(user.year) : '');
    setBio(user.bio ?? '');
  }, [user]);

  if (user === null) {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>Please login.</Text>
      </View>
    );
  }

  const saveProfile = async (): Promise<void> => {
    setSaving(true);
    setStatus(null);
    try {
      await profileApi.updateProfile({
        name: name.trim(),
        dept: dept.trim(),
        year: year.trim().length > 0 ? Number.parseInt(year.trim(), 10) : undefined,
        bio: bio.trim(),
      });
      await authStore.bootstrap();
      setStatus('Profile updated');
    } catch (error) {
      setStatus(String(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.identityCard}>
        <Text style={styles.identityName}>{user.name}</Text>
        <Text style={styles.identityEmail}>{user.email}</Text>
        <View style={styles.statusChip}>
          <Text style={styles.statusChipText}>{user.verificationStatus ?? 'unverified'}</Text>
        </View>
      </View>

      <TextInput
        editable={!saving && !authLoading}
        onChangeText={setName}
        placeholder="Name"
        style={styles.input}
        value={name}
      />
      <TextInput
        editable={!saving && !authLoading}
        onChangeText={setDept}
        placeholder="Department"
        style={styles.input}
        value={dept}
      />
      <TextInput
        editable={!saving && !authLoading}
        keyboardType="number-pad"
        onChangeText={setYear}
        placeholder="Year"
        style={styles.input}
        value={year}
      />
      <TextInput
        editable={!saving && !authLoading}
        multiline
        onChangeText={setBio}
        placeholder="Bio"
        style={[styles.input, styles.bioInput]}
        textAlignVertical="top"
        value={bio}
      />

      {status !== null ? <Text style={styles.statusText}>{status}</Text> : null}

      <Pressable
        disabled={saving || authLoading}
        onPress={() => {
          saveProfile().catch(() => {
            // Screen state handles save errors.
          });
        }}
        style={({ pressed }) => [
          styles.primaryButton,
          saving || authLoading ? styles.buttonDisabled : null,
          pressed ? styles.buttonPressed : null,
        ]}
      >
        <Text style={styles.primaryButtonText}>Save Profile</Text>
      </Pressable>

      <Pressable
        onPress={onOpenVerification}
        style={({ pressed }) => [
          styles.secondaryButton,
          pressed ? styles.buttonPressed : null,
        ]}
      >
        <Text style={styles.secondaryButtonText}>Upload Verification Doc</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    color: '#35574a',
  },
  content: {
    padding: 12,
    gap: 10,
  },
  identityCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d8e3db',
    borderRadius: 10,
    padding: 12,
    marginBottom: 2,
  },
  identityName: {
    color: '#14352b',
    fontSize: 18,
    fontWeight: '700',
  },
  identityEmail: {
    marginTop: 2,
    color: '#3f6457',
  },
  statusChip: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: '#e4f3ec',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusChipText: {
    color: '#1d6a50',
    fontWeight: '600',
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#c3d1c6',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    color: '#17382d',
    fontSize: 15,
  },
  bioInput: {
    minHeight: 90,
  },
  statusText: {
    color: '#1b684f',
  },
  primaryButton: {
    borderRadius: 10,
    backgroundColor: '#0a7a5a',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryButton: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0a7a5a',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
    backgroundColor: '#ffffff',
  },
  secondaryButtonText: {
    color: '#0a7a5a',
    fontWeight: '700',
    fontSize: 15,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonPressed: {
    opacity: 0.85,
  },
});
