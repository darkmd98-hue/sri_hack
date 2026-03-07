import { asInt, asNullableInt, asNullableString, asRecord, asString } from './parse';

export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  dept?: string;
  year?: number;
  bio?: string;
  avatarUrl?: string;
  verificationStatus?: string;
}

export function parseUser(value: unknown): User {
  const json = asRecord(value);
  return {
    id: asInt(json.id),
    name: asString(json.name),
    email: asString(json.email),
    role: asNullableString(json.role),
    dept: asNullableString(json.dept),
    year: asNullableInt(json.year),
    bio: asNullableString(json.bio),
    avatarUrl: asNullableString(json.avatar_url),
    verificationStatus: asNullableString(json.verification_status),
  };
}
