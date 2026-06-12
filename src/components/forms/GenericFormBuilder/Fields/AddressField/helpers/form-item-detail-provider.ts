import { Field } from '@sitecore-content-sdk/nextjs';
import { getValueProviderValue } from 'lib/generic-form-builder/utils/initial-value-utils/get-value-provider-value';
import {
  compositeFieldDetail,
  CompositeSubfieldDetail,
  FormItemDetail,
} from 'lib/generic-form-builder/utils/load-utils/form-item-detail';
import { getStringValidatonSchema } from 'lib/generic-form-builder/utils/validation-utils/get-validation-schema';
import { ProvidedValues } from 'lib/generic-form-builder/value-providers';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';
import { Schema, string } from 'yup';

import { AddressProps } from '../AddressField';
import { StateItem } from './address-field-utils';

function getCountryInitialValue(props: Required<AddressProps>): ProvidedValues {
  if (props.countryAndStateOptions == undefined) {
    return '';
  }

  const initialValue = getValueProviderValue({
    fields: { valueProviders: props.fields.countryValueProviders },
  });
  if (
    initialValue &&
    // @ts-ignore Once type generation is fixed, then type is inferred correctly
    props.countryAndStateOptions.some((option) => option.value === initialValue)
  ) {
    return initialValue;
  }

  if (props.fields.countryDefaultValue) {
    const valueName = props.fields.valueFieldName.value ?? 'value';
    const valueField = props.fields.countryDefaultValue.fields[valueName] as Field<string>;
    return valueField.value;
  }
  if (props.fields.countryShowDefaultDisplay.value) {
    return '';
  }
  return props.countryAndStateOptions.length > 0 ? props.countryAndStateOptions[0].value : null;
}

function getStateInitialValue(props: Required<AddressProps>): ProvidedValues {
  let stateOptions: StateItem[] | undefined = undefined;
  if (isNullOrWhitespace(props.fields.countryFieldName.value)) {
    stateOptions = props.stateOptions;
  } else {
    const countryInitialValue = getCountryInitialValue(props);
    stateOptions =
      // @ts-ignore Once type generation is fixed, then type is inferred correctly
      props.countryAndStateOptions.find((option) => option.value === countryInitialValue)?.states ??
      [];
  }

  const initialValue = getValueProviderValue({
    fields: { valueProviders: props.fields.stateValueProviders },
  });
  // @ts-ignore Once type generation is fixed, then type is inferred correctly
  if (initialValue && stateOptions.some((option) => option.value === initialValue)) {
    return initialValue;
  }

  if (props.fields.stateDefaultValue) {
    const valueName = props.fields.valueFieldName.value ?? 'value';
    const valueField = props.fields.stateDefaultValue.fields[valueName] as Field<string>;
    return valueField.value;
  }
  if (props.fields.stateShowDefaultDisplay.value) {
    return '';
  }
  // @ts-ignore Once type generation is fixed, then type is inferred correctly
  return stateOptions.length > 0 ? stateOptions[0].value : null;
}

function getZipCodeValidationSchema(props: Required<AddressProps>): Schema | undefined {
  if (isNullOrWhitespace(props.fields.countryFieldName.value)) {
    const validationSchema = getStringValidatonSchema({
      fields: { validations: props.fields.zipCodeValidations },
    });
    return validationSchema.trim();
  }

  let validationSchema = string().trim();

  if (props.fields.zipCodeUSValidations) {
    const zipCodeUSValidations = getStringValidatonSchema({
      fields: { validations: props.fields.zipCodeUSValidations },
    });
    validationSchema = validationSchema.when(props.fields.countryFieldName.value, {
      is: (value: string) => ['USA', 'Mexico'].includes(value),
      then: (innerValidator) => innerValidator.concat(zipCodeUSValidations),
      otherwise: (innerValidator) => innerValidator,
    });
  }

  if (props.fields.zipCodeCAValidations) {
    if (props.fields.zipCodeCAValidations) {
      const zipCodeCAValidations = getStringValidatonSchema({
        fields: { validations: props.fields.zipCodeCAValidations },
      });
      validationSchema = validationSchema.when(props.fields.countryFieldName.value, {
        is: (value: string) => ['Canada'].includes(value),
        then: (innerValidator) => innerValidator.concat(zipCodeCAValidations),
        otherwise: (innerValidator) => innerValidator,
      });
    }
  }

  if (props.fields.zipCodeOtherValidations) {
    if (props.fields.zipCodeOtherValidations) {
      const zipCodeOtherValidations = getStringValidatonSchema({
        fields: { validations: props.fields.zipCodeOtherValidations },
      });
      validationSchema = validationSchema.when(props.fields.countryFieldName.value, {
        is: (value: string) => ['Other'].includes(value),
        then: (innerValidator) => innerValidator.concat(zipCodeOtherValidations),
        otherwise: (innerValidator) => innerValidator,
      });
    }
  }
  return validationSchema;
}

export async function getFormItemDetail(props: AddressProps): Promise<FormItemDetail | undefined> {
  if (props.fields == undefined) {
    return undefined;
  }

  const subfields: CompositeSubfieldDetail[] = [];
  if (props.fields.address1FieldName && !isNullOrWhitespace(props.fields.address1FieldName.value)) {
    let validationSchema = getStringValidatonSchema({
      fields: { validations: props.fields.address1Validations },
    });
    validationSchema = validationSchema.trim();

    let initialValue: ProvidedValues = null;
    initialValue = getValueProviderValue({
      fields: { valueProviders: props.fields.address1ValueProviders },
    });
    initialValue ??= props.fields.address1DefaultValue.value;

    const address1 = {
      id: props.fields.address1FieldId.value,
      name: props.fields.address1FieldName.value,
      validationSchema,
      initialValue,
    };
    subfields.push(address1);
  }

  if (props.fields.address2FieldName && !isNullOrWhitespace(props.fields.address2FieldName.value)) {
    let validationSchema = getStringValidatonSchema({
      fields: { validations: props.fields.address2Validations },
    });
    validationSchema = validationSchema.trim();

    let initialValue: ProvidedValues = null;
    initialValue = getValueProviderValue({
      fields: { valueProviders: props.fields.address2ValueProviders },
    });
    initialValue ??= props.fields.address2DefaultValue.value;

    const address2 = {
      id: props.fields.address2FieldId.value,
      name: props.fields.address2FieldName.value,
      validationSchema,
      initialValue,
    };
    subfields.push(address2);
  }

  if (props.fields.cityFieldName && !isNullOrWhitespace(props.fields.cityFieldName.value)) {
    let validationSchema = getStringValidatonSchema({
      fields: { validations: props.fields.cityValidations },
    });
    validationSchema = validationSchema.trim();

    let initialValue: ProvidedValues = null;
    initialValue = getValueProviderValue({
      fields: { valueProviders: props.fields.cityValueProviders },
    });
    initialValue ??= props.fields.cityDefaultValue.value;

    const city = {
      id: props.fields.cityFieldId.value,
      name: props.fields.cityFieldName.value,
      validationSchema,
      initialValue,
    };
    subfields.push(city);
  }

  if (props.fields.stateFieldName && !isNullOrWhitespace(props.fields.stateFieldName.value)) {
    let validationSchema = string();
    if (isNullOrWhitespace(props.fields.countryFieldName.value)) {
      validationSchema = getStringValidatonSchema({
        fields: { validations: props.fields.stateValidations },
      });
    } else {
      const stateValidation = getStringValidatonSchema({
        fields: { validations: props.fields.stateValidations },
      });
      validationSchema = validationSchema.when(props.fields.countryFieldName.value, {
        is: (value: string) => !['Other'].includes(value),
        then: (innerValidator) => innerValidator.concat(stateValidation),
        otherwise: (innerValidator) => innerValidator,
      });
    }

    const initialValue = getStateInitialValue(props as Required<AddressProps>);

    const state = {
      id: props.fields.stateFieldId.value,
      name: props.fields.stateFieldName.value,
      validationSchema,
      initialValue,
    };
    subfields.push(state);
  }

  if (props.fields.zipCodeFieldName && !isNullOrWhitespace(props.fields.zipCodeFieldName.value)) {
    const validationSchema = getZipCodeValidationSchema(props as Required<AddressProps>);

    let initialValue: ProvidedValues = null;
    initialValue = getValueProviderValue({
      fields: { valueProviders: props.fields.zipCodeValueProviders },
    });
    initialValue ??= props.fields.zipCodeDefaultValue.value;

    const zipCode = {
      id: props.fields.zipCodeFieldId.value,
      name: props.fields.zipCodeFieldName.value,
      validationSchema,
      initialValue,
    };
    subfields.push(zipCode);
  }

  if (props.fields.countryFieldName && !isNullOrWhitespace(props.fields.countryFieldName.value)) {
    const validationSchema = getStringValidatonSchema({
      fields: { validations: props.fields.countryValidations },
    });
    const initialValue = getCountryInitialValue(props as Required<AddressProps>);

    const country = {
      id: props.fields.countryFieldId.value,
      name: props.fields.countryFieldName.value,
      validationSchema,
      initialValue,
    };
    subfields.push(country);
  }

  return compositeFieldDetail({
    id: props.rendering.uid!,
    prefix: props.fields.fieldPrefix.value,
    templateName: 'AddressField',
    subfields,
  });
}
