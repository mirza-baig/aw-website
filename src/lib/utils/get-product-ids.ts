export const getProductIds = (productDimensions: string | undefined) => {
  const productIds: string[] = [];
  if (productDimensions) {
    const dimensionMappings = productDimensions.split('\r\n');
    if (dimensionMappings && dimensionMappings.length > 0) {
      dimensionMappings
        .filter((e) => e)
        .map((dimension) => dimension.split('|'))
        .forEach((d) => d && d.length > 0 && d[0] && productIds.push(d[0]));
    }
  }
  return productIds;
};
