import { isArray } from 'lodash';
import { Schema } from 'yup';

export type FormPage = {
  label: string;
  includeInSteps: boolean;
  hideStepper: boolean;
  fields: FormField[];
  initialHiddenFieldExists: boolean;
  validationSchema: Schema;
};

export type StandardField = {
  id: string;
  name: string;
  templateName: string;
};

export type CompositeSubfield = {
  id: string;
  name: string;
};

export type CompositeField = {
  id: string;
  prefix?: string;
  templateName: string;
  subfields: CompositeSubfield[];
};

export type FormField = StandardField | CompositeField;

export function isCompositeField(field: FormField): field is CompositeField {
  const subfields = (field as CompositeField).subfields;
  return subfields !== undefined && isArray(subfields);
}

export function isStandardField(field: FormField): field is StandardField {
  const name = (field as StandardField).name;
  return name !== undefined && typeof name === 'string';
}
