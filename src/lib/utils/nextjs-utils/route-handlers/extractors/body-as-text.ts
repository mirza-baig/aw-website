import { safeText } from 'lib/utils/request-response-utils/safe-text';
import { NextRequest } from 'next/server';

export async function bodyAsText(request: NextRequest): Promise<string> {
  return await safeText(request);
}
