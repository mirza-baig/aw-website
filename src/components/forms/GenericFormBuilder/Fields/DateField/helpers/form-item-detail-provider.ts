import {
  FormItemDetail,
  standardFieldDetail,
} from 'lib/generic-form-builder/utils/load-utils/form-item-detail';
import { getStringValidatonSchema } from 'lib/generic-form-builder/utils/validation-utils/get-validation-schema';
import { ProvidedValues } from 'lib/generic-form-builder/value-providers';
import { getEnum } from 'lib/utils/get-enum';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';
import { Schema } from 'yup';

import { Sitecore } from '.sitecore/AndersenWindows.model';

export function getInitialValue(
  props:
    | Required<Sitecore.Forms.GenericFormBuilder.Fields.Date.DateField>
    | Sitecore.Forms.GenericFormBuilder.Fields.Date.DateField
): ProvidedValues {
  if (props.fields == undefined) {
    return null;
  }

  const defaultDate = getEnum(props.fields.defaultValue);
  let selectedDate = null;

  if (defaultDate === 'today') {
    selectedDate = new Date().toISOString().split('T')[0];
  } else if (defaultDate === 'custom') {
    const customDateValue = props.fields.defaultValueCustom.value ?? '';
    const date = new Date(customDateValue);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    selectedDate = `${year}-${month}-${day}`;
  }

  return selectedDate ?? '';
}

function getValidationSchema(
  props: Required<Sitecore.Forms.GenericFormBuilder.Fields.Date.DateField>
): Schema {
  const schema = getStringValidatonSchema(
    props as Required<Sitecore.FieldSets.Forms.ValidationSettings>
  );

  return schema;
}

export async function getFormItemDetail(
  props: Sitecore.Forms.GenericFormBuilder.Fields.Date.DateField
): Promise<FormItemDetail | undefined> {
  if (props.fields == undefined || isNullOrWhitespace(props.fields.fieldName.value)) {
    return undefined;
  }
  return standardFieldDetail({
    name: props.fields.fieldName.value,
    id: props.rendering.uid!,
    templateName: 'DateField',
    initialValue: getInitialValue(
      props as Required<Sitecore.Forms.GenericFormBuilder.Fields.Date.DateField>
    ),
    hideOnLoad: false,
    validationSchema: getValidationSchema(
      props as Required<Sitecore.Forms.GenericFormBuilder.Fields.Date.DateField>
    ),
  });
}
