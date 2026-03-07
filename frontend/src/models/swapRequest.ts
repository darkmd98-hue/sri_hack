import {
  asInt,
  asNullableInt,
  asNullableString,
  asRecord,
  asString,
} from './parse';

export interface SwapRequest {
  id: number;
  fromUserId: number;
  toUserId: number;
  status: string;
  message?: string;
  otherUserName?: string;
  teachSkillName?: string;
  learnSkillName?: string;
  proposedTime?: string;
  conversationId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export function parseSwapRequest(value: unknown, inbox: boolean): SwapRequest {
  const json = asRecord(value);
  return {
    id: asInt(json.id),
    fromUserId: asInt(json.from_user_id),
    toUserId: asInt(json.to_user_id),
    status: asString(json.status, 'pending'),
    message: asNullableString(json.message),
    otherUserName: asNullableString(inbox ? json.from_user_name : json.to_user_name),
    teachSkillName: asNullableString(json.teach_skill_name),
    learnSkillName: asNullableString(json.learn_skill_name),
    proposedTime: asNullableString(json.proposed_time),
    conversationId: asNullableInt(json.conversation_id),
    createdAt: asNullableString(json.created_at),
    updatedAt: asNullableString(json.updated_at),
  };
}
