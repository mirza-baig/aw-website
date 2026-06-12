import { Field } from '@sitecore-content-sdk/nextjs';
import { OptionItem } from 'lib/generic-form-builder/utils/get-option-items';
import { getValueProviderValue } from 'lib/generic-form-builder/utils/initial-value-utils/get-value-provider-value';
import {
  FormItemDetail,
  standardFieldDetail,
} from 'lib/generic-form-builder/utils/load-utils/form-item-detail';
import { getStringValidatonSchema } from 'lib/generic-form-builder/utils/validation-utils/get-validation-schema';
import { ProvidedValues } from 'lib/generic-form-builder/value-providers';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';
import { Schema } from 'yup';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type DropdownProps = Sitecore.Forms.GenericFormBuilder.Fields.Dropdown.DropdownField & {
  options: OptionItem[];
};

function getInitialValue(props: Required<DropdownProps>): ProvidedValues {
  const initialValue = getValueProviderValue(props);
  // @ts-ignore Once type generation is fixed, then type is inferred correctly
  if (initialValue && props.options.some((option) => option.value === initialValue)) {
    return initialValue;
  }

  if (props.fields.defaultValue) {
    const valueName = props.fields.valueFieldName.value ?? 'value';
    const valueField = props.fields.defaultValue.fields[valueName] as Field<string>;
    return valueField.value;
  }
  if (props.fields.showDefaultDisplay.value) {
    return '';
  }
  return props.options.length > 0 ? props.options[0].value : null;
}

function getValidationSchema(props: Required<DropdownProps>): Schema {
  const schema = getStringValidatonSchema(
    props as Required<Sitecore.FieldSets.Forms.ValidationSettings>
  );

  return schema;
}

export async function getFormItemDetail(props: DropdownProps): Promise<FormItemDetail | undefined> {
  if (props.fields == undefined || isNullOrWhitespace(props.fields.fieldName.value)) {
    return undefined;
  }
  return standardFieldDetail({
    name: props.fields.fieldName.value,
    id: props.rendering.uid!,
    templateName: 'DropdownField',
    initialValue: getInitialValue(props as Required<DropdownProps>),
    hideOnLoad: false,
    validationSchema: getValidationSchema(props as Required<DropdownProps>),
  });
}
