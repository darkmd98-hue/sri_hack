import { AuthApi } from '../api/authApi';
import { ApiException } from '../api/apiClient';
import { TokenStorage } from '../core/tokenStorage';
import { User } from '../models/user';
import { Store } from './store';

function errorMessage(error: unknown): string {
  if (error instanceof ApiException) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error ?? 'Unknown error');
}

export class AuthStore extends Store {
  private _user: User | null = null;
  private _loading = false;
  private _error: string | null = null;
  private _bootstrapped = false;

  constructor(
    private readonly authApi: AuthApi,
    private readonly tokenStorage: TokenStorage,
  ) {
    super();
  }

  get user(): User | null {
    return this._user;
  }

  get isLoading(): boolean {
    return this._loading;
  }

  get error(): string | null {
    return this._error;
  }

  get isLoggedIn(): boolean {
    return this._user !== null;
  }

  get hasBootstrapped(): boolean {
    return this._bootstrapped;
  }

  async bootstrap(): Promise<void> {
    this._loading = true;
    this.notify();
    try {
      const token = await this.tokenStorage.readToken();
      if (token === null || token.length === 0) {
        this._user = null;
      } else {
        this._user = await this.authApi.me();
      }
      this._error = null;
    } catch (error) {
      this._error = errorMessage(error);
      this._user = null;
      await this.tokenStorage.clearToken();
    } finally {
      this._loading = false;
      this._bootstrapped = true;
      this.notify();
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    this._loading = true;
    this._error = null;
    this.notify();
    try {
      const result = await this.authApi.login(email, password);
      await this.tokenStorage.saveToken(result.token);
      this._user = result.user;
      return true;
    } catch (error) {
      this._error = errorMessage(error);
      return false;
    } finally {
      this._loading = false;
      this.notify();
    }
  }

  async register(name: string, email: string, password: string): Promise<boolean> {
    this._loading = true;
    this._error = null;
    this.notify();
    try {
      const result = await this.authApi.register(name, email, password);
      await this.tokenStorage.saveToken(result.token);
      this._user = result.user;
      return true;
    } catch (error) {
      this._error = errorMessage(error);
      return false;
    } finally {
      this._loading = false;
      this.notify();
    }
  }

  async logout(): Promise<void> {
    this._loading = true;
    this.notify();
    try {
      await this.authApi.logout();
    } catch {
      // Ignore API logout errors and clear local session anyway.
    }
    await this.tokenStorage.clearToken();
    this._user = null;
    this._error = null;
    this._loading = false;
    this.notify();
  }
}
