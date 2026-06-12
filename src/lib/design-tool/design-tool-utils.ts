import {
  RenoworksProductConfiguartion,
  RenoworksProductConfigurationDimensionMapping,
} from 'lib/renoworks';
import { toFraction } from 'lib/utils/string-utils/to-fraction';

import { Sitecore } from '.sitecore/AndersenWindows.model';

export const MapProductConfiguration = (
  productConfiguration: Sitecore.Data.Products.ProductConfiguration
): RenoworksProductConfiguartion | undefined => {
  if (productConfiguration == null) {
    return undefined;
  }

  return {
    renoworksName: productConfiguration.fields?.configurationName?.value ?? '',
    dimensionMappings: GetDimensionMappings(productConfiguration).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (_: any) => MapDimensionMapping(_)
    ),
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GetDimensionMappings = (product: any): any[] => {
  const ProductNumberIndex = 0;
  const WidthIndex = 1;
  const HeightIndex = 2;
  const GrilleLightsWideIndex = 3;
  const GrilleLightsHighIndex = 4;

  if (!product?.productDimensions?.value) {
    return [];
  }

  const mappingArray = product?.productDimensions?.value
    ?.split(/(?:\n|\r)/g)
    .filter((x: string) => !!x);

  return mappingArray
    .map((preMappingString: string) => preMappingString.split('|'))
    .map((preMappingArray: string) => {
      return {
        productNumber: preMappingArray[ProductNumberIndex],
        width: preMappingArray[WidthIndex],
        height: preMappingArray[HeightIndex],
        grilleLightsWide: preMappingArray[GrilleLightsWideIndex],
        grilleLightsHigh: preMappingArray[GrilleLightsHighIndex],
        fractionalWidth: toFraction(preMappingArray[WidthIndex]),
        fractionalHeight: toFraction(preMappingArray[HeightIndex]),
      };
    });
};

const MapDimensionMapping = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dimensionMapping: any
): RenoworksProductConfigurationDimensionMapping => {
  return {
    productNumber: dimensionMapping?.productNumber,
    width: dimensionMapping?.width,
    height: dimensionMapping?.height,
    fractionalWidth: dimensionMapping?.fractionalWidth,
    fractionalHeight: dimensionMapping?.fractionalHeight,
    grilleLightsWide: dimensionMapping?.grilleLightsWide,
    grilleLightsHigh: dimensionMapping?.grilleLightsHigh,
  };
};
