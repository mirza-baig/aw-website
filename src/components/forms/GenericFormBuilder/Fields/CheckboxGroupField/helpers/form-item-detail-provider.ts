import { Field } from '@sitecore-content-sdk/nextjs';
import { getValueProviderValue } from 'lib/generic-form-builder/utils/initial-value-utils/get-value-provider-value';
import {
  FormItemDetail,
  standardFieldDetail,
} from 'lib/generic-form-builder/utils/load-utils/form-item-detail';
import { getArrayValidatonSchema } from 'lib/generic-form-builder/utils/validation-utils/get-validation-schema';
import { ProvidedValues } from 'lib/generic-form-builder/value-providers';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';
import { Schema } from 'yup';

import { Sitecore } from '.sitecore/AndersenWindows.model';

function getInitialValue(
  props: Required<Sitecore.Forms.GenericFormBuilder.Fields.CheckboxGroup.CheckboxGroupField>
): ProvidedValues {
  const initialValue = getValueProviderValue(props);
  if (initialValue) {
    if (Array.isArray(initialValue)) {
      return initialValue;
    } else {
      return [initialValue];
    }
  }

  if (props.fields.defaultValue) {
    const valueName = props.fields.valueFieldName.value ?? 'value';
    const values: string[] = [];
    // @ts-ignore Once type generation is fixed, then type is inferred correctly
    props.fields.defaultValue.forEach((item) => {
      const valueField = item.fields[valueName] as Field<string>;
      if (valueField) {
        values.push(valueField.value);
      }
    });
    return values;
  }

  return [];
}

function getValidationSchema(
  props: Required<Sitecore.Forms.GenericFormBuilder.Fields.CheckboxGroup.CheckboxGroupField>
): Schema {
  const schema = getArrayValidatonSchema(
    props as Required<Sitecore.FieldSets.Forms.ValidationSettings>
  );

  return schema;
}

export async function getFormItemDetail(
  props: Sitecore.Forms.GenericFormBuilder.Fields.CheckboxGroup.CheckboxGroupField
): Promise<FormItemDetail | undefined> {
  if (props.fields == undefined || isNullOrWhitespace(props.fields.fieldName.value)) {
    return undefined;
  }
  return standardFieldDetail({
    name: props.fields.fieldName.value,
    id: props.rendering.uid!,
    templateName: 'CheckboxGroupField',
    initialValue: getInitialValue(
      props as Required<Sitecore.Forms.GenericFormBuilder.Fields.CheckboxGroup.CheckboxGroupField>
    ),
    hideOnLoad: false,
    validationSchema: getValidationSchema(
      props as Required<Sitecore.Forms.GenericFormBuilder.Fields.CheckboxGroup.CheckboxGroupField>
    ),
  });
}
