import { describe, expect, it } from 'vitest';

import { getComponentFields } from './component-fields';

describe('schema-org-graph > component-fields', () => {
  it('maps integrated GraphQL item fields to component fields', () => {
    const productItem = {
      id: 'product-id',
      fields: {
        productName: { value: '400 Series Casement Window' },
      },
    };

    expect(
      getComponentFields({
        data: {
          item: {
            fields: [
              { name: 'productItem', jsonValue: productItem },
              { name: 'headlineText', jsonValue: { value: 'Casement Window' } },
            ],
          },
        },
      })
    ).toEqual({
      productItem,
      headlineText: { value: 'Casement Window' },
    });
  });

  it('preserves standard component fields', () => {
    const fields = {
      productItem: {
        fields: {
          productName: { value: '400 Series Casement Window' },
        },
      },
    };

    expect(getComponentFields(fields)).toBe(fields);
  });

  it.each([undefined, null, 'fields'])('preserves non-object fields: %s', (fields) => {
    expect(getComponentFields(fields)).toBe(fields);
  });
});
