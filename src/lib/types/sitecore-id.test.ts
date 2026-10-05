import { describe, expect, it } from 'vitest';

import { SitecoreId } from './sitecore-id';

describe('lib > types > sitecore-id', () => {
  it('normalizes a formatted guid to a compact lowercase id', () => {
    const id = new SitecoreId('{C138C30A-C0B3-456F-A547-E9B1E6197EB4}');

    expect(id.toString()).toBe('c138c30ac0b3456fa547e9b1e6197eb4');
  });

  it('returns the expected formatted and short id values', () => {
    const id = new SitecoreId('c138c30ac0b3456fa547e9b1e6197eb4');

    expect(id.toString('D')).toBe('c138c30a-c0b3-456f-a547-e9b1e6197eb4');
    expect(id.toShortId()).toBe('C138C30AC0B3456FA547E9B1E6197EB4');
  });

  it('throws for an invalid id', () => {
    expect(() => new SitecoreId('not-a-guid')).toThrow(TypeError);
  });

  it('compares ids regardless of formatting and casing', () => {
    const id = new SitecoreId('C138C30AC0B3456FA547E9B1E6197EB4');

    expect(id.equals(new SitecoreId('{c138c30a-c0b3-456f-a547-e9b1e6197eb4}'))).toBe(true);
    expect(id.equals('c138c30ac0b3456fa547e9b1e6197eb4')).toBe(true);
    expect(id.equals('{c138c30a-c0b3-456f-a547-e9b1e6197eb4}')).toBe(false);
    expect(id.equals('d138c30ad0b3456fa547e9b1e6197eb4')).toBe(false);
  });

  it('serializes to an object containing the compact id', () => {
    const id = new SitecoreId('c138c30ac0b3456fa547e9b1e6197eb4');

    expect(id.toJSON()).toEqual({ id: 'c138c30ac0b3456fa547e9b1e6197eb4' });
  });

  it('identifies only the null singleton as null or empty', () => {
    expect(SitecoreId.isNullOrEmpty(undefined)).toBe(true);
    expect(SitecoreId.isNullOrEmpty(null)).toBe(true);
    expect(SitecoreId.isNullOrEmpty(SitecoreId.null)).toBe(true);
    expect(SitecoreId.isNullOrEmpty(new SitecoreId('00000000-0000-0000-0000-000000000000'))).toBe(
      false
    );
  });
});
