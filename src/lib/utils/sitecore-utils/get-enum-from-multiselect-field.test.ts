import { describe, expect, it } from 'vitest';

import type { EnumField } from './enum-field';
import { getEnumsFromMultiselectField } from './get-enum-from-multiselect-field';

describe('lib > utils > sitecore-utils > get-enum-from-multiselect-field', () => {
  it('returns undefined for an undefined field', () => {
    expect(getEnumsFromMultiselectField<string>(undefined)).toBe(undefined);
  });

  it('returns an empty array for an empty field', () => {
    expect(getEnumsFromMultiselectField<string>([])).toEqual([]);
  });

  it('returns values from the nested Value fields', () => {
    const fields: EnumField<string>[] = [
      { fields: { Value: { value: 'first' } } },
      { fields: { Value: { value: 'second' } } },
    ];

    expect(getEnumsFromMultiselectField(fields)).toEqual(['first', 'second']);
  });

  it('filters missing values while preserving order and duplicates', () => {
    const fields: EnumField<string>[] = [
      { fields: { Value: { value: 'first' } } },
      {},
      { fields: { Value: { value: 'first' } } },
      { fields: {} },
      { fields: { Value: { value: 'last' } } },
    ];

    expect(getEnumsFromMultiselectField(fields)).toEqual(['first', 'first', 'last']);
  });
});
