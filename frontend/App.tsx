import { useEffect } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { AppProvider, useAppServices } from './src/context/AppContext';
import { AppShell } from './src/screens/AppShell';
import { AuthScreen } from './src/screens/auth/AuthScreen';
import { StitchSplashScreen } from './src/stitch/auth/SplashScreen';
import { stitchColors } from './src/stitch/theme';
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
    return <StitchSplashScreen />;
  }

  return isLoggedIn ? <AppShell /> : <AuthScreen />;
}

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor={stitchColors.background} barStyle="dark-content" />
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
    backgroundColor: stitchColors.background,
  },
});

export default App;
