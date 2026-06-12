import {
  FormItemDetail,
  standardFieldDetail,
} from 'lib/generic-form-builder/utils/load-utils/form-item-detail';
import { getBooleanValidatonSchema } from 'lib/generic-form-builder/utils/validation-utils/get-validation-schema';
import { ProvidedValues } from 'lib/generic-form-builder/value-providers';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';
import { Schema } from 'yup';

import { Sitecore } from '.sitecore/AndersenWindows.model';

function getInitialValue(): ProvidedValues {
  return false;
}

function getValidationSchema(
  props: Required<Sitecore.Forms.GenericFormBuilder.Fields.ConsentCheckbox.ConsentCheckboxField>
): Schema {
  const schema = getBooleanValidatonSchema(
    props as Required<Sitecore.FieldSets.Forms.ValidationSettings>
  );

  return schema;
}

export async function getFormItemDetail(
  props: Sitecore.Forms.GenericFormBuilder.Fields.ConsentCheckbox.ConsentCheckboxField
): Promise<FormItemDetail | undefined> {
  if (props.fields == undefined || isNullOrWhitespace(props.fields.fieldName.value)) {
    return undefined;
  }
  return standardFieldDetail({
    name: props.fields.fieldName.value,
    id: props.rendering.uid!,
    templateName: 'ConsentCheckboxField',
    initialValue: getInitialValue(),
    hideOnLoad: props.fields.hideFieldOnLoad.value,
    validationSchema: getValidationSchema(
      props as Required<Sitecore.Forms.GenericFormBuilder.Fields.ConsentCheckbox.ConsentCheckboxField>
    ),
  });
}
