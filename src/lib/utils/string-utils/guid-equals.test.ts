import { describe, expect, it } from 'vitest';

import { guidEquals } from './guid-equals';

describe('lib > utils > string-utils > guid-equals', () => {
  it('returns true for guids with different formatting', () => {
    expect(
      guidEquals('{C138C30A-C0B3-456F-A547-E9B1E6197EB4}', 'c138c30ac0b3456fa547e9b1e6197eb4')
    ).toBe(true);
  });

  it('returns true for guids that differ only by case', () => {
    expect(guidEquals('ABC123', 'abc123')).toBe(true);
  });

  it('returns false for different guids', () => {
    expect(
      guidEquals('c138c30a-c0b3-456f-a547-e9b1e6197eb4', 'd138c30a-c0b3-456f-a547-e9b1e6197eb4')
    ).toBe(false);
  });

  it('treats undefined and empty values as equal', () => {
    expect(guidEquals(undefined, '')).toBe(true);
  });
});
