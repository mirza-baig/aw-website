import { describe, expect, it } from 'vitest';

import type { EnumField } from './enum-field';
import { getEnum } from './get-enum';

describe('lib > utils > sitecore-utils > get-enum', () => {
  it.each([undefined, {}, { fields: {} }])('returns undefined for %s', (field) => {
    expect(getEnum<string>(field)).toBe(undefined);
  });

  it('returns the nested enum value', () => {
    const field: EnumField<string> = { fields: { Value: { value: 'enabled' } } };

    expect(getEnum(field)).toBe('enabled');
  });

  it.each([false, 0, ''])('preserves falsy enum values: %s', (value) => {
    const field: EnumField<typeof value> = { fields: { Value: { value } } };

    expect(getEnum(field)).toBe(value);
  });
});
