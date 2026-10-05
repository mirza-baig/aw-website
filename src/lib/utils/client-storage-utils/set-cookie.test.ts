import { afterEach, describe, expect, it, vi } from 'vitest';

import { setCookie } from './set-cookie';

describe('lib > utils > client-storage-utils > set-cookie', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('sets a cookie with the default path', () => {
    const cookieSetter = vi.spyOn(document, 'cookie', 'set');

    setCookie('session', 'abc123', 'Wed, 01 Jan 2030 00:00:00 GMT');

    expect(cookieSetter).toHaveBeenCalledWith(
      'session=abc123; expires=Wed, 01 Jan 2030 00:00:00 GMT; path=/'
    );
  });

  it('sets a cookie with a custom path', () => {
    const cookieSetter = vi.spyOn(document, 'cookie', 'set');

    setCookie('session', 'abc123', 'Wed, 01 Jan 2030 00:00:00 GMT', '/account');

    expect(cookieSetter).toHaveBeenCalledWith(
      'session=abc123; expires=Wed, 01 Jan 2030 00:00:00 GMT; path=/account'
    );
  });

  it('throws when document is unavailable', () => {
    vi.stubGlobal('document', undefined);

    expect(() => setCookie('session', 'abc123', 'Wed, 01 Jan 2030 00:00:00 GMT')).toThrow(
      TypeError
    );
  });
});
