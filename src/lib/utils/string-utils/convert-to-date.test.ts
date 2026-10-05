import { describe, expect, it } from 'vitest';

import { convertToDate } from './convert-to-date';

describe('lib > utils > string-utils > convert-to-date', () => {
  it('formats a numeric timestamp as a local date', () => {
    const timestamp = new Date(2024, 3, 5).getTime();

    expect(convertToDate(timestamp)).toBe('4/5/2024');
  });

  it('does not pad single-digit month or day values', () => {
    const timestamp = new Date(2024, 0, 2).getTime();

    expect(convertToDate(timestamp)).toBe('1/2/2024');
  });

  it('returns non-numeric values unchanged', () => {
    expect(convertToDate('2024-04-05')).toBe('2024-04-05');
  });
});
