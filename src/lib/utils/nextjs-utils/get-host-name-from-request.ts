import { NextRequest } from 'next/server';

export function getHostNameFromRequest(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-host');
  const hostName =
    (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor) ??
    req.headers.get('host')?.split(':')[0] ??
    'localhost';
  return hostName;
}
