import { afterEach, describe, expect, it, vi } from 'vitest';

import { normalizeSitecoreDateStringFormattedWithTime } from './normalize-sitecore-date-string-formatted-with-time';

describe('lib > utils > string-utils > normalize-sitecore-date-string-formatted-with-time', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('formats a compact Sitecore date string with time', () => {
    expect(normalizeSitecoreDateStringFormattedWithTime('20211112T203919Z')).toBe(
      '2021-11-12T20:39:19.000Z'
    );
  });

  it('formats an extended Sitecore date string with time', () => {
    expect(normalizeSitecoreDateStringFormattedWithTime('2024-04-16T20:04:00Z')).toBe(
      '2024-04-16T20:04:00.000Z'
    );
  });

  it('returns the date in locale format when requested', () => {
    const toLocaleString = vi
      .spyOn(Date.prototype, 'toLocaleString')
      .mockReturnValue('localized date');

    expect(normalizeSitecoreDateStringFormattedWithTime('20211112T203919Z', true)).toBe(
      'localized date'
    );
    expect(toLocaleString).toHaveBeenCalledWith('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    });
  });

  it('returns Invalid Date and warns for an invalid date string', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(normalizeSitecoreDateStringFormattedWithTime('invalid')).toBe('Invalid Date');
    expect(warn).toHaveBeenCalledWith(
      'Invalid date provided: invalid. Valid Sitecore date string formats: 20211112T203919Z or 2024-04-16T20:04:00Z.'
    );
  });
});
