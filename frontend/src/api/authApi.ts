import { parseUser, User } from '../models/user';
import { asRecord, asString } from '../models/parse';
import { ApiClient, ApiException } from './apiClient';

export interface AuthResult {
  token: string;
  user: User;
}

export class AuthApi {
  constructor(private readonly client: ApiClient) {}

  async login(email: string, password: string): Promise<AuthResult> {
    const data = asRecord(
      await this.client.post('/auth/login', {
        email,
        password,
      }),
    );
    const token = asString(data.token);
    if (token.length === 0) {
      throw new ApiException('Missing token in login response');
    }
    return {
      token,
      user: parseUser(data.user),
    };
  }

  async register(name: string, email: string, password: string): Promise<AuthResult> {
    const data = asRecord(
      await this.client.post('/auth/register', {
        name,
        email,
        password,
      }),
    );
    const token = asString(data.token);
    if (token.length === 0) {
      throw new ApiException('Missing token in register response');
    }
    return {
      token,
      user: parseUser(data.user),
    };
  }

  async requestPasswordReset(email: string): Promise<string> {
    const data = asRecord(
      await this.client.post('/auth/forgot', {
        email,
      }),
    );
    return asString(
      data.message,
      'If an account exists for that email, password reset instructions will be sent shortly.',
    );
  }

  async resetPassword(token: string, newPassword: string): Promise<string> {
    const data = asRecord(
      await this.client.post('/auth/reset-password', {
        new_password: newPassword,
        token,
      }),
    );
    return asString(data.message, 'Password updated successfully.');
  }

  async me(): Promise<User> {
    const data = asRecord(await this.client.get('/me'));
    return parseUser(data.user);
  }

  async logout(): Promise<void> {
    await this.client.post('/auth/logout');
  }
}
