import { describe, expect, it } from 'vitest';

import { toShortId } from './to-short-id';

describe('lib > utils > string-utils > to-short-id', () => {
  it('returns empty string for undefined', () => {
    expect(toShortId(undefined)).toBe('');
  });

  it('returns a short id for a guid', () => {
    expect(toShortId('{c138c30a-c0b3-456f-a547-e9b1e6197eb4}')).toBe(
      'C138C30AC0B3456FA547E9B1E6197EB4'
    );
  });
});
