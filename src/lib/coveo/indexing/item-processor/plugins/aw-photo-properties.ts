import { SitecoreIds } from 'lib/constants/sitecore-ids';

import { getMultilistField, getTextField, IndexableItem, SitemapItem } from '../..';

export class AWPhotoProperties {
  order = 65;

  async exec(siteMapItem: SitemapItem, indexableItem: IndexableItem) {
    const photoTemplateId =
      SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Data.Photos.Photo.Id.replace(
        /-/g,
        ''
      );
    if (indexableItem.templateId.indexOf(photoTemplateId) == -1) {
      return siteMapItem;
    }

    this.addMultilistFieldMeta(indexableItem, siteMapItem, [
      'productSeries',
      'windowType',
      'doorType',
      'view',
      'roomType',
      'projectType',
      'buildingSubType',
      'buildingType',
    ]);

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

export const awPhotoPropertiesPlugin = new AWPhotoProperties();
