import { getErrorMessage } from 'lib/utils/error-utils/get-error-message';

/**
 * Safely reads the text body from a request.
 *
 * @param request The request whose text body should be read, or null/undefined.
 * @returns The request text, or an empty string when the request is missing or unreadable.
 */
export async function safeText(request: Request | undefined | null): Promise<string> {
  if (request == undefined || request == null) {
    return '';
  }
  try {
    const text = await request.text();
    return text;
  } catch (err) {
    console.error(`safeText: error retrieving text: ${getErrorMessage(err)}`);
    return '';
  }
}
