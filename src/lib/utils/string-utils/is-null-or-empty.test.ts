import { describe, expect, it } from 'vitest';

import { isNullOrEmpty } from './is-null-or-empty';

describe('lib > utils > string-utils > is-null-or-empty', () => {
  it('returns true for undefined', () => {
    expect(isNullOrEmpty(undefined)).toBe(true);
  });

  it('returns true for null', () => {
    expect(isNullOrEmpty(null)).toBe(true);
  });

  it('returns true for an empty string', () => {
    expect(isNullOrEmpty('')).toBe(true);
  });

  it.each([' ', '\t', '\n', 'value'])('returns false for a non-empty string: %s', (input) => {
    expect(isNullOrEmpty(input)).toBe(false);
  });
});
