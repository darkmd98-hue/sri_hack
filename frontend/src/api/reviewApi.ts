import { asRecord } from '../models/parse';
import { ApiClient } from './apiClient';

export class ReviewApi {
  constructor(private readonly client: ApiClient) {}

  async addReview(payload: {
    swapRequestId: number;
    rating: number;
    comment?: string;
  }): Promise<void> {
    await this.client.post('/review/add', {
      swap_request_id: payload.swapRequestId,
      rating: payload.rating,
      comment: payload.comment,
    });
  }

  async userReviews(userId: number): Promise<Record<string, unknown>> {
    return asRecord(await this.client.get(`/review/user/${userId}`));
  }
}
