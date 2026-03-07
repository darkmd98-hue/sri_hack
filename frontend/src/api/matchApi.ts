import { MatchUser, parseMatchUser } from '../models/matchUser';
import { asArray } from '../models/parse';
import { ApiClient } from './apiClient';

export class MatchApi {
  constructor(private readonly client: ApiClient) {}

  async recommended(limit = 25): Promise<MatchUser[]> {
    const data = asArray(
      await this.client.get('/match/recommended', {
        limit: String(limit),
      }),
    );
    return data.map(parseMatchUser);
  }
}
