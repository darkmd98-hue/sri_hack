import { ChatMessage, parseChatMessage } from '../models/chatMessage';
import { Conversation, parseConversation } from '../models/conversation';
import { asArray, asRecord, asInt } from '../models/parse';
import { ApiClient } from './apiClient';

export class ChatApi {
  constructor(private readonly client: ApiClient) {}

  async startConversation(otherUserId: number): Promise<number> {
    const data = asRecord(
      await this.client.post('/chat/start', {
        other_user_id: otherUserId,
      }),
    );
    return asInt(data.conversation_id);
  }

  async listConversations(): Promise<Conversation[]> {
    const data = asArray(await this.client.get('/chat/conversations'));
    return data.map(parseConversation);
  }

  async messages(conversationId: number, afterId = 0): Promise<ChatMessage[]> {
    const data = asArray(
      await this.client.get('/chat/messages', {
        conversation_id: String(conversationId),
        after_id: String(afterId),
      }),
    );
    return data.map(parseChatMessage);
  }

  async longPoll(conversationId: number, afterId = 0, timeout = 30): Promise<ChatMessage[]> {
    const data = asRecord(
      await this.client.get('/chat/longpoll', {
        conversation_id: String(conversationId),
        after_id: String(afterId),
        timeout: String(timeout),
      }),
    );
    return asArray(data.messages).map(parseChatMessage);
  }

  async send(conversationId: number, content: string): Promise<ChatMessage> {
    const data = await this.client.post('/chat/send', {
      conversation_id: conversationId,
      content,
      message_type: 'text',
    });
    return parseChatMessage(data);
  }

  async markRead(conversationId: number): Promise<void> {
    await this.client.post('/chat/mark-read', {
      conversation_id: conversationId,
    });
  }
}
