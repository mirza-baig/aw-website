import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { checkHostNameInMediaURL } from 'lib/coveo/utils';
import { decimalToFraction } from 'lib/utils/dimension-conversion';
import { normalizeSitecoreDateString } from 'lib/utils/string-utils/normalize-sitecore-date-string';

import {
  getCheckboxField,
  getDateField,
  getImageField,
  getLinkField,
  getLookupField,
  getTextField,
  IndexableItem,
  SitemapItem,
} from '../..';

export class ProductProperties {
  order = 80;

  async exec(siteMapItem: SitemapItem, indexableItem: IndexableItem) {
    const productConfigurationTemplateId =
      SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Data.Products.ProductConfiguration.Id.replace(
        /-/g,
        ''
      );
    if (indexableItem.templateId.indexOf(productConfigurationTemplateId) == -1) {
      return siteMapItem;
    }

    const parentItem = indexableItem.parent as IndexableItem;

    const lastUpdated = GetLastUpdatedDate(indexableItem, parentItem);
    if (lastUpdated) {
      siteMapItem.lastmod = lastUpdated;
    }

    siteMapItem.metaData['siteLanguage'] = indexableItem.language;

    siteMapItem.metaData['siteName'] = indexableItem.siteName;

    const excludeFromSearch = getCheckboxField(indexableItem.fields, 'excludeFromSearch');
    if (excludeFromSearch) {
      siteMapItem.metaData[excludeFromSearch.name] = excludeFromSearch.boolValue ? 'true' : 'false';
    }

    this.addProductDimensionsFieldMeta(indexableItem, siteMapItem, ['productDimensions']);

    this.addTextFieldMeta(indexableItem, siteMapItem, ['configurationName']);

    this.addImageFieldMeta(indexableItem, siteMapItem, ['productImage']);

    if (parentItem) {
      this.addTextFieldMeta(parentItem, siteMapItem, ['productName', 'productId']);

      this.addLinkFieldMeta(parentItem, siteMapItem, [
        'productDetailPageLink',
        'sizingDocumentsPageLink',
      ]);

      this.addLookupFieldMeta(parentItem, siteMapItem, 'productSeriesFacet', 'productSeries');
      this.addLookupFieldMeta(parentItem, siteMapItem, 'productTypeFacet', 'productType');
      this.addLookupFieldMeta(parentItem, siteMapItem, 'productWindowTypeFacet', 'windowType');
      this.addLookupFieldMeta(parentItem, siteMapItem, 'productDoorTypeFacet', 'doorType');
    }

    return siteMapItem;
  }

  private addImageFieldMeta(
    indexableItem: IndexableItem,
    siteMapItem: SitemapItem,
    fieldNames: string[]
  ) {
    fieldNames.forEach((name) => {
      const field = getImageField(indexableItem.fields, name);
      if (field?.src) {
        const src = checkHostNameInMediaURL(field.src);
        siteMapItem.metaData[field.name] = src;
        siteMapItem.metaData[`${field.name}_alt`] = field.alt;
        siteMapItem.metaData[`${field.name}_height`] = field.height;
        siteMapItem.metaData[`${field.name}_width`] = field.width;
      }
    });
  }

  private addLinkFieldMeta(
    indexableItem: IndexableItem,
    siteMapItem: SitemapItem,
    fieldNames: string[]
  ) {
    fieldNames.forEach((name) => {
      const field = getLinkField(indexableItem.fields, name);
      if (field) {
        siteMapItem.metaData[field.name] = field.url;
      }
    });
  }

  private addLookupFieldMeta(
    indexableItem: IndexableItem,
    siteMapItem: SitemapItem,
    fieldName: string,
    metaName: string
  ) {
    const field = getLookupField(indexableItem.fields, fieldName);
    if (field) {
      const value = getTextField(field.targetItem?.fields, 'title')?.value;
      if (value) {
        siteMapItem.metaData[metaName] = value;
      }
    }
  }

  private addProductDimensionsFieldMeta(
    indexableItem: IndexableItem,
    siteMapItem: SitemapItem,
    fieldNames: string[]
  ) {
    fieldNames.forEach((name) => {
      const field = getTextField(indexableItem.fields, name);
      if (field) {
        const value = field.value;
        if (value) {
          const dimensionMappings = value.split('\r\n');
          if (dimensionMappings && dimensionMappings.length > 0) {
            const dimensions: string[] = [];
            dimensionMappings
              .filter((e) => e)
              .map((dimension) => dimension.split('|'))
              .forEach(
                (d) =>
                  d &&
                  d.length > 0 &&
                  d[1] &&
                  d[2] &&
                  dimensions.push(`${decimalToFraction(d[1])}" x ${decimalToFraction(d[2])}"`)
              );
            if (dimensions) {
              siteMapItem.metaData[field.name] = dimensions.join(';');
            }
          }
        }
      }
    });
  }

  private addTextFieldMeta(
    indexableItem: IndexableItem,
    siteMapItem: SitemapItem,
    fieldNames: string[]
  ) {
    fieldNames.forEach((name) => {
      const field = getTextField(indexableItem.fields, name);
      if (field) {
        siteMapItem.metaData[field.name] = field.value;
      }
    });
  }
}

const GetLastUpdatedDate = (item: IndexableItem, parentItem: IndexableItem): Date | undefined => {
  let itemUpdatedDate;
  let parentItemUpdatedDate;

  const itemLlastUpdatedField = getDateField(item.fields, 'lastUpdated');
  if (itemLlastUpdatedField && itemLlastUpdatedField.value) {
    itemUpdatedDate = new Date(normalizeSitecoreDateString(itemLlastUpdatedField.value));
  }

  const parentItemLastUpdatedField = getDateField(parentItem?.fields, 'lastUpdated');
  if (parentItemLastUpdatedField && parentItemLastUpdatedField.value) {
    parentItemUpdatedDate = new Date(normalizeSitecoreDateString(parentItemLastUpdatedField.value));
  }

  let result: Date | undefined;
  if (itemUpdatedDate && parentItemUpdatedDate) {
    result = itemUpdatedDate > parentItemUpdatedDate ? itemUpdatedDate : parentItemUpdatedDate;
  } else {
    result = itemUpdatedDate || parentItemUpdatedDate;
  }
  return result;
};

export const productPropertiesPlugin = new ProductProperties();
