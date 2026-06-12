import { getValueProviderValue } from 'lib/generic-form-builder/utils/initial-value-utils/get-value-provider-value';
import {
  FormItemDetail,
  standardFieldDetail,
} from 'lib/generic-form-builder/utils/load-utils/form-item-detail';
import {
  getArrayValidatonSchema,
  getStringValidatonSchema,
} from 'lib/generic-form-builder/utils/validation-utils/get-validation-schema';
import { ProvidedValues } from 'lib/generic-form-builder/value-providers';
import { getEnum } from 'lib/utils/get-enum';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';
import { Schema } from 'yup';

import { SelectionTypes } from './types';
import { Sitecore } from '.sitecore/AndersenWindows.model';

function getInitialValue(
  props: Required<Sitecore.Forms.GenericFormBuilder.Fields.TileButton.TileButtonField>
): ProvidedValues {
  const isMultiSelectEnabled =
    getEnum<SelectionTypes>(props.fields.selection) === SelectionTypes.Multiple;

  const initialValue = getValueProviderValue(props);
  if (initialValue) {
    if (isMultiSelectEnabled && !Array.isArray(initialValue)) {
      return [initialValue];
    } else {
      return initialValue;
    }
  }

  return isMultiSelectEnabled ? [] : '';
}

function getValidationSchema(
  props: Required<Sitecore.Forms.GenericFormBuilder.Fields.TileButton.TileButtonField>
): Schema {
  const isMultiSelectEnabled =
    getEnum<SelectionTypes>(props.fields.selection) === SelectionTypes.Multiple;

  const schema = isMultiSelectEnabled
    ? getArrayValidatonSchema(props as Required<Sitecore.FieldSets.Forms.ValidationSettings>)
    : getStringValidatonSchema(props as Required<Sitecore.FieldSets.Forms.ValidationSettings>);

  return schema;
}

export async function getFormItemDetail(
  props: Sitecore.Forms.GenericFormBuilder.Fields.TileButton.TileButtonField
): Promise<FormItemDetail | undefined> {
  if (props.fields == undefined || isNullOrWhitespace(props.fields.fieldName.value)) {
    return undefined;
  }
  return standardFieldDetail({
    name: props.fields.fieldName.value,
    id: props.rendering.uid!,
    templateName: 'TileButtonField',
    initialValue: getInitialValue(
      props as Required<Sitecore.Forms.GenericFormBuilder.Fields.TileButton.TileButtonField>
    ),
    hideOnLoad: false,
    validationSchema: getValidationSchema(
      props as Required<Sitecore.Forms.GenericFormBuilder.Fields.TileButton.TileButtonField>
    ),
  });
}
