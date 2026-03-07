import { AppConfig } from '../core/appConfig';
import { TokenStorage } from '../core/tokenStorage';
import { asRecord } from '../models/parse';

interface ApiPayload {
  success?: boolean;
  data?: unknown;
  error?: unknown;
}

export interface MultipartFile {
  uri: string;
  name?: string;
  type?: string;
}

export class ApiException extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'ApiException';
    this.statusCode = statusCode;
  }
}

function extractErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }
  return String(error ?? 'Request failed');
}

function guessMimeType(filePath: string): string {
  const normalized = filePath.toLowerCase();
  if (normalized.endsWith('.png')) {
    return 'image/png';
  }
  if (normalized.endsWith('.jpg') || normalized.endsWith('.jpeg')) {
    return 'image/jpeg';
  }
  if (normalized.endsWith('.pdf')) {
    return 'application/pdf';
  }
  return 'application/octet-stream';
}

export class ApiClient {
  constructor(private readonly tokenStorage: TokenStorage) {}

  private buildUrl(route: string, query?: Record<string, string>): string {
    const normalizedRoute = route.startsWith('/') ? route.slice(1) : route;
    const params = new URLSearchParams({ route: normalizedRoute });
    if (query !== undefined) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== '') {
          params.set(key, value);
        }
      });
    }
    return `${AppConfig.baseUrl}?${params.toString()}`;
  }

  private async headers(jsonBody = true): Promise<Record<string, string>> {
    const token = await this.tokenStorage.readToken();
    const headers: Record<string, string> = {};
    if (jsonBody) {
      headers['Content-Type'] = 'application/json';
    }
    if (token !== null && token.length > 0) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }

  private parsePayload(rawBody: string): ApiPayload {
    try {
      return asRecord(JSON.parse(rawBody)) as ApiPayload;
    } catch {
      return {
        success: false,
        error: 'Invalid server response',
      };
    }
  }

  private decodeResponse(statusCode: number, body: string): unknown {
    const payload = this.parsePayload(body);
    if (statusCode >= 200 && statusCode < 300 && payload.success === true) {
      return payload.data;
    }

    const fallback = `Request failed with status ${statusCode}`;
    const message = payload.error === undefined ? fallback : String(payload.error);
    throw new ApiException(message, statusCode);
  }

  async get(route: string, query?: Record<string, string>): Promise<unknown> {
    let response: Response;
    try {
      response = await fetch(this.buildUrl(route, query), {
        method: 'GET',
        headers: await this.headers(),
      });
    } catch (error) {
      throw new ApiException(extractErrorMessage(error));
    }

    const body = await response.text();
    return this.decodeResponse(response.status, body);
  }

  async post(route: string, body?: Record<string, unknown>): Promise<unknown> {
    let response: Response;
    try {
      response = await fetch(this.buildUrl(route), {
        method: 'POST',
        headers: await this.headers(),
        body: JSON.stringify(body ?? {}),
      });
    } catch (error) {
      throw new ApiException(extractErrorMessage(error));
    }

    const payload = await response.text();
    return this.decodeResponse(response.status, payload);
  }

  async postMultipart(
    route: string,
    fields: Record<string, string>,
    fileField: string,
    file: string | MultipartFile,
  ): Promise<unknown> {
    const token = await this.tokenStorage.readToken();
    const headers: Record<string, string> = {};
    if (token !== null && token.length > 0) {
      headers.Authorization = `Bearer ${token}`;
    }

    const fileData = typeof file === 'string' ? { uri: file } : file;
    const hasScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(fileData.uri);
    const uri = hasScheme ? fileData.uri : `file://${fileData.uri}`;
    const fileName =
      fileData.name ??
      fileData.uri.split(/[\\/]/).pop()?.split('?')[0] ??
      'upload.bin';
    const fileType =
      fileData.type ??
      (typeof file === 'string'
        ? guessMimeType(file)
        : guessMimeType(fileData.uri));
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append(fileField, {
      uri,
      name: fileName,
      type: fileType,
    } as never);

    let response: Response;
    try {
      response = await fetch(this.buildUrl(route), {
        method: 'POST',
        headers,
        body: formData,
      });
    } catch (error) {
      throw new ApiException(extractErrorMessage(error));
    }

    const payload = await response.text();
    return this.decodeResponse(response.status, payload);
  }
}
