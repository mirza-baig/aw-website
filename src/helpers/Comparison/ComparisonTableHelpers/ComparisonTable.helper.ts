/***  Disabling no-explicit-any for whole file as this file uses proxy objects for handling fucntionality */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Field, ImageField, ImageFieldValue, Item, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { getEnum } from 'lib/utils/get-enum';
import { itemInheritsBaseItem } from 'lib/utils/sitecore-utils/item-inherits-base-item';
import { itemIsTemplate } from 'lib/utils/sitecore-utils/item-is-template';
import { guidEquals } from 'lib/utils/string-utils/guid-equals';

import { ComparisonObjectProps, SeriesTitle } from './ComparisonTable.Types';
import { Sitecore } from '.sitecore/AndersenWindows.model';
export type ComparisonTableProductsProps =
  Sitecore.Components.Product.ComparisonTable.ComparisonProductTable & ComponentProps;
export type SwatchItemTypes =
  | Sitecore.Elements.Swatches.SwatchCollection
  | Sitecore.Elements.Swatches.Swatch;

type SwatchItemMatch =
  | { matched: true; type: 'SwatchCollection'; item: Sitecore.Elements.Swatches.SwatchCollection }
  | { matched: true; type: 'Swatch'; item: Sitecore.Elements.Swatches.Swatch }
  | { matched: false };

export const matchSwatchItem = (item: Item | undefined): SwatchItemMatch => {
  if (!itemInheritsBaseItem(item)) {
    return { matched: false };
  }

  if (
    itemIsTemplate<Sitecore.Elements.Swatches.SwatchCollection>(
      item,
      SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Elements.Swatches
        .SwatchCollection.Id
    )
  ) {
    return { matched: true, type: 'SwatchCollection', item };
  }

  if (
    itemIsTemplate<Sitecore.Elements.Swatches.Swatch>(
      item,
      SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Elements.Swatches.Swatch.Id
    )
  ) {
    return { matched: true, type: 'Swatch', item };
  }

  return { matched: false };
};

export const isSwatchItem = (item: Item | undefined): item is SwatchItemTypes => {
  if (!itemInheritsBaseItem(item)) {
    return false;
  }

  return (
    itemIsTemplate<Sitecore.Elements.Swatches.SwatchCollection>(
      item,
      SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Elements.Swatches
        .SwatchCollection.Id
    ) ||
    itemIsTemplate<Sitecore.Elements.Swatches.Swatch>(
      item,
      SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Elements.Swatches.Swatch.Id
    )
  );
};

const getValueByKey = (object: Item, key: string): string | string[] | ImageField[] | unknown => {
  if (object.fields) {
    const objFieldsKey = object.fields[key];
    if (isSwatchItem(objFieldsKey as Item)) {
      const _swatchCollection = (object.fields[key] as Sitecore.Elements.Swatches.SwatchCollection)
        .fields;

      return {
        swatchCollectionComments: _swatchCollection.swatchCollectionComments.value || '',
        swatches: _swatchCollection.swatches?.map(
          (swatch: Sitecore.Elements.Swatches.Swatch) =>
            (swatch.fields.swatchImage as ImageField)?.value || undefined
        ),
      };
    } else if (Array.isArray(objFieldsKey)) {
      // If we don't get swatches as swatch collection, we'll get them as a separate swatch objects in array
      const isSwatchArray = objFieldsKey.length > 0 && objFieldsKey?.every(isSwatchItem);

      if (isSwatchArray) {
        return {
          swatches: (object.fields[key] as Array<Sitecore.Elements.Swatches.Swatch>)?.map(
            (swatch) => swatch.fields.swatchImage?.value || undefined
          ),
        };
      }
      // In order to render product type links we need to lookup for windowsProductTypes or doorsProductTypes key
      if (key === 'windowsProductTypes' || key === 'doorsProductTypes') {
        const typeList = (object.fields?.[key] as any[] | undefined) ?? [];
        return typeList.map((item: any) => {
          const productTypeLookupFields = getProductTypeLookupField(item);
          if (productTypeLookupFields && item.fields?.[productTypeLookupFields]) {
            return {
              href: item.fields.productDetailPageLink.value.href,
              text: item.fields?.[productTypeLookupFields]?.fields.productTypeName.value,
            };
          }
          return console.log(`${productTypeLookupFields} field does not exist in`, item);
        });
      }

      type FieldRecord = Record<string, { value?: unknown }>;
      type ItemWithFields = { fields?: FieldRecord };

      // Default to an empty array when the source is nullish
      const list = (object.fields?.[key] as ItemWithFields[] | undefined) ?? [];

      return list.map((item) =>
        // Ensure we pass a real object to Object.keys
        Object.keys(item.fields ?? {}).map((k) => item.fields?.[k]?.value)
      );
    } else if (key === 'priceLevel') {
      // At render time we need to differentiate priceLevel from other fields.
      // So, We're converting priceLevel to an object
      return {
        priceLevel: (
          object.fields[
            key as keyof Sitecore.Data.Products.Series['fields']
          ] as Sitecore.Data.Products.PriceLevel
        )?.fields?.priceLevelText.value,
      };
    } else if (
      Object.keys(
        object.fields[key as keyof Sitecore.Data.Products.Series['fields']] || {}
      ).includes('fields')
    ) {
      return Object.keys(
        (object.fields[key as keyof Sitecore.Data.Products.Series] as Item).fields
      ).map(
        (item) =>
          (
            (object.fields[key as keyof Sitecore.Data.Products.Series] as Item).fields[
              item
            ] as Field<string>
          ).value
      );
    }

    return (object.fields[key as keyof Sitecore.Data.Products.Series['fields']] as Field<string>)
      ?.value;
  } else {
    return '';
  }
};

export const getSeriesTitles = (object: Item, seriesIndex: number): SeriesTitle | undefined => {
  if (object?.fields) {
    return {
      seriesIndex: seriesIndex,
      // If series comparison then consider seriesLandingPageCTA else if product comparison then consider productDetailPageLink to get url
      url:
        (object?.fields.seriesLandingPageCTA as LinkField) ||
        (object?.fields.productDetailPageLink as LinkField),
      title:
        (object.fields?.seriesTitle as Field<string>)?.value ||
        ((object.fields?.productSeries as Item)?.fields.productTypeName as Field<string>)?.value,
      productTypeTitle: (() => {
        const productType = (
          (object.fields?.productType as Item)?.fields.productTypeName as Field<string>
        )?.value;

        const productTypeLookupField =
          ProductTypeConstants[productType as keyof typeof ProductTypeConstants];

        return (
          (object.fields[productTypeLookupField] as Item)?.fields.productTypeName as Field<string>
        )?.value;
      })(),
      description:
        (object.fields.seriesSubtitle as Field<string>)?.value ||
        (object.fields?.productSubtitle as Field<string>)?.value,
      image:
        (object.fields.seriesImage as Field<ImageFieldValue>)?.value ||
        (object.fields.productImage as Field<ImageFieldValue>)?.value,
      imageMobile: (object.fields.productImageMobile as Field<ImageFieldValue>)?.value,
      productName: (object.fields?.productName as Field<string>)?.value,
    };
  } else {
    return undefined;
  }
};

export const getComparisonObject = (
  fields: Sitecore.Components.Product.ComparisonTable.ComparisonSeriesTable['fields'],
  isProductComparison = false
): ComparisonObjectProps | null => {
  if (!fields) {
    return null;
  }

  const seriesToCompare: Item[] = isProductComparison ? fields.products : fields.seriesToCompare;
  const getTables = () => {
    const comparableObject: any = {};

    const { tableStructure } = fields;

    tableStructure?.map((tableElement: any) => {
      const tableFieldName = getEnum<string>(tableElement.fields.valueFieldName);
      if (
        tableFieldName &&
        tableElement &&
        guidEquals(
          tableElement.fields._AW_TemplateId.value,
          SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Elements.Product
            .ComparisonSubsection.Id
        )
      ) {
        comparableObject[tableFieldName] = [
          ...seriesToCompare.map(
            (series: Item) =>
              tableElement.fields.valueFieldName && getValueByKey(series, tableFieldName)
          ),
        ];
      }
    });

    return comparableObject;
  };

  if (seriesToCompare) {
    return {
      seriesTitles: [
        ...(seriesToCompare?.map((series, index) => getSeriesTitles(series, index)) ?? []),
      ],
      ...getTables(),
    };
  } else {
    return null;
  }
};

const ProductTypeConstants = {
  'Big Door': 'exteriorDoorProductType',
  'Exterior Door': 'exteriorDoorProductType',
  'Storm Door': 'stormDoorProductType',
  Window: 'windowProductType',
  'Sandbox Exterior Door': 'exteriorDoorProductType',
  'Sandbox Window': 'exteriorDoorProductType',
};

export const getProductTypeLookupField = (product: any): string | undefined => {
  const productType = product.fields?.productType?.fields.productTypeName.value ?? '';
  if (productType) {
    return ProductTypeConstants[productType as keyof typeof ProductTypeConstants];
  }
  return undefined;
};

export const groupProductStyles = (fields: ComparisonTableProductsProps['fields']): any => {
  const groupedProducts: any = {
    products: [],
    productStyles: [],
  };

  for (const product of fields?.products ?? []) {
    const productTypeLookupField = getProductTypeLookupField(product);

    if (productTypeLookupField) {
      const productTypeLookupFieldValue =
        product.fields[productTypeLookupField]?.fields.productTypeName.value;
      const productKey = product.fields[productTypeLookupField]?.fields.productTypeName
        .value as keyof typeof groupedProducts;
      if (product.fields[productTypeLookupField]) {
        if (groupedProducts.products[productKey]) {
          groupedProducts.products[productTypeLookupFieldValue].push(product);
        } else {
          groupedProducts.products[productTypeLookupFieldValue] = [product];
          groupedProducts.productStyles = [
            ...groupedProducts.productStyles,
            {
              productTitle: product.fields[productTypeLookupField]?.fields.productTypeName.value,
              productDescription:
                product.fields[productTypeLookupField]?.fields.productTypeDescription.value,
              productImage: product.fields[productTypeLookupField]?.fields.productTypeImage.value,
            },
          ];
        }
      }
    }
  }

  return groupedProducts;
};
