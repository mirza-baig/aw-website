import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { checkHostNameInMediaURL } from 'lib/coveo/utils';

import {
  ChangeFrequency,
  getCheckboxField,
  getImageField,
  getLookupField,
  getRichTextField,
  getTextField,
  IndexableItem,
  isChangeFrequency,
  SitemapItem,
} from '../..';

export class PageProperties {
  order = 10;

  async exec(siteMapItem: SitemapItem, indexableItem: IndexableItem) {
    const basePageId =
      SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.BaseTemplates._BasePage.Id.replace(
        /-/g,
        ''
      );
    if (indexableItem.allTemplateIds.indexOf(basePageId) == -1) {
      return siteMapItem;
    }
    const priority = getLookupField(indexableItem.fields, 'sitemapPriority');
    if (priority) {
      const value = Number.parseFloat(
        getTextField(priority.targetItem?.fields, 'Value')?.value ?? ''
      );
      if (!isNaN(value)) {
        siteMapItem.priority = value;
      }
    }

    const changeFrequency = getLookupField(indexableItem.fields, 'sitemapChangeFrequency');
    if (changeFrequency) {
      const value = getTextField(changeFrequency.targetItem?.fields, 'Value')?.value ?? '';
      if (isChangeFrequency(value)) {
        siteMapItem.changefreq = value as ChangeFrequency;
      }
    }

    this.addTextFieldMeta(indexableItem, siteMapItem, ['pageTitle', 'pageMetaDescription']);

    siteMapItem.metaData['siteLanguage'] = indexableItem.language;

    siteMapItem.metaData['siteName'] = indexableItem.siteName;

    this.addTextFieldMeta(indexableItem, siteMapItem, ['siteSearchEyebrow', 'siteSearchHeadline']);

    const siteSearchDescription = getRichTextField(indexableItem.fields, 'siteSearchDescription');
    if (siteSearchDescription) {
      siteMapItem.metaData[siteSearchDescription.name] = siteSearchDescription.value;
    }

    this.addImageFieldMeta(indexableItem, siteMapItem, [
      'siteSearchImage',
      'featuredImage',
      'primaryImage',
      'primaryImageMobile',
    ]);

    this.addLookupFieldMeta(indexableItem, siteMapItem, [
      'primaryImageMobileFocusArea',
      'siteSearchTopic',
    ]);

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

export const pagePropertiesPlugin = new PageProperties();
