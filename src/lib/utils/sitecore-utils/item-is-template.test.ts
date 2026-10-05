import { describe, expect, it } from 'vitest';

import { itemIsTemplate } from './item-is-template';

describe('lib > utils > sitecore-utils > item-is-template', () => {
  it('returns false for an undefined item', () => {
    expect(itemIsTemplate(undefined, 'template-id')).toBe(false);
  });

  it('returns false when the item has no fields', () => {
    const item = {} as Parameters<typeof itemIsTemplate>[0];

    expect(itemIsTemplate(item, 'template-id')).toBe(false);
  });

  it('returns true when the item template id matches', () => {
    const item = {
      fields: {
        _AW_TemplateId: {
          value: '{C138C30A-C0B3-456F-A547-E9B1E6197EB4}',
        },
      },
    } as unknown as Parameters<typeof itemIsTemplate>[0];

    expect(itemIsTemplate(item, 'c138c30ac0b3456fa547e9b1e6197eb4')).toBe(true);
  });

  it('returns false when the item template id does not match', () => {
    const item = {
      fields: {
        _AW_TemplateId: {
          value: 'c138c30ac0b3456fa547e9b1e6197eb4',
        },
      },
    } as unknown as Parameters<typeof itemIsTemplate>[0];

    expect(itemIsTemplate(item, 'd138c30ac0b3456fa547e9b1e6197eb4')).toBe(false);
  });
});
