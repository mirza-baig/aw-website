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

function FormatPhoneNumber(phoneNumber: string) {
  if (phoneNumber.length === 10) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
  } else {
    return phoneNumber;
  }
}

function getInitialValue(
  props: Required<Sitecore.Forms.GenericFormBuilder.Fields.Phone.PhoneField>
): ProvidedValues {
  const initialValue = getValueProviderValue(props);
  if (initialValue && /^\d{10}$/.test(initialValue.toString())) {
    return FormatPhoneNumber(initialValue.toString());
  }

  return FormatPhoneNumber(props.fields.defaultValue.value);
}

function getValidationSchema(
  props: Required<Sitecore.Forms.GenericFormBuilder.Fields.Phone.PhoneField>
): Schema | undefined {
  const schema = getStringValidatonSchema(
    props as Required<Sitecore.FieldSets.Forms.ValidationSettings>
  );

  return schema.trim();
}

export async function getFormItemDetail(
  props: Sitecore.Forms.GenericFormBuilder.Fields.Phone.PhoneField
): Promise<FormItemDetail | undefined> {
  if (props.fields == undefined || isNullOrWhitespace(props.fields.fieldName.value)) {
    return undefined;
  }
  return standardFieldDetail({
    name: props.fields.fieldName.value,
    id: props.rendering.uid!,
    templateName: 'PhoneField',
    initialValue: getInitialValue(
      props as Required<Sitecore.Forms.GenericFormBuilder.Fields.Phone.PhoneField>
    ),
    hideOnLoad: false,
    validationSchema: getValidationSchema(
      props as Required<Sitecore.Forms.GenericFormBuilder.Fields.Phone.PhoneField>
    ),
  });
}
