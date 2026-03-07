import { Platform } from 'react-native';

const runtimeHost = (globalThis as { __SKILLSWAP_API_HOST__?: string }).__SKILLSWAP_API_HOST__;
const host =
  runtimeHost !== undefined && runtimeHost.trim().length > 0
    ? runtimeHost.trim()
    : Platform.OS === 'android'
      ? '10.0.2.2'
      : 'localhost';

export const AppConfig = {
  // Override host at runtime by setting globalThis.__SKILLSWAP_API_HOST__.
  baseUrl: `http://${host}/skillswap/backend/api/index.php`,
};
