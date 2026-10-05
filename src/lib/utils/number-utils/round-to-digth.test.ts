import { describe, expect, it } from 'vitest';

import { roundToEigth } from './round-to-digth';
import { RoundingDirections } from './rounding-directions';

describe('lib > utils > number-utils > round-to-digth', () => {
  it('uses closest rounding when options are omitted', () => {
    expect(roundToEigth(1.2)).toBe(1.25);
  });

  it.each([
    [1.1, 1.125],
    [1.2, 1.25],
    [1.4, 1.375],
    [1.6, 1.625],
    [1.8, 1.75],
  ])('rounds %s to the closest eighth: %s', (value, expected) => {
    expect(roundToEigth(value, { roundingDirection: RoundingDirections.closest })).toBe(expected);
  });

  it('rounds up to the next available eighth', () => {
    expect(roundToEigth(1.26, { roundingDirection: RoundingDirections.up })).toBe(1.375);
  });

  it('rounds down to the previous available eighth', () => {
    expect(roundToEigth(1.26, { roundingDirection: RoundingDirections.down })).toBe(1.25);
  });

  it('returns whole numbers unchanged', () => {
    expect(roundToEigth(12, { roundingDirection: RoundingDirections.closest })).toBe(12);
  });

  it('carries into the next whole number when rounding up', () => {
    expect(roundToEigth(1.99, { roundingDirection: RoundingDirections.up })).toBe(2);
  });

  it('uses floor semantics for negative values', () => {
    expect(roundToEigth(-1.1, { roundingDirection: RoundingDirections.closest })).toBe(-1.125);
  });

  it('uses closest rounding for an unknown direction', () => {
    expect(roundToEigth(1.2, { roundingDirection: 99 as RoundingDirections })).toBe(1.25);
  });
});
