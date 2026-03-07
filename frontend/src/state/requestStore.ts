import { SwapApi } from '../api/swapApi';
import { SwapRequest } from '../models/swapRequest';
import { Store } from './store';

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }
  return String(error ?? 'Unknown error');
}

export class RequestStore extends Store {
  private _inbox: SwapRequest[] = [];
  private _sent: SwapRequest[] = [];
  private _loading = false;
  private _error: string | null = null;

  constructor(private readonly api: SwapApi) {
    super();
  }

  get inbox(): SwapRequest[] {
    return this._inbox;
  }

  get sent(): SwapRequest[] {
    return this._sent;
  }

  get isLoading(): boolean {
    return this._loading;
  }

  get error(): string | null {
    return this._error;
  }

  async refresh(): Promise<void> {
    this._loading = true;
    this._error = null;
    this.notify();
    try {
      const [inbox, sent] = await Promise.all([this.api.inbox(), this.api.sent()]);
      this._inbox = inbox;
      this._sent = sent;
    } catch (error) {
      this._error = errorMessage(error);
    } finally {
      this._loading = false;
      this.notify();
    }
  }

  async respond(requestId: number, action: 'accept' | 'reject' | 'cancel'): Promise<void> {
    await this.api.respond(requestId, action);
    await this.refresh();
  }

  async complete(requestId: number): Promise<void> {
    await this.api.complete(requestId);
    await this.refresh();
  }
}
