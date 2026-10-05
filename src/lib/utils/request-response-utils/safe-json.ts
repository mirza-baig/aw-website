import { getErrorMessage } from 'lib/utils/error-utils/get-error-message';

/**
 * Safely reads and parses JSON from a request.
 *
 * @typeParam T The expected type of the parsed JSON value.
 * @param request The request whose JSON body should be read, or a nullish value.
 * @returns A promise resolving to the parsed JSON value, or an empty object when reading or parsing fails.
 */
export async function safeJson<T = unknown>(request: Request | undefined | null): Promise<T> {
  if (request == undefined || request == null) {
    return {} as T;
  }
  try {
    const json = await request.json();
    return json as T;
  } catch (err) {
    console.error(`safeJson: error retrieving JSON: ${getErrorMessage(err)}`);
    return {} as T;
  }
}
