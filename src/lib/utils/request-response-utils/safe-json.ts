import { getErrorMessage } from 'lib/utils/error-utils/get-error-message';

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
