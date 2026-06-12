import { safeJsonParse } from 'lib/utils/string-utils/safe-json-parse';

export type SendOutboundMessage = {
  mobileNumber: string; // or digits-only if their API requires it; see below
  custom?: string;
  hashKey: string;
};

export class MarlimarError extends Error {
  public readonly details: unknown;

  constructor(message: string, details?: unknown) {
    super(message);
    this.name = 'MarlimarError';
    this.details = details;
  }
}

export type MarlimarServiceOptions = {
  baseUrl: string;
};

type MarlimarResponse = {
  Status?: string;
  Message?: string;
  [key: string]: unknown;
};

export class MarlimarService {
  constructor(public readonly options: MarlimarServiceOptions) {}

  async sendOutboundMessage(params: SendOutboundMessage): Promise<MarlimarResponse | undefined> {
    const url = new URL('/OutboundMessage/Send', this.options.baseUrl).toString();
    const requestData = {
      hash_key: params.hashKey,
      mobile_number: params.mobileNumber,
      custom: params.custom ?? '',
    };

    const form = new URLSearchParams();
    Object.entries(requestData).forEach(([key, val]) => {
      if (typeof val === 'string') {
        form.set(key, val);
      }
    });

    const formBody = form.toString();

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody,
    });
    const text = await response.text();
    if (!response.ok) {
      throw new MarlimarError(
        `Marlimar fetch error ${response.status} ${response.statusText}`,
        text
      );
    }

    const json = safeJsonParse<MarlimarResponse>(text);
    if (json == undefined) {
      throw new MarlimarError(`Marlimar JSON parse error`, text);
    }

    // Mirror .NET success check
    const ok = json.status === '1' && json.message === 'success';
    if (!ok) {
      throw new MarlimarError(`Marlimar response not successful`, text);
    }

    return json;
  }
}
