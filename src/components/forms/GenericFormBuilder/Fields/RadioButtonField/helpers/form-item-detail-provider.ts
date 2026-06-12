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
  props: Required<Sitecore.Forms.GenericFormBuilder.Fields.RadioButton.RadioButtonField>
): ProvidedValues {
  const initialValue = getValueProviderValue(props);
  if (initialValue) {
    return initialValue;
  }

  if (props.fields.defaultValue != null) {
    const item = props.fields
      .defaultValue as unknown as Sitecore.Forms.GenericFormBuilder.Datasources.ListItem;
    return item.fields?.title?.value ?? '';
  }

  return '';
}

function getValidationSchema(
  props: Required<Sitecore.Forms.GenericFormBuilder.Fields.RadioButton.RadioButtonField>
): Schema | undefined {
  const schema = getStringValidatonSchema(
    props as Required<Sitecore.FieldSets.Forms.ValidationSettings>
  );

  return schema.trim();
}

export async function getFormItemDetail(
  props: Sitecore.Forms.GenericFormBuilder.Fields.RadioButton.RadioButtonField
): Promise<FormItemDetail | undefined> {
  if (props.fields == undefined || isNullOrWhitespace(props.fields.fieldName.value)) {
    return undefined;
  }
  return standardFieldDetail({
    name: props.fields.fieldName.value,
    id: props.rendering.uid!,
    templateName: 'RadioButtonField',
    initialValue: getInitialValue(
      props as Required<Sitecore.Forms.GenericFormBuilder.Fields.RadioButton.RadioButtonField>
    ),
    hideOnLoad: false,
    validationSchema: getValidationSchema(
      props as Required<Sitecore.Forms.GenericFormBuilder.Fields.RadioButton.RadioButtonField>
    ),
  });
}
