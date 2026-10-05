import { safeJson } from 'lib/utils/request-response-utils/safe-json';
import { NextRequest } from 'next/server';

/**
 * Reads and parses a request body as JSON.
 *
 * @typeParam T The expected type of the parsed request body.
 * @param request The request whose body should be read.
 * @returns A promise resolving to the parsed body, or an empty object when the body cannot be read.
 */
export async function bodyAsJson<T = unknown>(request: NextRequest): Promise<T> {
  return await safeJson<T>(request);
}
