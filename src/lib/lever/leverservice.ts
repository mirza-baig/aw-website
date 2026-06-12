import { safeJsonParse } from 'lib/utils/string-utils/safe-json-parse';

export type LeverServiceOptions = {
  baseUrl: string;
  apiKey: string;
};

export type LeverPostingApplicationQuestions = {
  id: string;
  text: string;
  customQuestions: unknown[];
  personalInformation: unknown[];
  urls: unknown[];
};

type LeverSuccessResponse<T> = {
  data: T;
};

type LeverErrorResponse = {
  code: string;
  message: string;
};

export class LeverError extends Error {
  public readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, code: string, details?: unknown) {
    super(message);
    this.name = 'LeverError';
    this.code = code;
    this.details = details;
  }
}

export class LeverService {
  private readonly authHeader: string;

  constructor(public readonly options: LeverServiceOptions) {
    this.authHeader = Buffer.from(`${options.apiKey}:`).toString('base64');
  }
  private getApplyUrl(postingId: string): string {
    return new URL(`/v1/postings/${postingId}/apply`, this.options.baseUrl).toString();
  }

  private getHeaders(extra: Record<string, string> = {}) {
    return {
      Authorization: `Basic ${this.authHeader}`,
      Accept: 'application/json',
      ...extra,
    };
  }

  private validatePostingId(postingId: string) {
    if (!postingId?.trim()) {
      throw new LeverError('Invalid postingId', 'INVALID_ARGUMENT');
    }
  }
  async getPostingApplicationQuestions(
    postingId: string
  ): Promise<LeverPostingApplicationQuestions> {
    this.validatePostingId(postingId);

    const response = await fetch(this.getApplyUrl(postingId), {
      method: 'GET',
      headers: this.getHeaders(),
    });

    const text = await response.text();

    if (response.status >= 500) {
      throw new LeverError(
        `Lever fetch error ${response.status} ${response.statusText}`,
        'SERVER_ERROR',
        text
      );
    }

    const parsed = safeJsonParse<
      LeverSuccessResponse<LeverPostingApplicationQuestions> | LeverErrorResponse
    >(text);

    if (!parsed) {
      throw new LeverError('Lever JSON parse error', 'PARSE_ERROR', text);
    }

    if (!response.ok) {
      if ('code' in parsed) {
        throw new LeverError(parsed.message, parsed.code, parsed);
      }
      throw new LeverError('Lever request failed', 'CLIENT_ERROR', parsed);
    }

    if (!('data' in parsed) || !parsed.data) {
      throw new LeverError('Lever response missing data', 'INVALID_RESPONSE', parsed);
    }

    return parsed.data;
  }

  async submitJobApplicant(postingId: string, appData: unknown): Promise<Response> {
    this.validatePostingId(postingId);

    return fetch(this.getApplyUrl(postingId), {
      method: 'POST',
      headers: this.getHeaders({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(appData),
    });
  }
}
