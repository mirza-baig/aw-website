type ItemQueryResultField = {
  name: string;
  __typename: string;
};

type ItemQueryResultRichTextField = ItemQueryResultField & {
  value: string;
};

type ItemQueryResultNumberField = ItemQueryResultField & {
  numberValue: number;
};

type ItemQueryResultNameValueListField = ItemQueryResultField & {
  values: {
    name: string;
    value: string;
  }[];
};

type ItemQueryResultMultilistField = ItemQueryResultField & {
  targetItems: {
    id: string;
  }[];
};

type ItemQueryResultLookupField = ItemQueryResultField & {
  targetItem: {
    id: string;
  };
};

type ItemQueryResultLinkField = ItemQueryResultField & {
  anchor: string;
  className: string;
  linkType: string;
  queryString: string;
  text: string;
  url: string;
};

type ItemQueryResultTextField = ItemQueryResultField & {
  value: string;
};

type ItemQueryResultIntegerField = ItemQueryResultField & {
  intValue: number;
};

type ItemQueryResultImageField = ItemQueryResultField & {
  alt: string;
  height: string;
  width: string;
  src: string;
};

type ItemQueryResultDateField = ItemQueryResultField & {
  value: string;
};

type ItemQueryResultChecbokField = ItemQueryResultField & {
  boolValue: boolean;
};

export type ItemQueryResultFields =
  | ItemQueryResultRichTextField
  | ItemQueryResultNumberField
  | ItemQueryResultNameValueListField
  | ItemQueryResultMultilistField
  | ItemQueryResultLookupField
  | ItemQueryResultLinkField
  | ItemQueryResultTextField
  | ItemQueryResultIntegerField
  | ItemQueryResultImageField
  | ItemQueryResultDateField
  | ItemQueryResultChecbokField;

/**
 * The schema of data returned in response to sitemaps request
 */
export type ItemQueryResult = {
  id: string;
  name: string;
  language: {
    name: string;
  };
  path: string;
  url: {
    path: string;
    siteName: string;
  };
  version: number;
  template: {
    id: string;
    name: string;
  };
  fields: ItemQueryResultFields[];
};

export function isMultilistField(
  field: ItemQueryResultFields
): field is ItemQueryResultMultilistField {
  return field.__typename == 'MultilistField';
}

export function isLookupField(field: ItemQueryResultFields): field is ItemQueryResultLookupField {
  return field.__typename == 'LookupField';
}
