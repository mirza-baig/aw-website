import { describe, expect, it } from 'vitest';

import { isNullOrWhitespace } from './is-null-or-whitespace';

describe('lib > utils > string-utils > is-null-or-whitespace', () => {
  it('returns true for undefined', () => {
    expect(isNullOrWhitespace(undefined)).toBe(true);
  });

  it('returns true for null', () => {
    expect(isNullOrWhitespace(null)).toBe(true);
  });

  it.each(['', ' ', '\t', '\n', ' \t\n '])('returns true for whitespace-only values', (input) => {
    expect(isNullOrWhitespace(input)).toBe(true);
  });

  it('returns false for a value containing non-whitespace characters', () => {
    expect(isNullOrWhitespace(' value ')).toBe(false);
  });
});
