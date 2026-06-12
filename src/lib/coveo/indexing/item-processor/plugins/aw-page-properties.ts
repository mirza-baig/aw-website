import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { getProductIds } from 'lib/utils/get-product-ids';

import { getMultilistField, getTextField, IndexableItem, SitemapItem } from '../..';

export class AWPageProperties {
  order = 20;

  async exec(siteMapItem: SitemapItem, indexableItem: IndexableItem) {
    const basePageId =
      SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.BaseTemplates._BasePage.Id.replace(
        /-/g,
        ''
      );
    if (indexableItem.allTemplateIds.indexOf(basePageId) == -1) {
      return siteMapItem;
    }

    this.addMultilistFieldMeta(indexableItem, siteMapItem, [
      'productType',
      'doorType',
      'windowType',
      'productSeries',
    ]);

    const relatedProducts = getMultilistField(indexableItem.fields, 'relatedProducts');
    if (relatedProducts) {
      const productIds: string[] = [];
      relatedProducts.targetItems?.map((targetItem) =>
        targetItem.children.map((child) =>
          productIds.push(...getProductIds(getTextField(child.fields, 'productDimensions')?.value))
        )
      );
      if (productIds.length > 0) {
        siteMapItem.metaData[relatedProducts.name] = productIds.join(';');
      }
    }

    return siteMapItem;
  }

  private addMultilistFieldMeta(
    indexableItem: IndexableItem,
    siteMapItem: SitemapItem,
    fieldNames: string[]
  ) {
    fieldNames.forEach((name) => {
      const field = getMultilistField(indexableItem.fields, name);
      if (field) {
        if (field.targetItems?.length > 0) {
          const value = field.targetItems.map(
            (targetItem) => getTextField(targetItem.fields, 'title')?.value
          );
          if (value) {
            siteMapItem.metaData[field.name] = value.join(';');
          }
        }
      }
    });
  }
}

export const awPagePropertiesPlugin = new AWPageProperties();
