import { MultipartFile } from './apiClient';
import { asRecord } from '../models/parse';
import { ApiClient } from './apiClient';

export class ProfileApi {
  constructor(private readonly client: ApiClient) {}

  async updateProfile(payload: {
    name?: string;
    dept?: string;
    year?: number;
    bio?: string;
  }): Promise<Record<string, unknown>> {
    const body: Record<string, unknown> = {};
    if (payload.name !== undefined) {
      body.name = payload.name;
    }
    if (payload.dept !== undefined) {
      body.dept = payload.dept;
    }
    if (payload.year !== undefined) {
      body.year = payload.year;
    }
    if (payload.bio !== undefined) {
      body.bio = payload.bio;
    }
    return asRecord(await this.client.post('/profile/update', body));
  }

  async uploadVerificationDoc(
    file: string | MultipartFile,
    docType: string,
  ): Promise<Record<string, unknown>> {
    return asRecord(
      await this.client.postMultipart(
        '/verification/upload-doc',
        { doc_type: docType },
        'document',
        file,
      ),
    );
  }
}
