import { parseSwapRequest, SwapRequest } from '../models/swapRequest';
import { asArray } from '../models/parse';
import { ApiClient } from './apiClient';

export class SwapApi {
  constructor(private readonly client: ApiClient) {}

  async requestSwap(payload: {
    toUserId: number;
    teachSkillId?: number;
    learnSkillId?: number;
    message?: string;
    proposedTime?: string;
  }): Promise<void> {
    await this.client.post('/swap/request', {
      to_user_id: payload.toUserId,
      teach_skill_id: payload.teachSkillId,
      learn_skill_id: payload.learnSkillId,
      message: payload.message,
      proposed_time: payload.proposedTime,
    });
  }

  async respond(
    swapRequestId: number,
    action: 'accept' | 'reject' | 'cancel',
  ): Promise<void> {
    await this.client.post('/swap/respond', {
      swap_request_id: swapRequestId,
      action,
    });
  }

  async complete(swapRequestId: number): Promise<void> {
    await this.client.post('/swap/complete', {
      swap_request_id: swapRequestId,
    });
  }

  async inbox(): Promise<SwapRequest[]> {
    const data = asArray(await this.client.get('/swap/inbox'));
    return data.map(item => parseSwapRequest(item, true));
  }

  async sent(): Promise<SwapRequest[]> {
    const data = asArray(await this.client.get('/swap/sent'));
    return data.map(item => parseSwapRequest(item, false));
  }
}
