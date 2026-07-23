import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { checkHostNameInMediaURL } from 'lib/coveo/utils';

import {
  getCheckboxField,
  getImageField,
  getLookupField,
  getMultilistField,
  getTextField,
  IndexableItem,
  SitemapItem,
} from '../..';

export class PhotoProperties {
  order = 60;

  async exec(siteMapItem: SitemapItem, indexableItem: IndexableItem) {
    const basePhotoTemplateId =
      SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.BaseTemplates._BasePhoto.Id.replace(
        /-/g,
        ''
      );
    if (indexableItem.allTemplateIds.indexOf(basePhotoTemplateId) == -1) {
      return siteMapItem;
    }

    type RelatedPage = {
      url: string;
      pageTitle: string;
    };

    type RelatedPages = Array<RelatedPage>;
    siteMapItem.loc = siteMapItem.itemUri;

    siteMapItem.metaData['siteLanguage'] = indexableItem.language;

    siteMapItem.metaData['siteName'] = indexableItem.siteName;

    this.addTextFieldMeta(indexableItem, siteMapItem, ['photoTitle']);

    this.addImageFieldMeta(indexableItem, siteMapItem, ['thumbnailImage', 'fullImage']);

    this.addLookupFieldMeta(indexableItem, siteMapItem, ['thumbnailFocusArea']);

    const relatedPages = getMultilistField(indexableItem.fields, 'relatedPages');
    if (relatedPages && relatedPages.targetItems.length > 0) {
      const value: RelatedPages = relatedPages.targetItems?.map(
        (targetItem): RelatedPage => ({
          url: targetItem.url,
          pageTitle: getTextField(targetItem.fields, 'pageTitle')?.value ?? '',
        })
      );
      if (value) {
        siteMapItem.metaData[relatedPages.name] = JSON.stringify(value);
      }
    }

    const excludeFromSearch = getCheckboxField(indexableItem.fields, 'excludeFromSearch');
    if (excludeFromSearch) {
      siteMapItem.metaData[excludeFromSearch.name] = excludeFromSearch.boolValue ? 'true' : 'false';
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

  private addLookupFieldMeta(
    indexableItem: IndexableItem,
    siteMapItem: SitemapItem,
    fieldNames: string[]
  ) {
    fieldNames.forEach((name) => {
      const field = getLookupField(indexableItem.fields, name);
      if (field) {
        const value = getTextField(field.targetItem?.fields, 'title')?.value;
        if (value) {
          siteMapItem.metaData[field.name] = value;
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

export const photoPropertiesPlugin = new PhotoProperties();
