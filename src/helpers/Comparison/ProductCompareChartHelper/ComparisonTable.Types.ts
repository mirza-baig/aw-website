/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Field,
  ImageField,
  ImageFieldValue,
  LinkField,
  LinkFieldValue,
} from '@sitecore-content-sdk/nextjs';

/**
 * Shape of an item referenced by the ProductCompareChart `productTypeToCompare`
 * multi-select field. Mirrors the
 * /sitecore/templates/Project/AndersenCorporation/AndersenWindows/Data/Products/AW_ProductType
 * template (productTypeName, productTypeDescription, productTypeImage).
 */
export type ProductTypeToCompareItem = {
  id: string;
  name?: string;
  displayName?: string;
  url?: string;
  fields?: {
    productTypeName?: Field<string>;
    productTypeDescription?: Field<string>;
    productTypeImage?: ImageField;
    exploreAllProducts?: LinkField;
    showExploreAllProductLink?: Field<boolean>;
  };
};

export type CategroyBarProps = {
  title: string | undefined;
  cta: LinkFieldValue | undefined;
};

export type SubCategroyBarProps = {
  subTitle: string | undefined;
};

// we can ignore the below type-warning due to complex nature of datastructure used while creating proxy objects in comparisontables

export type CategoryDataItem = string | undefined | any;

export type CategoryDataProps = Array<CategoryDataItem> & Partial<SubCategroyBarProps>;

export type SeriesTitle = {
  seriesIndex: number;
  url: LinkField;
  title: string;
  productTypeTitle?: string;
  description?: string;
  image?: ImageFieldValue;
  imageMobile?: ImageFieldValue;
  productName?: string;
};

export type ComparisonObjectProps = {
  [key: string]: CategroyBarProps;
} & {
  seriesTitles: Array<SeriesTitle | undefined>;
};
