import { afterEach, describe, expect, it, vi } from 'vitest';

import { normalizeSitecoreDateString } from './normalize-sitecore-date-string';

describe('lib > utils > string-utils > normalize-sitecore-date-string', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('normalizes a valid Sitecore date string', () => {
    expect(normalizeSitecoreDateString('20211112T203919Z')).toBe('2021-11-12T20:39:19Z');
  });

  it('appends the timezone when it is missing', () => {
    expect(normalizeSitecoreDateString('20211112T203919')).toBe('2021-11-12T20:39:19Z');
  });

  it('returns Invalid Date and warns for an invalid date string', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(normalizeSitecoreDateString('invalid')).toBe('Invalid Date');
    expect(warn).toHaveBeenCalledWith(
      'Invalid date provided, invalidZ. Valid Sitecore date string: 20211112T203919Z.'
    );
  });
});
