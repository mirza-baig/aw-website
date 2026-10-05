import { NextRequest } from 'next/server';

/**
 * Determines the request scheme (http/https), preferring the `x-forwarded-proto`
 * header set by upstream proxies/CDNs and falling back to the request's own
 * protocol. This keeps generated absolute urls correct behind TLS-terminating
 * proxies in production while remaining `http` for local development.
 *
 * @param req The request whose forwarded or native protocol should be inspected.
 * @returns The request scheme without a trailing colon, defaulting to `https`.
 */
export function getSchemeFromRequest(req: NextRequest): string {
  const forwardedProto = req.headers.get('x-forwarded-proto');
  return forwardedProto?.split(',')[0]?.trim() || req.nextUrl.protocol.replace(/:$/, '') || 'https';
}
