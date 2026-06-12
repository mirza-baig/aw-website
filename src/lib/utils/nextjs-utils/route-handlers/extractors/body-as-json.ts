import { safeJson } from 'lib/utils/request-response-utils/safe-json';
import { NextRequest } from 'next/server';

export async function bodyAsJson<T = unknown>(request: NextRequest): Promise<T> {
  return await safeJson<T>(request);
}
