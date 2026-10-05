import { safeText } from 'lib/utils/request-response-utils/safe-text';
import { NextRequest } from 'next/server';

/**
 * Reads a request body as text.
 *
 * @param request The request whose text body should be read.
 * @returns A promise resolving to the body text, or an empty string when the body cannot be read.
 */
export async function bodyAsText(request: NextRequest): Promise<string> {
  return await safeText(request);
}
