import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';

import { getSchemeFromRequest } from './get-scheme-from-request';

function requestWith(headers: Record<string, string | null>, protocol = 'https:'): NextRequest {
  return {
    headers: {
      get: (key: string) => headers[key] ?? null,
    },
    nextUrl: { protocol },
  } as unknown as NextRequest;
}

describe('lib > utils > nextjs-utils > get-scheme-from-request', () => {
  it('prefers the x-forwarded-proto header', () => {
    const scheme = getSchemeFromRequest(requestWith({ 'x-forwarded-proto': 'https' }, 'http:'));
    expect(scheme).toBe('https');
  });

  it('uses the first value of a comma-separated x-forwarded-proto', () => {
    const scheme = getSchemeFromRequest(
      requestWith({ 'x-forwarded-proto': 'https, http' }, 'http:')
    );
    expect(scheme).toBe('https');
  });

  it('falls back to the request protocol when no header is present', () => {
    const scheme = getSchemeFromRequest(requestWith({}, 'http:'));
    expect(scheme).toBe('http');
  });

  it('defaults to https when nothing is available', () => {
    const scheme = getSchemeFromRequest(requestWith({}, ''));
    expect(scheme).toBe('https');
  });
});
