/**
 * Extracts product IDs from CRLF-separated product-dimension mappings.
 *
 * @param productDimensions Mappings in `productId|dimension` format.
 * @returns Product IDs in their original order, excluding empty mappings and IDs.
 */
export function getProductIds(productDimensions: string | undefined): string[] {
  const productIds: string[] = [];
  if (productDimensions) {
    const dimensionMappings = productDimensions.split('\r\n');
    if (dimensionMappings && dimensionMappings.length > 0) {
      dimensionMappings
        .filter(Boolean)
        .map((dimension) => dimension.split('|'))
        .forEach((d) => d && d.length > 0 && d[0] && productIds.push(d[0]));
    }
  }
  return productIds;
}
