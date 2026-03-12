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
  private pollTimer: ReturnType<typeof setTimeout> | null = null;
  private activeConversationId: number | null = null;
  private pollVersion = 0;

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
      await this.api.markRead(conversationId);
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
      await this.api.markRead(conversationId);
      this.notify();
    } catch (error) {
      this._error = errorMessage(error);
      this.notify();
    }
  }

  private async pollConversationLong(conversationId: number, version: number): Promise<void> {
    if (this.activeConversationId !== conversationId || this.pollVersion !== version) {
      return;
    }
    try {
      const current = this.messagesFor(conversationId);
      const afterId = current.length === 0 ? 0 : current[current.length - 1].id;
      const fresh = await this.api.longPoll(conversationId, afterId, 20);
      if (fresh.length > 0) {
        this.messagesByConversation.set(conversationId, [...current, ...fresh]);
        await this.api.markRead(conversationId);
        this.notify();
      }
    } catch {
      // Polling errors are ignored to keep chat responsive.
    }
  }

  startPolling(conversationId: number): void {
    this.stopPolling();
    this.activeConversationId = conversationId;
    this.pollVersion += 1;
    const version = this.pollVersion;

    const loop = () => {
      if (this.activeConversationId !== conversationId || this.pollVersion !== version) {
        return;
      }
      this.pollConversationLong(conversationId, version)
        .catch(() => {
          // Polling errors are intentionally swallowed.
        })
        .finally(() => {
          if (this.activeConversationId !== conversationId || this.pollVersion !== version) {
            return;
          }
          // 1.5s keeps the UI feeling responsive after a long-poll cycle without immediately slamming the server again.
          this.pollTimer = setTimeout(loop, 1500);
        });
    };

    loop();
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
      clearTimeout(this.pollTimer);
      this.pollTimer = null;
    }
    this.pollVersion += 1;
    this.activeConversationId = null;
  }

  dispose(): void {
    this.stopPolling();
  }
}
