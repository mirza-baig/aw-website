import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { normalizeSitecoreDateStringFormatted } from 'lib/utils/string-utils/normalize-sitecore-date-string-formatted';

import {
  getDateField,
  getMultilistField,
  getRichTextField,
  getTextField,
  IndexableItem,
  SitemapItem,
} from '../..';

export class ArticleProperties {
  order = 30;

  async exec(siteMapItem: SitemapItem, indexableItem: IndexableItem) {
    if (
      indexableItem.allTemplateIds.indexOf(
        SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Pages.ArticlePage.Id.replace(
          /-/g,
          ''
        )
      ) === -1
    ) {
      return siteMapItem;
    }

    this.addTextFieldMeta(indexableItem, siteMapItem, ['articleTitle']);

    const articleDescription = getRichTextField(indexableItem.fields, 'articleDescription');
    if (articleDescription) {
      siteMapItem.metaData[articleDescription.name] = articleDescription.value;
    }

    this.addTextFieldMeta(indexableItem, siteMapItem, ['articleAuthor']);

    const articleDate = getDateField(indexableItem.fields, 'articleDate');
    if (articleDate && articleDate.value) {
      const dateSitecore = normalizeSitecoreDateStringFormatted(articleDate.value);
      siteMapItem.metaData[articleDate.name] = dateSitecore;
    }

    const articleCategory = getMultilistField(indexableItem.fields, 'articleCategory');
    if (articleCategory) {
      const value = articleCategory.targetItems?.map(
        (targetItem) => getTextField(targetItem.fields, 'title')?.value
      );
      if (value) {
        siteMapItem.metaData[articleCategory.name] = value.join(';');
      }

      const firstCategory = getTextField(articleCategory.targetItems?.[0]?.fields, 'title')?.value;
      if (firstCategory) {
        siteMapItem.metaData[`${articleCategory.name}_display`] = firstCategory;
      }
    }

    this.addMultilistFieldMeta(indexableItem, siteMapItem, [
      'articlePublicTags',
      'articlePrivateTags',
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

export const articlePropertiesPlugin = new ArticleProperties();
