import { Sitecore } from '.sitecore/AndersenWindows.model';

export type ProductSwatch = Sitecore.Components.Product.ProductIntro.ProductSwatch & {
  fields?: {
    productImageSwatch?: Sitecore.Elements.Swatches.Swatch;
  };
};
