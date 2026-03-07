import { asArray, asRecord } from '../models/parse';
import { ApiClient } from './apiClient';

export type SkillRow = Record<string, unknown>;

export class SkillsApi {
  constructor(private readonly client: ApiClient) {}

  async listSkills(): Promise<SkillRow[]> {
    const data = asArray(await this.client.get('/skills/list'));
    return data.map(item => asRecord(item));
  }

  async searchTeach(filters?: {
    query?: string;
    skillId?: number;
    level?: string;
    mode?: string;
  }): Promise<SkillRow[]> {
    const params: Record<string, string> = {};
    if (filters?.query !== undefined && filters.query.trim() !== '') {
      params.q = filters.query.trim();
    }
    if (filters?.skillId !== undefined) {
      params.skill_id = String(filters.skillId);
    }
    if (filters?.level !== undefined && filters.level.trim() !== '') {
      params.level = filters.level.trim();
    }
    if (filters?.mode !== undefined && filters.mode.trim() !== '') {
      params.mode = filters.mode.trim();
    }

    const data = asArray(await this.client.get('/teach/search', params));
    return data.map(item => asRecord(item));
  }

  async addTeach(payload: {
    skillId: number;
    level: string;
    mode: string;
    description?: string;
  }): Promise<void> {
    await this.client.post('/teach/add', {
      skill_id: payload.skillId,
      level: payload.level,
      mode: payload.mode,
      description: payload.description,
    });
  }

  async deleteTeach(id: number): Promise<void> {
    await this.client.post('/teach/delete', {
      id,
    });
  }

  async addLearn(payload: {
    skillId: number;
    levelNeeded: string;
    notes?: string;
  }): Promise<void> {
    await this.client.post('/learn/add', {
      skill_id: payload.skillId,
      level_needed: payload.levelNeeded,
      notes: payload.notes,
    });
  }

  async deleteLearn(id: number): Promise<void> {
    await this.client.post('/learn/delete', {
      id,
    });
  }

  async myTeach(): Promise<SkillRow[]> {
    const data = asArray(await this.client.get('/teach/mine'));
    return data.map(item => asRecord(item));
  }

  async myLearn(): Promise<SkillRow[]> {
    const data = asArray(await this.client.get('/learn/mine'));
    return data.map(item => asRecord(item));
  }
}
