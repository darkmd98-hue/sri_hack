import { useEffect } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { AppProvider, useAppServices } from './src/context/AppContext';
import { AppShell } from './src/screens/AppShell';
import { AuthScreen } from './src/screens/auth/AuthScreen';
import { useStoreSelector } from './src/state/store';
import { colors } from './src/ui/theme';

function AppRoot() {
  const { authStore } = useAppServices();
  const hasBootstrapped = useStoreSelector(authStore, store => store.hasBootstrapped);
  const isLoggedIn = useStoreSelector(authStore, store => store.isLoggedIn);

  useEffect(() => {
    authStore.bootstrap().catch(() => {
      // Store handles auth bootstrap errors and exposes message state.
    });
  }, [authStore]);

  if (!hasBootstrapped) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.loadingText}>Preparing Skill Swap...</Text>
      </View>
    );
  }

  return isLoggedIn ? <AppShell /> : <AuthScreen />;
}

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor={colors.bg} barStyle="dark-content" />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <AppProvider>
          <AppRoot />
        </AppProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: 15,
  },
});

export default App;
