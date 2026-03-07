import { asArray, asRecord } from '../models/parse';
import { ApiClient } from './apiClient';

export type AvailabilitySlotRow = Record<string, unknown>;

export class AvailabilityApi {
  constructor(private readonly client: ApiClient) {}

  async mySlots(): Promise<AvailabilitySlotRow[]> {
    const data = asArray(await this.client.get('/availability/mine'));
    return data.map(item => asRecord(item));
  }

  async upsertSlot(payload: {
    id?: number;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }): Promise<void> {
    await this.client.post('/availability/upsert', {
      id: payload.id,
      day_of_week: payload.dayOfWeek,
      start_time: payload.startTime,
      end_time: payload.endTime,
    });
  }

  async deleteSlot(id: number): Promise<void> {
    await this.client.post('/availability/delete', { id });
  }
}

