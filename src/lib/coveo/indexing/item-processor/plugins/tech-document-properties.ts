import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { checkHostNameInMediaURL } from 'lib/coveo/utils';
import { getErrorMessage } from 'lib/utils/error-utils/get-error-message';
import { normalizeSitecoreDateString } from 'lib/utils/string-utils/normalize-sitecore-date-string';

import {
  getCheckboxField,
  getDateField,
  getLinkField,
  getLookupField,
  getMultilistField,
  getRichTextField,
  getTextField,
  IndexableItem,
  SitemapItem,
} from '../..';

export class TechDocumentProperties {
  order = 50;

  async exec(siteMapItem: SitemapItem, indexableItem: IndexableItem) {
    const techDocumentTemplateId =
      SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Data.Documents.TechnicalDocument.Id.replace(
        /-/g,
        ''
      );
    if (!indexableItem.templateId.includes(techDocumentTemplateId)) {
      return siteMapItem;
    }

    const lastUpdated = getDateField(indexableItem.fields, 'lastUpdated');
    if (lastUpdated?.value) {
      siteMapItem.lastmod = new Date(normalizeSitecoreDateString(lastUpdated.value));
    }

    siteMapItem.metaData['siteLanguage'] = indexableItem.language;
    siteMapItem.metaData['siteName'] = indexableItem.siteName;

    this.addTextFieldMeta(indexableItem, siteMapItem, [
      'documentEyebrow',
      'documentTitle',
      'documentNumber',
    ]);

    this.addRichTextFieldMeta(indexableItem, siteMapItem, ['documentDescription']);

    const document = getLinkField(indexableItem.fields, 'document');
    if (document?.url) {
      let documentUrl = checkHostNameInMediaURL(document.url);

      // Remove time limited hashing from document URLs
      if (documentUrl.includes('tt=') || documentUrl.includes('ttc=')) {
        try {
          const url = new URL(documentUrl);
          url.searchParams.delete('tt');
          url.searchParams.delete('ttc');
          documentUrl = url.toString();
        } catch (e: unknown) {
          console.log(
            `Error removing tt & ttc search params.\nSrc: ${documentUrl}\nError: ${getErrorMessage(e)}`
          );
        }
      }

      siteMapItem.metaData[document.name] = documentUrl;
      siteMapItem.url = documentUrl;
      const indexableItemId = indexableItem?.id?.toLowerCase();
      siteMapItem.loc = documentUrl.includes('?')
        ? `${documentUrl}&did=${indexableItemId}`
        : `${documentUrl}?did=${indexableItemId}`;
    }

    siteMapItem.metaData['sitesearchtopic'] = 'Technical Documents';

    this.addLookupFieldMeta(indexableItem, siteMapItem, ['documentType']);

    const site = getMultilistField(indexableItem.fields, 'documentSite');
    if (site && site.targetItems.length > 0) {
      const value = site.targetItems?.map((targetItem) => targetItem.name);
      if (value) {
        siteMapItem.metaData[site.name] = value.join(';');
      }
    }

    this.addMultilistFieldMeta(indexableItem, siteMapItem, [
      'documentLanguage',
      'productSeries',
      'windowType',
      'doorType',
      'productOptions',
      'awningType',
      'casementType',
      'doubleHungType',
      'specialtyType',
      'stormDoorType',
      'environmentDocumentType',
      'installationMethods',
      'installationGuideType',
      'performanceDocumentType',
      'serviceGuideType',
      'doorSwing',
      'sizingDocumentType',
      'joiningType',
      'productStatus',
      'productBrand',
    ]);

    const excludeFromSearch = getCheckboxField(indexableItem.fields, 'excludeFromSearch');
    if (excludeFromSearch) {
      siteMapItem.metaData[excludeFromSearch.name] = excludeFromSearch.boolValue ? 'true' : 'false';
    }

    return siteMapItem;
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

  private addRichTextFieldMeta(
    indexableItem: IndexableItem,
    siteMapItem: SitemapItem,
    fieldNames: string[]
  ) {
    fieldNames.forEach((name) => {
      const field = getRichTextField(indexableItem.fields, name);
      if (field) {
        siteMapItem.metaData[field.name] = field.value;
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

export const techDocumentPropertiesPlugin = new TechDocumentProperties();
