import { describe, expect, it } from 'vitest';

import { isNotNullOrUndefined } from './is-not-null-or-undefined';

describe('lib > utils > filter-utils > is-not-null-or-undefined', () => {
  it.each([null, undefined])('returns false for %s', (value) => {
    expect(isNotNullOrUndefined(value)).toBe(false);
  });

  it.each([false, 0, '', NaN, 'value', { value: 1 }])(
    'returns true for present values: %s',
    (value) => {
      expect(isNotNullOrUndefined(value)).toBe(true);
    }
  );
});
