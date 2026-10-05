import { describe, expect, it } from 'vitest';

import { itemInheritsBaseItem } from './item-inherits-base-item';

describe('lib > utils > sitecore-utils > item-inherits-base-item', () => {
  it('returns false for an undefined item', () => {
    expect(itemInheritsBaseItem(undefined)).toBe(false);
  });

  it('returns false when the item has no fields', () => {
    const item = {} as Parameters<typeof itemInheritsBaseItem>[0];

    expect(itemInheritsBaseItem(item)).toBe(false);
  });

  it('returns true when fields has its own template id property', () => {
    const item = {
      fields: {
        _AW_TemplateId: undefined,
      },
    } as unknown as Parameters<typeof itemInheritsBaseItem>[0];

    expect(itemInheritsBaseItem(item)).toBe(true);
  });

  it('returns false when the template id property is inherited', () => {
    const fields = Object.create({ _AW_TemplateId: 'template-id' });
    const item = { fields } as unknown as Parameters<typeof itemInheritsBaseItem>[0];

    expect(itemInheritsBaseItem(item)).toBe(false);
  });
});
