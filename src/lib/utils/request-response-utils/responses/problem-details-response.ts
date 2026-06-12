export interface ProblemDetails {
  type?: string;

  title?: string;

  status?: number;

  detail?: string;

  instance?: string;

  extensions?: { [key: string]: unknown };

  errors?: Record<string, string[]>;
}

export class ProblemDetailsResponse extends Response {
  constructor(problemDetails: ProblemDetails, init: ResponseInit = {}) {
    const body = JSON.stringify(problemDetails);
    const headers = new Headers(init.headers);
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/problem+json');
    }
    init.status ??= problemDetails.status ?? 400;
    super(body, { ...init, headers });
  }
}
