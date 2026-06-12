import { getValueProviderValue } from 'lib/generic-form-builder/utils/initial-value-utils/get-value-provider-value';
import {
  FormItemDetail,
  standardFieldDetail,
} from 'lib/generic-form-builder/utils/load-utils/form-item-detail';
import { getStringValidatonSchemaWithMinMax } from 'lib/generic-form-builder/utils/validation-utils/get-validation-schema-with-min-max';
import { ProvidedValues } from 'lib/generic-form-builder/value-providers';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';
import { Schema } from 'yup';

import { Sitecore } from '.sitecore/AndersenWindows.model';

function getInitialValue(
  props: Required<Sitecore.Forms.GenericFormBuilder.Fields.ShortText.ShortTextField>
): ProvidedValues {
  const initialValue = getValueProviderValue(props);
  if (initialValue) {
    return initialValue;
  }

  return props.fields.defaultValue.value;
}

function getValidationSchema(
  props: Required<Sitecore.Forms.GenericFormBuilder.Fields.ShortText.ShortTextField>
): Schema | undefined {
  const schema = getStringValidatonSchemaWithMinMax(
    props as Required<
      Sitecore.FieldSets.Forms.ValidationSettings & Sitecore.FieldSets.Forms.MinMaxLengthSettings
    >
  );

  return schema.trim();
}

export async function getFormItemDetail(
  props: Sitecore.Forms.GenericFormBuilder.Fields.ShortText.ShortTextField
): Promise<FormItemDetail | undefined> {
  if (props.fields == undefined || isNullOrWhitespace(props.fields.fieldName.value)) {
    return undefined;
  }
  return standardFieldDetail({
    name: props.fields.fieldName.value,
    id: props.rendering.uid!,
    templateName: 'ShortTextField',
    initialValue: getInitialValue(
      props as Required<Sitecore.Forms.GenericFormBuilder.Fields.ShortText.ShortTextField>
    ),
    hideOnLoad: false,
    validationSchema: getValidationSchema(
      props as Required<Sitecore.Forms.GenericFormBuilder.Fields.ShortText.ShortTextField>
    ),
  });
}
