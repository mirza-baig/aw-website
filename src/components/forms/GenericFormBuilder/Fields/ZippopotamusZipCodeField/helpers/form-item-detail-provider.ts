import { getValueProviderValue } from 'lib/generic-form-builder/utils/initial-value-utils/get-value-provider-value';
import {
  compositeFieldDetail,
  CompositeSubfieldDetail,
  FormItemDetail,
} from 'lib/generic-form-builder/utils/load-utils/form-item-detail';
import { getStringValidatonSchema } from 'lib/generic-form-builder/utils/validation-utils/get-validation-schema';
import { ProvidedValues } from 'lib/generic-form-builder/value-providers';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';
import { Schema } from 'yup';

import { Sitecore } from '.sitecore/AndersenWindows.model';

function getInitialValue(
  props: Required<Sitecore.Forms.GenericFormBuilder.Fields.ZippopotamusZipCode.ZippopotamusZipCodeField>
): ProvidedValues {
  const initialValue = getValueProviderValue(props);
  if (initialValue) {
    return initialValue;
  }

  return props.fields.defaultValue.value;
}

function getValidationSchema(
  props: Required<Sitecore.Forms.GenericFormBuilder.Fields.ZippopotamusZipCode.ZippopotamusZipCodeField>
): Schema | undefined {
  const schema = getStringValidatonSchema(
    props as Required<Sitecore.FieldSets.Forms.ValidationSettings>
  );

  return schema;
}

export async function getFormItemDetail(
  props: Sitecore.Forms.GenericFormBuilder.Fields.ZippopotamusZipCode.ZippopotamusZipCodeField
): Promise<FormItemDetail | undefined> {
  if (props.fields == undefined || isNullOrWhitespace(props.fields.fieldName.value)) {
    return undefined;
  }

  const subfields: CompositeSubfieldDetail[] = [
    {
      id: props.rendering.uid!,
      name: props.fields.fieldName.value,
      initialValue: getInitialValue(
        props as Required<Sitecore.Forms.GenericFormBuilder.Fields.ZippopotamusZipCode.ZippopotamusZipCodeField>
      ),
      validationSchema: getValidationSchema(
        props as Required<Sitecore.Forms.GenericFormBuilder.Fields.ZippopotamusZipCode.ZippopotamusZipCodeField>
      ),
    },
  ];

  if (props.fields?.cityFieldName && !isNullOrWhitespace(props.fields.cityFieldName.value)) {
    const city = {
      id: props.fields.cityFieldId.value,
      name: props.fields.cityFieldName.value,
      initialValue: '',
    };
    subfields.push(city);
  }

  if (props.fields?.stateFieldName && !isNullOrWhitespace(props.fields.stateFieldName.value)) {
    const state = {
      id: props.fields.stateFieldId.value,
      name: props.fields.stateFieldName.value,
      initialValue: '',
    };
    subfields.push(state);
  }

  return compositeFieldDetail({
    id: props.rendering.uid!,
    templateName: 'ZippopotamusZipCodeField',
    subfields,
  });
}
