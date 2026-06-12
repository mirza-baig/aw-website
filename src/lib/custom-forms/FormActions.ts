import FIELD_IDS from 'lib/constants/salesforce-field-ids';

import { FormFieldProps } from './FormFieldProps';
import { FormProps } from './FormProps';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export const translateFieldMappings = (
  props: FormProps,
  fieldStates: Record<string, string>,
  actionFieldProps: Sitecore.BaseTemplates.BaseSubmitAction['fields']
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, any> => {
  const formModel: Record<string, unknown> = {};

  const processFields = (fields: FormFieldProps[]) => {
    for (const field of fields) {
      const fieldName = field?.fields?.fieldName?.value;

      if (fieldName) {
        const fieldMapping = findKeyById(actionFieldProps, field.id)
          ?.replace('ef-', '')
          ?.toUpperCase();

        const key = fieldMapping && (FIELD_IDS as { [key: string]: string })[fieldMapping];

        if (key) {
          formModel[key] = fieldStates[fieldName];
        }
      }

      if (field.templateName !== 'Button' && field.fields?.children?.length > 0) {
        processFields(field.fields.children);
      }
    }
  };

  props.fields?.children.forEach((page) => {
    if (page.fields?.children?.length > 0) {
      processFields(page.fields.children);
    }
  });

  return formModel;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findKeyById(obj: any, idToMatch: string): string | null {
  for (const key in obj) {
    if (
      obj.hasOwnProperty(key) &&
      obj[key] &&
      typeof obj[key] === 'object' &&
      obj[key].id === idToMatch
    ) {
      return key;
    }
  }
  return null;
}

// utility function to retrive fieldName from whole GFB Form Data corresponding to provided item id
export function findFieldById(data: FormFieldProps, idToMatch: string): FormFieldProps | null {
  if (data.id === idToMatch) {
    // Check if the current object has the desired ID
    if (data.fields?.fieldName) {
      return data;
    }
  }
  // Check if the current object has children and search recursively
  if (Array.isArray(data.fields?.children) && data.fields.children.length > 0) {
    for (const child of data.fields.children) {
      const result = findFieldById(child, idToMatch);
      if (result) {
        return result; // Return the result if found in the children
      }
    }
  }
  // If not found, return null
  return null;
}

// utility function to retrive multiple fields by giving multiple ids
export function findFieldsByIds(
  data: FormFieldProps,
  idsToMatch: Array<string>
): Record<string, unknown> {
  const fieldsByIds: Record<string, unknown> = {};
  let isSearchComplete = false;

  const loopThroughFields = (fields: Array<FormFieldProps>) => {
    for (const field of fields) {
      if (isSearchComplete) {
        break;
      }
      // If field found then store it
      if (idsToMatch.includes(field.id)) {
        fieldsByIds[field.id] = field;
        isSearchComplete = Object.keys(fieldsByIds).length === idsToMatch.length;
      }
      // If field has nested fields e.g. Address
      if (field?.fields?.children && field?.fields?.children.length > 0) {
        loopThroughFields(field?.fields?.children);
      }
    }
  };

  // Loop each form page
  for (const formPage of data.fields.children) {
    // Loop each field in page
    loopThroughFields(formPage.fields.children);

    if (isSearchComplete) {
      break;
    }
  }
  return fieldsByIds;
}

export function isFieldIncludedInForm(data: FormFieldProps, TemplateNameToMatch: string): boolean {
  let isFieldAvailableInForm = false;
  let isSearchComplete = false;

  const loopThroughFields = (fields: Array<FormFieldProps>) => {
    for (const field of fields) {
      if (isSearchComplete) {
        break;
      }
      // If field found then store it
      if (field.templateName === TemplateNameToMatch) {
        isFieldAvailableInForm = true;
        isSearchComplete = true;
      }
    }
  };

  // Loop each form page
  for (const formPage of data.fields.children) {
    // Loop each field in page
    loopThroughFields(formPage.fields.children);

    if (isSearchComplete) {
      break;
    }
  }
  return isFieldAvailableInForm;
}
