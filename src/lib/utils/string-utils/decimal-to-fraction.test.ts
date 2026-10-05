import { describe, expect, it } from 'vitest';

import { decimalToFraction } from './decimal-to-fraction';

describe('lib > utils > string-utils > decimal-to-fraction', () => {
  it.each(['92', '92.0', '92.000'])('returns %s without a fractional part', (input) => {
    expect(decimalToFraction(input)).toBe('92');
  });

  it.each([
    ['92.0625', '92 1/16'],
    ['92.125', '92 1/8'],
    ['92.25', '92 1/4'],
    ['92.5', '92 1/2'],
    ['92.75', '92 3/4'],
    ['92.9375', '92 15/16'],
  ])('converts %s to %s', (input, expected) => {
    expect(decimalToFraction(input)).toBe(expected);
  });
});
