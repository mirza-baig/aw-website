import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';

import { getHostNameFromRequest } from './get-host-name-from-request';

function requestWith(headers: Record<string, string | null>): NextRequest {
  return {
    headers: {
      get: (key: string) => headers[key] ?? null,
    },
  } as unknown as NextRequest;
}

describe('lib > utils > nextjs-utils > get-host-name-from-request', () => {
  it('prefers the x-forwarded-host header', () => {
    expect(
      getHostNameFromRequest(
        requestWith({ 'x-forwarded-host': 'forwarded.example.com', host: 'origin.example.com' })
      )
    ).toBe('forwarded.example.com');
  });

  it('uses the host header without its port', () => {
    expect(getHostNameFromRequest(requestWith({ host: 'example.com:3000' }))).toBe('example.com');
  });

  it('defaults to localhost when no host headers are available', () => {
    expect(getHostNameFromRequest(requestWith({}))).toBe('localhost');
  });

  it('preserves an empty forwarded host instead of falling back', () => {
    expect(
      getHostNameFromRequest(requestWith({ 'x-forwarded-host': '', host: 'example.com' }))
    ).toBe('');
  });
});
