import { describe, expect, it } from 'vitest';

import { truncate } from './truncate';

describe('lib > utils > number-utils > truncate', () => {
  it.each([
    [12.34567, 3, 12.345],
    [12.9999, 2, 12.99],
    [12.34567, 0, 12],
  ])('truncates %s to %s digits: %s', (value, digits, expected) => {
    expect(truncate(value, digits)).toBe(expected);
  });

  it.each([12, 12.345])('returns %s unchanged when there are not enough digits', (value) => {
    expect(truncate(value, 3)).toBe(value);
  });

  it('preserves the current negative-value behavior', () => {
    expect(truncate(-12.34567, 3)).toBe(12.345);
  });

  it('truncates leading-zero decimal values', () => {
    expect(truncate(0.0001234, 3)).toBe(0);
  });

  it.each([NaN, Infinity])('returns %s unchanged', (value) => {
    expect(truncate(value, 3)).toBe(value);
  });
});
