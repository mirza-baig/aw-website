export interface SuccessDetails {
  title?: string;

  status?: number;

  data?: unknown;
}

export class SuccessResponse extends Response {
  constructor(successDetails: SuccessDetails = {}, init: ResponseInit = {}) {
    const body = JSON.stringify(successDetails);
    const headers = new Headers(init.headers);
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    init.status ??= successDetails.status ?? 200;
    super(body, { ...init, headers });
  }

  static Ok(title?: string, status: number = 200): Response {
    return new SuccessResponse({ title, status });
  }

  static Data(data: unknown, title?: string, status: number = 200): Response {
    return new SuccessResponse({ title, status, data });
  }
}
