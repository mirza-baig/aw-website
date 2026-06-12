import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { checkHostNameInMediaURL } from 'lib/coveo/utils';
import { normalizeSitecoreDateString } from 'lib/utils/string-utils/normalize-sitecore-date-string';

import {
  getDateField,
  getImageField,
  getMultilistField,
  getRichTextField,
  getTextField,
  IndexableItem,
  SitemapItem,
} from '../..';

export class ProjectShowcaseProperties {
  order = 40;

  async exec(siteMapItem: SitemapItem, indexableItem: IndexableItem) {
    const basePageId =
      SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Pages.ProjectShowcasePage.Id.replace(
        /-/g,
        ''
      );
    if (indexableItem.allTemplateIds.indexOf(basePageId) == -1) {
      return siteMapItem;
    }

    this.addTextFieldMeta(indexableItem, siteMapItem, ['projectShowcaseTitle']);

    const projectShowcaseDescription = getRichTextField(
      indexableItem.fields,
      'projectShowcaseDescription'
    );
    if (projectShowcaseDescription) {
      siteMapItem.metaData[projectShowcaseDescription.name] = projectShowcaseDescription.value;
    }

    const projectShowcaseDate = getDateField(indexableItem.fields, 'projectShowcaseDate');
    if (projectShowcaseDate && projectShowcaseDate.value) {
      const normalized = normalizeSitecoreDateString(projectShowcaseDate.value);
      siteMapItem.metaData[projectShowcaseDate.name] = new Date(normalized).toISOString();
    }

    const projectShowcaseThumbnail = getImageField(
      indexableItem.fields,
      'projectShowcaseThumbnail'
    );
    if (projectShowcaseThumbnail && projectShowcaseThumbnail.src) {
      const src = checkHostNameInMediaURL(projectShowcaseThumbnail.src);
      siteMapItem.metaData[projectShowcaseThumbnail.name] = src;
      siteMapItem.metaData[`${projectShowcaseThumbnail.name}_alt`] = projectShowcaseThumbnail.alt;
      siteMapItem.metaData[`${projectShowcaseThumbnail.name}_height`] =
        projectShowcaseThumbnail.height;
      siteMapItem.metaData[`${projectShowcaseThumbnail.name}_width`] =
        projectShowcaseThumbnail.width;
    }

    this.addMultilistFieldMeta(indexableItem, siteMapItem, [
      'interactive',
      'projectType',
      'buildingType',
      'buildingSubType',
      'region',
      'homeStyle',
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

export const projectShowcasePropertiesPlugin = new ProjectShowcaseProperties();
