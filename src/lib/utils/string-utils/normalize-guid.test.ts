import { describe, expect, it } from 'vitest';

import { normalizeGuid } from './normalize-guid';

describe('lib > utils > string-utils > normalize-guid', () => {
  it('returns an empty string for undefined', () => {
    expect(normalizeGuid(undefined)).toBe('');
  });

  it('normalizes a guid to lowercase without separators', () => {
    expect(normalizeGuid('{C138C30A-C0B3-456F-A547-E9B1E6197EB4}')).toBe(
      'c138c30ac0b3456fa547e9b1e6197eb4'
    );
  });

  it('removes non-alphanumeric characters', () => {
    expect(normalizeGuid('ABC 123_test.example!')).toBe('abc123testexample');
  });

  it('returns an empty string for an empty value', () => {
    expect(normalizeGuid('')).toBe('');
  });
});
