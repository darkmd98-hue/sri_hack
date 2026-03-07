import { ChatApi } from '../api/chatApi';
import { ChatMessage } from '../models/chatMessage';
import { Conversation } from '../models/conversation';
import { Store } from './store';

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }
  return String(error ?? 'Unknown error');
}

export class ChatStore extends Store {
  private _conversations: Conversation[] = [];
  private readonly messagesByConversation = new Map<number, ChatMessage[]>();
  private _loading = false;
  private _error: string | null = null;
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private activeConversationId: number | null = null;
  private pollInFlight = false;

  constructor(private readonly api: ChatApi) {
    super();
  }

  get conversations(): Conversation[] {
    return this._conversations;
  }

  get isLoading(): boolean {
    return this._loading;
  }

  get error(): string | null {
    return this._error;
  }

  messagesFor(conversationId: number): ChatMessage[] {
    return this.messagesByConversation.get(conversationId) ?? [];
  }

  async loadConversations(): Promise<void> {
    this._loading = true;
    this._error = null;
    this.notify();
    try {
      this._conversations = await this.api.listConversations();
    } catch (error) {
      this._error = errorMessage(error);
    } finally {
      this._loading = false;
      this.notify();
    }
  }

  async loadMessages(conversationId: number): Promise<void> {
    try {
      const messages = await this.api.messages(conversationId, 0);
      this.messagesByConversation.set(conversationId, messages);
      this.notify();
    } catch (error) {
      this._error = errorMessage(error);
      this.notify();
    }
  }

  async sendMessage(conversationId: number, content: string): Promise<void> {
    const normalized = content.trim();
    if (normalized.length === 0) {
      return;
    }

    try {
      const message = await this.api.send(conversationId, normalized);
      const current = this.messagesFor(conversationId);
      this.messagesByConversation.set(conversationId, [...current, message]);
      this.notify();
    } catch (error) {
      this._error = errorMessage(error);
      this.notify();
    }
  }

  private async pollConversation(conversationId: number): Promise<void> {
    if (this.pollInFlight) {
      return;
    }

    this.pollInFlight = true;
    try {
      const current = this.messagesFor(conversationId);
      const afterId = current.length === 0 ? 0 : current[current.length - 1].id;
      const fresh = await this.api.messages(conversationId, afterId);
      if (fresh.length > 0) {
        this.messagesByConversation.set(conversationId, [...current, ...fresh]);
        this.notify();
      }
    } catch {
      // Polling errors are ignored to keep chat responsive.
    } finally {
      this.pollInFlight = false;
    }
  }

  startPolling(conversationId: number): void {
    this.stopPolling();
    this.activeConversationId = conversationId;
    this.pollTimer = setInterval(() => {
      if (this.activeConversationId !== conversationId) {
        return;
      }
      this.pollConversation(conversationId).catch(() => {
        // Polling errors are intentionally swallowed.
      });
    }, 2000);
  }

  stopPolling(conversationId?: number): void {
    if (
      conversationId !== undefined &&
      this.activeConversationId !== null &&
      this.activeConversationId !== conversationId
    ) {
      return;
    }

    if (this.pollTimer !== null) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
    this.activeConversationId = null;
  }

  dispose(): void {
    this.stopPolling();
  }
}
