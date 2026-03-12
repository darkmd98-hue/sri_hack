import { Platform } from 'react-native';

const runtimeHost = (globalThis as { __SKILLSWAP_API_HOST__?: string }).__SKILLSWAP_API_HOST__;
const runtimeProtocol = (globalThis as { __SKILLSWAP_API_PROTOCOL__?: string }).__SKILLSWAP_API_PROTOCOL__;
const host =
  runtimeHost !== undefined && runtimeHost.trim().length > 0
    ? runtimeHost.trim()
    : Platform.OS === 'android'
      ? '10.0.2.2'
      : 'localhost';
const protocol =
  runtimeProtocol !== undefined && runtimeProtocol.trim().length > 0
    ? runtimeProtocol.trim()
    : __DEV__
      ? 'http'
      : 'https';

export const AppConfig = {
  // HTTP is for local development only. Production-like builds should use HTTPS or an explicit runtime override.
  baseUrl: `${protocol}://${host}/skillswap/backend/api/index.php`,
};
