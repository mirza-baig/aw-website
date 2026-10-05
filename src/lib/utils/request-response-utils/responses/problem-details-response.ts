/** Details serialized into a problem-details JSON response. */
export interface ProblemDetails {
  type?: string;

  title?: string;

  status?: number;

  detail?: string;

  instance?: string;

  extensions?: { [key: string]: unknown };

  errors?: Record<string, string[]>;
}

/** A JSON response containing problem details and an error status. */
export class ProblemDetailsResponse extends Response {
  /**
   * Creates a problem-details JSON response.
   *
   * @param problemDetails Details to serialize in the response body.
   * @param init Optional response settings; its status overrides the details status.
   */
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
