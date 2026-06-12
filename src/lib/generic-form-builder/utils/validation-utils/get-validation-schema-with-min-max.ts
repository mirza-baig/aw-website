import { getEnum } from 'lib/utils/get-enum';
import * as yup from 'yup';
import { Schema } from 'yup';

import { InputValueTypes } from './input-value-types';
import { Sitecore } from '.sitecore/AndersenWindows.model';

function getParams(parameter: string | number | undefined, errorMessage: string) {
  if (parameter !== 'undefined' && parameter !== '' && parameter !== null) {
    return [parameter, errorMessage];
  } else {
    return [errorMessage];
  }
}

export function getStringValidatonSchemaWithMinMax(
  input: Required<
    Sitecore.FieldSets.Forms.ValidationSettings & Sitecore.FieldSets.Forms.MinMaxLengthSettings
  >
): yup.StringSchema {
  return getValidatonSchemaWithMinMax(InputValueTypes.string, input) as yup.StringSchema;
}

export function getNumberValidatonSchemaWithMinMax(
  input: Required<
    Sitecore.FieldSets.Forms.ValidationSettings & Sitecore.FieldSets.Forms.MinMaxLengthSettings
  >
): yup.NumberSchema {
  return getValidatonSchemaWithMinMax(InputValueTypes.number, input) as yup.NumberSchema;
}

export function getBooleanValidatonSchemaWithMinMax(
  input: Required<
    Sitecore.FieldSets.Forms.ValidationSettings & Sitecore.FieldSets.Forms.MinMaxLengthSettings
  >
): yup.BooleanSchema {
  return getValidatonSchemaWithMinMax(InputValueTypes.bool, input) as yup.BooleanSchema;
}

export function getArrayValidatonSchemaWithMinMax(
  input: Required<
    Sitecore.FieldSets.Forms.ValidationSettings & Sitecore.FieldSets.Forms.MinMaxLengthSettings
  > // eslint-disable-next-line @typescript-eslint/no-explicit-any
): yup.ArraySchema<any, any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return getValidatonSchemaWithMinMax(InputValueTypes.array, input) as yup.ArraySchema<any, any>;
}

export function getValidatonSchemaWithMinMax(
  inputValueType: InputValueTypes,
  input: Required<
    Sitecore.FieldSets.Forms.ValidationSettings & Sitecore.FieldSets.Forms.MinMaxLengthSettings
  >
): yup.Schema {
  const init = yup[inputValueType] as () => Schema;
  let schema: Schema = init();
  const { validations, minLength, maxLength } = input.fields;

  validations.forEach((validationItem) => {
    const validationRule = validationItem as unknown as Sitecore.FieldSets.Forms.FieldValidation;
    const validationType = getEnum<string>(validationRule.fields?.validationType);
    const errorMessage = validationRule.fields?.errorMessage.value || '';
    let validationRuleParameter;

    switch (validationType) {
      case 'min':
        validationRuleParameter = minLength.value;
        break;
      case 'max':
        validationRuleParameter = maxLength.value;
        break;
      default:
        validationRuleParameter = validationRule?.fields?.validationRule?.value;
    }

    schema = schema[validationType as keyof Schema](
      ...getParams(validationRuleParameter, errorMessage)
    );
  });

  return schema;
}
