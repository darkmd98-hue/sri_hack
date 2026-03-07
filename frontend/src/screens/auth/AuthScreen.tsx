import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAppServices } from '../../context/AppContext';
import { useStoreSelector } from '../../state/store';
import { colors, radius, spacing } from '../../ui/theme';

export function AuthScreen() {
  const { authStore } = useAppServices();
  const authLoading = useStoreSelector(authStore, store => store.isLoading);
  const authError = useStoreSelector(authStore, store => store.error);

  const [registerMode, setRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const title = registerMode ? 'Create account' : 'Welcome back';

  const submit = async (): Promise<void> => {
    const normalizedEmail = email.trim();
    if (registerMode) {
      await authStore.register(name.trim(), normalizedEmail, password);
      return;
    }
    await authStore.login(normalizedEmail, password);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.brandRow}>
          <Text style={styles.brandTitle}>Skill Swap</Text>
          <Text style={styles.brandTag}>Learn. Teach. Connect.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            {registerMode
              ? 'Create your account to start exchanging skills with peers.'
              : 'Sign in to continue your active swaps and conversations.'}
          </Text>

          {registerMode ? (
            <TextInput
              autoCapitalize="words"
              editable={!authLoading}
              onChangeText={setName}
              placeholder="Name"
              style={styles.input}
              value={name}
            />
          ) : null}

          <TextInput
            autoCapitalize="none"
            editable={!authLoading}
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="Email"
            style={styles.input}
            value={email}
          />

          <TextInput
            editable={!authLoading}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            value={password}
          />

          {authError !== null ? <Text style={styles.errorText}>{authError}</Text> : null}

          <Pressable
            disabled={authLoading}
            onPress={() => {
              submit().catch(() => {
                // Auth errors are reflected through store state.
              });
            }}
            style={({ pressed }) => [
              styles.submitButton,
              authLoading ? styles.submitButtonDisabled : null,
              pressed ? styles.submitButtonPressed : null,
            ]}
          >
            {authLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.submitText}>{registerMode ? 'Register' : 'Login'}</Text>
            )}
          </Pressable>

          <Pressable
            disabled={authLoading}
            onPress={() => {
              setRegisterMode(prev => !prev);
            }}
          >
            <Text style={styles.toggleText}>
              {registerMode
                ? 'Already have an account? Login'
                : 'New here? Register'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  brandRow: {
    paddingHorizontal: spacing.xs,
    gap: 2,
  },
  brandTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  brandTag: {
    color: colors.textMuted,
    fontSize: 14,
  },
  card: {
    backgroundColor: colors.panel,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 16,
    color: colors.text,
    backgroundColor: '#fffefb',
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonPressed: {
    backgroundColor: colors.primaryPressed,
  },
  submitText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  toggleText: {
    color: colors.primary,
    textAlign: 'center',
    marginTop: spacing.xs,
    fontSize: 15,
    fontWeight: '600',
  },
});
