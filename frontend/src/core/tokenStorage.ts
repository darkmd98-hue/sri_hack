import * as Keychain from 'react-native-keychain';

export class TokenStorage {
  private static readonly service = 'skill_swap_token';
  private static readonly username = 'auth';

  async saveToken(token: string): Promise<void> {
    await Keychain.setGenericPassword(TokenStorage.username, token, {
      service: TokenStorage.service,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
    });
  }

  async readToken(): Promise<string | null> {
    const credentials = await Keychain.getGenericPassword({
      service: TokenStorage.service,
    });
    if (!credentials) {
      return null;
    }
    return credentials.password;
  }

  async clearToken(): Promise<void> {
    await Keychain.resetGenericPassword({
      service: TokenStorage.service,
    });
  }
}
