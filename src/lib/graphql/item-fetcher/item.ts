export type ItemField = {
  name: string;
  type: string;
};

export type ItemRichTextField = ItemField & {
  value: string;
};

export type ItemNumberField = ItemField & {
  numberValue: number;
};

export type ItemNameValueListField = ItemField & {
  values: {
    name: string;
    value: string;
  }[];
};

export type ItemMultilistField = ItemField & {
  targetItems: {
    id: string;
  }[];
};

export type ItemLookupField = ItemField & {
  targetItem: {
    id: string;
  };
};

export type ItemLinkField = ItemField & {
  anchor: string;
  className: string;
  linkType: string;
  queryString: string;
  text: string;
  url: string;
};

export type ItemTextField = ItemField & {
  value: string;
};

export type ItemIntegerField = ItemField & {
  intValue: number;
};

export type ItemImageField = ItemField & {
  alt: string;
  height: string;
  width: string;
  src: string;
};

export type ItemDateField = ItemField & {
  value: string;
};

export type ItemChecbokField = ItemField & {
  boolValue: boolean;
};

export type ItemFields =
  | ItemRichTextField
  | ItemNumberField
  | ItemNameValueListField
  | ItemMultilistField
  | ItemLookupField
  | ItemLinkField
  | ItemTextField
  | ItemIntegerField
  | ItemImageField
  | ItemDateField
  | ItemChecbokField;

export type Item = {
  id: string;
  name: string;
  language: string;
  path: string;
  templateId: string;
  templateName: string;
  fields: ItemFields[];
};
