import { describe, expect, it } from 'vitest';

import { fractionToDecimal } from './fraction-to-decimal';

describe('lib > utils > string-utils > fraction-to-decimal', () => {
  it('returns a whole number without the quote', () => {
    expect(fractionToDecimal('92"')).toBe('92');
  });

  it('returns a decimal value without the quote', () => {
    expect(fractionToDecimal('92.5"')).toBe('92.5');
  });

  it.each([
    ['92 1/16"', '92.0625'],
    ['92 1/8"', '92.125'],
    ['92 1/2"', '92.5'],
    ['92 15/16"', '92.9375'],
  ])('converts %s to %s', (input, expected) => {
    expect(fractionToDecimal(input)).toBe(expected);
  });
});
