import { ProvidedValue } from 'lib/generic-form-builder/value-providers';
import { Schema } from 'yup';

export enum FormItemDetailType {
  StandardField = 'StandardField',
  CompositeField = 'CompositeField',
  BotCheckerField = 'BotCheckerField',
  // Element = 'Element',
}

export type StandardFieldDetail = {
  type: FormItemDetailType.StandardField;
  id: string;
  name: string;
  templateName: string;
  validationSchema?: Schema;
  hideOnLoad: boolean;
  initialValue: ProvidedValue | ProvidedValue[] | null;
};

export type CompositeSubfieldDetail = {
  id: string;
  name: string;
  validationSchema?: Schema;
  initialValue: ProvidedValue | ProvidedValue[] | null;
};

export type CompositeFieldDetail = {
  type: FormItemDetailType.CompositeField;
  id: string;
  prefix?: string;
  templateName: string;
  subfields: CompositeSubfieldDetail[];
};

export type BotCheckerFieldDetail = {
  type: FormItemDetailType.BotCheckerField;
  name: string;
};

// export type FormElementDetail = {
//   id: string;
//   type: FormItemDetailType.Element;
//   hideOnLoad: boolean;
// };

export type FormItemDetail =
  | BotCheckerFieldDetail
  | CompositeFieldDetail
  // | FormElementDetail
  | StandardFieldDetail;

export function isStandardFieldDetail(field: FormItemDetail): field is StandardFieldDetail {
  return field.type === FormItemDetailType.StandardField;
}

export function isCompositeFieldDetail(field: FormItemDetail): field is CompositeFieldDetail {
  return field.type === FormItemDetailType.CompositeField;
}

export function isBotCheckerFieldDetail(field: FormItemDetail): field is BotCheckerFieldDetail {
  return field.type === FormItemDetailType.BotCheckerField;
}

export function botCheckerFieldDetail(
  props: Omit<BotCheckerFieldDetail, 'type'>
): BotCheckerFieldDetail {
  return {
    type: FormItemDetailType.BotCheckerField,
    ...props,
  };
}

export function standardFieldDetail(props: Omit<StandardFieldDetail, 'type'>): StandardFieldDetail {
  return {
    type: FormItemDetailType.StandardField,
    ...props,
  };
}

export function compositeFieldDetail(
  props: Omit<CompositeFieldDetail, 'type'>
): CompositeFieldDetail {
  return {
    type: FormItemDetailType.CompositeField,
    ...props,
  };
}
