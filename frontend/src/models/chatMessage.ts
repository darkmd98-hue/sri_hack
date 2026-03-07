import {
  asBoolean,
  asInt,
  asRecord,
  asString,
} from './parse';

export interface ChatMessage {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  createdAt: string;
  messageType: string;
  isRead: boolean;
}

export function parseChatMessage(value: unknown): ChatMessage {
  const json = asRecord(value);
  return {
    id: asInt(json.id),
    conversationId: asInt(json.conversation_id),
    senderId: asInt(json.sender_id),
    content: asString(json.content),
    createdAt: asString(json.created_at),
    messageType: asString(json.message_type, 'text'),
    isRead: asBoolean(json.is_read),
  };
}
