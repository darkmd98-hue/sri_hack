import { useEffect } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { AppProvider, useAppServices } from './src/context/AppContext';
import { AppShell } from './src/screens/AppShell';
import { AuthScreen } from './src/screens/auth/AuthScreen';
import { useStoreSelector } from './src/state/store';

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
        <ActivityIndicator color="#0a7a5a" size="large" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return isLoggedIn ? <AppShell /> : <AuthScreen />;
}

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
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
    backgroundColor: '#f4f7f4',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loadingText: {
    color: '#32564a',
    fontSize: 14,
  },
});

export default App;
