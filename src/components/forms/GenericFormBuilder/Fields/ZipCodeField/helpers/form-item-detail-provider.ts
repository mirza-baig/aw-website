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

function getInitialValue(
  props: Required<Sitecore.Forms.GenericFormBuilder.Fields.ZipCode.ZipCodeField>
): ProvidedValues {
  const initialValue = getValueProviderValue(props);
  if (initialValue) {
    return initialValue;
  }

  return props.fields.defaultValue.value;
}

function getValidationSchema(
  props: Required<Sitecore.Forms.GenericFormBuilder.Fields.ZipCode.ZipCodeField>
): Schema | undefined {
  const schema = getStringValidatonSchema(
    props as Required<Sitecore.FieldSets.Forms.ValidationSettings>
  );

  return schema.trim();
}

export async function getFormItemDetail(
  props: Sitecore.Forms.GenericFormBuilder.Fields.ZipCode.ZipCodeField
): Promise<FormItemDetail | undefined> {
  if (props.fields == undefined || isNullOrWhitespace(props.fields.fieldName.value)) {
    return undefined;
  }
  return standardFieldDetail({
    name: props.fields.fieldName.value,
    id: props.rendering.uid!,
    templateName: 'ZipCodeField',
    initialValue: getInitialValue(
      props as Required<Sitecore.Forms.GenericFormBuilder.Fields.ZipCode.ZipCodeField>
    ),
    hideOnLoad: false,
    validationSchema: getValidationSchema(
      props as Required<Sitecore.Forms.GenericFormBuilder.Fields.ZipCode.ZipCodeField>
    ),
  });
}
