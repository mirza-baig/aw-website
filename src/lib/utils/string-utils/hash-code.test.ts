import { describe, expect, it } from 'vitest';

import { hashCode } from './hash-code';

describe('lib > utils > string-utils > hash-code', () => {
  it('returns zero for an empty string', () => {
    expect(hashCode('')).toBe('0');
  });

  it.each([
    ['abc', '96354'],
    ['Hello', '69609650'],
  ])('returns the expected hash code for %s', (input, expected) => {
    expect(hashCode(input)).toBe(expected);
  });

  it('is case-sensitive', () => {
    expect(hashCode('Hello')).not.toBe(hashCode('hello'));
  });
});
