import { describe, expect, it } from 'vitest';

import { getProductIds } from './get-product-ids';

describe('lib > utils > get-product-ids', () => {
  it.each([undefined, ''])('returns an empty array for %s', (productDimensions) => {
    expect(getProductIds(productDimensions)).toEqual([]);
  });

  it('returns the product id before the pipe for each mapping', () => {
    expect(getProductIds('product-1|dimension-1\r\nproduct-2|dimension-2')).toEqual([
      'product-1',
      'product-2',
    ]);
  });

  it('ignores empty lines and mappings without a product id', () => {
    expect(getProductIds('product-1|dimension-1\r\n\r\n|dimension-2\r\nproduct-2')).toEqual([
      'product-1',
      'product-2',
    ]);
  });

  it('preserves whitespace and duplicate product ids', () => {
    expect(getProductIds(' product-1 |dimension-1\r\n product-1 |dimension-2')).toEqual([
      ' product-1 ',
      ' product-1 ',
    ]);
  });
});
