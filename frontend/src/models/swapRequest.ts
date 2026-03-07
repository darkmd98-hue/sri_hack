import { asInt, asNullableString, asRecord, asString } from './parse';

export interface SwapRequest {
  id: number;
  status: string;
  message?: string;
  otherUserName?: string;
  createdAt?: string;
}

export function parseSwapRequest(value: unknown, inbox: boolean): SwapRequest {
  const json = asRecord(value);
  return {
    id: asInt(json.id),
    status: asString(json.status, 'pending'),
    message: asNullableString(json.message),
    otherUserName: asNullableString(inbox ? json.from_user_name : json.to_user_name),
    createdAt: asNullableString(json.created_at),
  };
}
