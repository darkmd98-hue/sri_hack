import { ApiClient } from './apiClient';

export class SafetyApi {
  constructor(private readonly client: ApiClient) {}

  async blockUser(blockedId: number): Promise<void> {
    await this.client.post('/block', {
      blocked_id: blockedId,
    });
  }

  async reportUser(payload: {
    reportedId: number;
    reason: string;
    details?: string;
  }): Promise<void> {
    await this.client.post('/report', {
      reported_id: payload.reportedId,
      reason: payload.reason,
      details: payload.details,
    });
  }
}
