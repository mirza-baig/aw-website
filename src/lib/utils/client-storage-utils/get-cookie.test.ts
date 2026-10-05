import { afterEach, describe, expect, it, vi } from 'vitest';

import { getCookie } from './get-cookie';

describe('lib > utils > client-storage-utils > get-cookie', () => {
  afterEach(() => {
    if (typeof document !== 'undefined') {
      document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('returns the value of an existing cookie', () => {
    document.cookie = 'session=abc123';

    expect(getCookie('session')).toBe('abc123');
  });

  it('preserves equals signs and encoded values in the cookie value', () => {
    document.cookie = 'session=abc%3D123=part';

    expect(getCookie('session')).toBe('abc%3D123=part');
  });

  it('returns undefined and logs when the cookie is missing', () => {
    const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    expect(getCookie('missing')).toBe(undefined);
    expect(consoleLog).toHaveBeenCalledWith('something went wrong while reading missing');
  });

  it('returns undefined when document is unavailable', () => {
    vi.stubGlobal('document', undefined);

    expect(getCookie('session')).toBe(undefined);
  });
});
