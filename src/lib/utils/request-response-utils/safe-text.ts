import { getErrorMessage } from 'lib/utils/error-utils/get-error-message';

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
