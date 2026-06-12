import { getEnum } from 'lib/utils/get-enum';
import * as yup from 'yup';
import { Schema } from 'yup';

import { InputValueTypes } from './input-value-types';
import { Sitecore } from '.sitecore/AndersenWindows.model';

function getParams(parameter: string | number | boolean[] | undefined, errorMessage: string) {
  if (
    parameter !== 'undefined' &&
    parameter !== '' &&
    parameter !== null &&
    parameter !== undefined
  ) {
    return [parameter, errorMessage];
  } else {
    return [errorMessage];
  }
}

export function getStringValidatonSchema(
  input: Required<Sitecore.FieldSets.Forms.ValidationSettings>
): yup.StringSchema {
  return getValidatonSchema(InputValueTypes.string, input) as yup.StringSchema;
}

export function getNumberValidatonSchema(
  input: Required<Sitecore.FieldSets.Forms.ValidationSettings>
): yup.NumberSchema {
  return getValidatonSchema(InputValueTypes.number, input) as yup.NumberSchema;
}

export function getBooleanValidatonSchema(
  input: Required<Sitecore.FieldSets.Forms.ValidationSettings>
): yup.BooleanSchema {
  return getValidatonSchema(InputValueTypes.bool, input) as yup.BooleanSchema;
}

export function getArrayValidatonSchema(
  input: Required<Sitecore.FieldSets.Forms.ValidationSettings>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): yup.ArraySchema<any, any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return getValidatonSchema(InputValueTypes.array, input) as yup.ArraySchema<any, any>;
}

export function getValidatonSchema(
  inputValueType: InputValueTypes,
  input: Required<Sitecore.FieldSets.Forms.ValidationSettings>
): yup.Schema {
  const init = yup[inputValueType] as () => Schema;
  let schema: Schema = init();
  const { validations } = input.fields;

  validations.forEach((validationItem) => {
    const validationRule = validationItem as unknown as Sitecore.FieldSets.Forms.FieldValidation;
    let validationType = getEnum<string>(validationRule.fields?.validationType);
    const errorMessage = validationRule.fields?.errorMessage.value || '';
    let validationRuleParameter;

    switch (validationType) {
      case 'required':
        // Required for arrays is acutally a min of 1
        if (inputValueType === InputValueTypes.array) {
          validationType = 'min';
          validationRuleParameter = 1;
        } else if (inputValueType === InputValueTypes.bool) {
          // For boolean, required means it must be true
          validationType = 'oneOf';
          validationRuleParameter = [true];
        }
        break;
      case 'min':
        console.error(`Validation of type 'min' is not suppored by this field.`);
        return;
      case 'max':
        console.error(`Validation of type 'max' is not suppored by this field.`);
        return;
      default:
        validationRuleParameter = validationRule.fields?.validationRule.value;
    }

    schema = schema[validationType as keyof Schema](
      ...getParams(validationRuleParameter, errorMessage)
    );
  });

  return schema;
}
