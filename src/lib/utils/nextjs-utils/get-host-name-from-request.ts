import { NextRequest } from 'next/server';

/**
 * Gets the hostname associated with a request.
 *
 * The forwarded host header takes precedence over the host header. When neither
 * header is available, the function returns `localhost`.
 *
 * @param req The request whose host headers should be inspected.
 * @returns The forwarded hostname, host header hostname, or `localhost`.
 */
export function getHostNameFromRequest(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-host');
  const hostName =
    (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor) ??
    req.headers.get('host')?.split(':')[0] ??
    'localhost';
  return hostName;
}
