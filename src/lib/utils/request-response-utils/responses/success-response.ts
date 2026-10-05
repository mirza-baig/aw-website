/** Details serialized into a successful JSON response. */
export interface SuccessDetails {
  title?: string;

  status?: number;

  data?: unknown;
}

/** A JSON response containing optional success details and a successful status. */
export class SuccessResponse extends Response {
  /**
   * Creates a successful JSON response.
   *
   * @param successDetails Details to serialize in the response body.
   * @param init Optional response settings; its status overrides the details status.
   */
  constructor(successDetails: SuccessDetails = {}, init: ResponseInit = {}) {
    const body = JSON.stringify(successDetails);
    const headers = new Headers(init.headers);
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    init.status ??= successDetails.status ?? 200;
    super(body, { ...init, headers });
  }

  /**
   * Creates an OK JSON response.
   *
   * @param title Optional success title.
   * @param status HTTP status code, defaulting to 200.
   * @returns A JSON response containing the title and status.
   */
  static Ok(title?: string, status: number = 200): Response {
    return new SuccessResponse({ title, status });
  }

  /**
   * Creates a JSON response containing data.
   *
   * @param data Data to include in the response body.
   * @param title Optional success title.
   * @param status HTTP status code, defaulting to 200.
   * @returns A JSON response containing the title, status, and data.
   */
  static Data(data: unknown, title?: string, status: number = 200): Response {
    return new SuccessResponse({ title, status, data });
  }
}
