import { useMemo, useState } from 'react';
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

export function AuthScreen() {
  const { authStore } = useAppServices();
  const authLoading = useStoreSelector(authStore, store => store.isLoading);
  const authError = useStoreSelector(authStore, store => store.error);

  const [registerMode, setRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const title = useMemo(
    () => (registerMode ? 'Create account' : 'Welcome back'),
    [registerMode],
  );

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
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>

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
    backgroundColor: '#f4f7f4',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 20,
    gap: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#13342a',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#c4d2c8',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#11251f',
    backgroundColor: '#ffffff',
  },
  errorText: {
    color: '#b00020',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#0a7a5a',
    borderRadius: 10,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonPressed: {
    opacity: 0.85,
  },
  submitText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleText: {
    color: '#0a7a5a',
    textAlign: 'center',
    marginTop: 4,
    fontSize: 15,
  },
});
