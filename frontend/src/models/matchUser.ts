import {
  asArray,
  asFloat,
  asInt,
  asNullableString,
  asRecord,
  asString,
} from './parse';

export interface MatchUser {
  id: number;
  name: string;
  matchScore: number;
  avgRating: number;
  skills: string[];
  dept?: string;
  verificationStatus?: string;
}

export function parseMatchUser(value: unknown): MatchUser {
  const json = asRecord(value);
  const rawSkills = asArray(json.top_matching_skills);
  const skills = rawSkills
    .map(item => asString(asRecord(item).name))
    .filter(skill => skill.length > 0);

  return {
    id: asInt(json.id),
    name: asString(json.name),
    matchScore: asInt(json.match_score),
    avgRating: asFloat(json.avg_rating),
    skills,
    dept: asNullableString(json.dept),
    verificationStatus: asNullableString(json.verification_status),
  };
}
