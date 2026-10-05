import { describe, expect, it } from 'vitest';

import { isEqualIgnoreCase } from './is-equal-ignore-case';

describe('lib > utils > string-utils > is-equal-ignore-case', () => {
  it('returns true when both values are undefined', () => {
    expect(isEqualIgnoreCase(undefined, undefined)).toBe(true);
  });

  it('returns false when only the left value is undefined', () => {
    expect(isEqualIgnoreCase(undefined, 'value')).toBe(false);
  });

  it('returns false when only the right value is undefined', () => {
    expect(isEqualIgnoreCase('value', undefined)).toBe(false);
  });

  it('returns true when values differ only by case', () => {
    expect(isEqualIgnoreCase('Value', 'vAlUe')).toBe(true);
  });

  it.each([
    ['value', 'other value'],
    ['value', ' value'],
  ])('returns false when values are different: %s and %s', (left, right) => {
    expect(isEqualIgnoreCase(left, right)).toBe(false);
  });
});
