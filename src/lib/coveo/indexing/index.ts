import { getErrorMessage } from 'lib/utils/error-utils/get-error-message';
import xml from 'xmlbuilder';

/**
 * Object model of a indexable item.
 */
export type IndexableItem = {
  id: string;
  name: string;
  language: string;
  parent?: IndexableItem;
  path: string;
  urlPath: string;
  siteName: string;
  version: number;
  templateId: string;
  templateName: string;
  allTemplateIds: string[];
  ancestors: string[];
  fields: IndexableFields[];
};

export type IndexableField = {
  name: string;
  type: string;
};

export type IndexableRichTextField = IndexableField & {
  value: string;
};

export type IndexableNumberField = IndexableField & {
  numberValue: number;
};

export type IndexableNameValueListField = IndexableField & {
  values: {
    name: string;
    value: string;
  }[];
};

export type IndexableMultilistField = IndexableField & {
  targetItems: {
    id: string;
    name: string;
    url: string;
    fields: IndexableFields[];
    children: {
      fields: IndexableFields[];
    }[];
  }[];
};

export type IndexableLookupField = IndexableField & {
  targetItem: {
    template: {
      id: string;
    };
    id: string;
    name: string;
    fields: IndexableFields[];
  };
};

export type IndexableLinkField = IndexableField & {
  anchor: string;
  className: string;
  linkType: string;
  queryString: string;
  text: string;
  url: string;
};

export type IndexableTextField = IndexableField & {
  value: string;
};

export type IndexableIntegerField = IndexableField & {
  intValue: number;
};

export type IndexableImageField = IndexableField & {
  alt: string;
  height: string;
  width: string;
  src: string;
};

export type IndexableDateField = IndexableField & {
  value: string;
};

export type IndexableChecbokField = IndexableField & {
  boolValue: boolean;
};

export type IndexableFields =
  | IndexableRichTextField
  | IndexableNumberField
  | IndexableNameValueListField
  | IndexableMultilistField
  | IndexableLookupField
  | IndexableLinkField
  | IndexableTextField
  | IndexableIntegerField
  | IndexableImageField
  | IndexableDateField
  | IndexableChecbokField;

export type ChangeFrequency =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never';

export function isChangeFrequency(value: string): boolean {
  const values = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
  return values.indexOf(value) >= 0;
}

export class SitemapItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly metaData: Record<string, any> = {};

  // Sitemap Fields
  public loc = '';
  public lastmod: Date | undefined;
  public priority = 0.5;
  public changefreq: ChangeFrequency = 'daily';

  // Sitecore Fields
  public id = '';
  public name = '';
  public language = '';
  public parentId = '';
  public path = '';
  public url = '';
  public version = 1;
  public templateId = '';
  public templateName = '';
  public allTemplateIds = '';
  public ancestors = '';
  public source = '';
  public siteName = '';
  public itemUri = '';

  public serialize(node: xml.XMLElement) {
    // Sitemap Fields
    if (this.loc) {
      node.ele('loc').text(this.loc);
    }
    if (this.lastmod) {
      node.ele('lastmod').text(this.lastmod.toISOString());
    }
    node.ele('priority').text(this.priority.toString());
    node.ele('changefreq').text(this.changefreq);

    // Sitecore FIelds
    const coveoMetadata = node.ele('coveo:metadata');
    coveoMetadata
      .ele('uri')
      .text(
        `sitecore://database/${this.source}/ItemId/${this.id}/Language/${this.language}/Version/${this.version}`
      );
    coveoMetadata.ele('sc_id').text(this.id);
    coveoMetadata.ele('sc_name').text(this.name);
    coveoMetadata.ele('sc_language').text(this.language);
    if (this.parentId) {
      coveoMetadata.ele('sc_parentid').text(this.parentId);
    }
    coveoMetadata.ele('sc_path').text(this.path);
    if (this.url) {
      coveoMetadata.ele('sc_url').text(this.url);
    }
    coveoMetadata.ele('sc_sitename').text(this.siteName);
    coveoMetadata
      .ele('sc_uri')
      .text(`sitecore://${this.source}/${this.id}/${this.language}/${this.version}`);
    coveoMetadata.ele('sc_version').text(this.version.toString());
    coveoMetadata.ele('sc_templateid').text(this.templateId);
    coveoMetadata.ele('sc_templatename').text(this.templateName);
    coveoMetadata.ele('sc_alltemplates').text(this.allTemplateIds);
    coveoMetadata.ele('sc_pathids').text(this.ancestors);

    for (const key in this.metaData) {
      const value = this.metaData[key];
      if (value) {
        coveoMetadata.ele(`aw_xmc_${key}`.toLowerCase()).cdata(value);
      }
    }
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Array<T> {
    getRichTextField(fieldName: string): IndexableRichTextField | undefined;
    getNumberField(fieldName: string): IndexableNumberField | undefined;
    getNameValueListField(fieldName: string): IndexableNameValueListField | undefined;
    getMultilistField(fieldName: string): IndexableMultilistField | undefined;
    getLookupField(fieldName: string): IndexableLookupField | undefined;
    getLinkField(fieldName: string): IndexableLinkField | undefined;
    getTextField(fieldName: string): IndexableTextField | undefined;
    getIntegerField(fieldName: string): IndexableIntegerField | undefined;
    getImageField(fieldName: string): IndexableImageField | undefined;
    getDateField(fieldName: string): IndexableDateField | undefined;
    getCheckboxField(fieldName: string): IndexableChecbokField | undefined;
  }
}

// Utility functions for IndexableFields arrays
export function getRichTextField(
  fields: IndexableFields[] | undefined,
  fieldName: string
): IndexableRichTextField | undefined {
  return fields?.find(
    (field: IndexableField) => field.type === 'RichTextField' && field.name === fieldName
  ) as IndexableRichTextField | undefined;
}

export function getNumberField(
  fields: IndexableFields[] | undefined,
  fieldName: string
): IndexableNumberField | undefined {
  return fields?.find(
    (field: IndexableField) => field.type === 'NumberField' && field.name === fieldName
  ) as IndexableNumberField | undefined;
}

export function getNameValueListField(
  fields: IndexableFields[] | undefined,
  fieldName: string
): IndexableNameValueListField | undefined {
  return fields?.find(
    (field: IndexableField) => field.type === 'NameValueListField' && field.name === fieldName
  ) as IndexableNameValueListField | undefined;
}

export function getMultilistField(
  fields: IndexableFields[] | undefined,
  fieldName: string
): IndexableMultilistField | undefined {
  return fields?.find(
    (field: IndexableField) => field.type === 'MultilistField' && field.name === fieldName
  ) as IndexableMultilistField | undefined;
}

export function getLookupField(
  fields: IndexableFields[] | undefined,
  fieldName: string
): IndexableLookupField | undefined {
  return fields?.find(
    (field: IndexableField) => field.type === 'LookupField' && field.name === fieldName
  ) as IndexableLookupField | undefined;
}

export function getLinkField(
  fields: IndexableFields[] | undefined,
  fieldName: string
): IndexableLinkField | undefined {
  return fields?.find(
    (field: IndexableField) => field.type === 'LinkField' && field.name === fieldName
  ) as IndexableLinkField | undefined;
}

export function getTextField(
  fields: IndexableFields[] | undefined,
  fieldName: string
): IndexableTextField | undefined {
  return fields?.find(
    (field: IndexableField) => field.type === 'TextField' && field.name === fieldName
  ) as IndexableTextField | undefined;
}

export function getIntegerField(
  fields: IndexableFields[] | undefined,
  fieldName: string
): IndexableIntegerField | undefined {
  return fields?.find(
    (field: IndexableField) => field.type === 'IntegerField' && field.name === fieldName
  ) as IndexableIntegerField | undefined;
}

export function getImageField(
  fields: IndexableFields[] | undefined,
  fieldName: string
): IndexableImageField | undefined {
  const field = fields?.find(
    (field: IndexableField) => field.type === 'ImageField' && field.name === fieldName
  ) as IndexableImageField | undefined;

  if (field?.src == undefined) {
    return field;
  }

  if (!(field.src.includes('tt=') && field.src.includes('ttc='))) {
    return field;
  }

  // Remove time limited hashing from image URLs
  try {
    const url = new URL(field.src);
    url.searchParams.delete('tt');
    url.searchParams.delete('ttc');
    field.src = url.toString();
  } catch (e: unknown) {
    console.log(
      `Error removing tt & ttc search params.\nSrc: ${field.src}\nError: ${getErrorMessage(e)}`
    );
  }

  return field;
}

export function getDateField(
  fields: IndexableFields[] | undefined,
  fieldName: string
): IndexableDateField | undefined {
  return fields?.find(
    (field: IndexableField) => field.type === 'DateField' && field.name === fieldName
  ) as IndexableDateField | undefined;
}

export function getCheckboxField(
  fields: IndexableFields[] | undefined,
  fieldName: string
): IndexableChecbokField | undefined {
  return fields?.find(
    (field: IndexableField) => field.type === 'CheckboxField' && field.name === fieldName
  ) as IndexableChecbokField | undefined;
}
