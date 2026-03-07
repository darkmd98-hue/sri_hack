import { Platform } from 'react-native';

const host = Platform.OS === 'android' ? '10.254.127.35' : 'localhost';

export const AppConfig = {
  // Mirrors Flutter base URL and route query strategy.
  baseUrl: `http://${host}/skillswap/backend/api/index.php`,
};
