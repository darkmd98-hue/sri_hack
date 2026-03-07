import { MatchApi } from '../api/matchApi';
import { MatchUser } from '../models/matchUser';
import { Store } from './store';

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }
  return String(error ?? 'Unknown error');
}

export class MatchStore extends Store {
  private _recommended: MatchUser[] = [];
  private _loading = false;
  private _error: string | null = null;

  constructor(private readonly api: MatchApi) {
    super();
  }

  get recommended(): MatchUser[] {
    return this._recommended;
  }

  get isLoading(): boolean {
    return this._loading;
  }

  get error(): string | null {
    return this._error;
  }

  async loadRecommended(): Promise<void> {
    this._loading = true;
    this._error = null;
    this.notify();
    try {
      this._recommended = await this.api.recommended(25);
    } catch (error) {
      this._error = errorMessage(error);
    } finally {
      this._loading = false;
      this.notify();
    }
  }
}
