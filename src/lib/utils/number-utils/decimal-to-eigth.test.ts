import { describe, expect, it } from 'vitest';

import { decimalToEigth } from './decimal-to-eigth';
import { RoundingDirections } from './rounding-directions';

describe('lib > utils > number-utils > decimal-to-eigth', () => {
  it('uses closest rounding when options are omitted', () => {
    expect(decimalToEigth(0.2)).toBe('1/4');
  });

  it.each([
    [0, '0'],
    [0.1, '1/8'],
    [0.2, '1/4'],
    [0.4, '3/8'],
    [0.6, '5/8'],
    [0.8, '3/4'],
    [0.95, '1'],
  ])('rounds %s to the closest eighth: %s', (value, expected) => {
    expect(decimalToEigth(value, { roundingDirection: RoundingDirections.closest })).toBe(expected);
  });

  it('rounds up to the next available eighth', () => {
    expect(decimalToEigth(0.26, { roundingDirection: RoundingDirections.up })).toBe('3/8');
  });

  it('rounds down to the previous available eighth', () => {
    expect(decimalToEigth(0.26, { roundingDirection: RoundingDirections.down })).toBe('1/4');
  });

  it('returns zero for whole numbers', () => {
    expect(decimalToEigth(12, { roundingDirection: RoundingDirections.closest })).toBe('0');
  });

  it('returns one when rounding a value near the next whole number', () => {
    expect(decimalToEigth(0.99, { roundingDirection: RoundingDirections.up })).toBe('1');
  });
});
