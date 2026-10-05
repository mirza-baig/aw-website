import { afterEach, describe, expect, it, vi } from 'vitest';

import { normalizeSitecoreDateStringFormatted } from './normalize-sitecore-date-string-formatted';

describe('lib > utils > string-utils > normalize-sitecore-date-string-formatted', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('formats a valid Sitecore date string', () => {
    expect(normalizeSitecoreDateStringFormatted('20211112T203919Z')).toBe('11/12/2021');
  });

  it('appends the timezone and formats the date when it is missing', () => {
    expect(normalizeSitecoreDateStringFormatted('20211112T203919')).toBe('11/12/2021');
  });

  it('returns Invalid Date and warns for an invalid date string', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(normalizeSitecoreDateStringFormatted('invalid')).toBe('Invalid Date');
    expect(warn).toHaveBeenCalledWith(
      'Invalid date provided, invalidZ. Valid Sitecore date string: 20211112T203919Z.'
    );
  });

  it('returns a structurally valid date string unchanged when it contains non-digit values', () => {
    expect(normalizeSitecoreDateStringFormatted('2021AB12T203919Z')).toBe('2021AB12T203919Z');
  });
});
