import { asInt, asNullableString, asRecord, asString } from './parse';

export interface Conversation {
  id: number;
  otherUserId: number;
  otherUserName: string;
  unreadCount: number;
  lastMessage?: string;
  lastMessageTime?: string;
}

export function parseConversation(value: unknown): Conversation {
  const json = asRecord(value);
  return {
    id: asInt(json.id),
    otherUserId: asInt(json.other_user_id),
    otherUserName: asString(json.other_user_name, 'Unknown'),
    unreadCount: asInt(json.unread_count),
    lastMessage: asNullableString(json.last_message),
    lastMessageTime: asNullableString(json.last_message_time),
  };
}
