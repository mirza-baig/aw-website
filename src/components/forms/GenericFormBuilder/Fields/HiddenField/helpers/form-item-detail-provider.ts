import { getValueProviderValue } from 'lib/generic-form-builder/utils/initial-value-utils/get-value-provider-value';
import {
  FormItemDetail,
  standardFieldDetail,
} from 'lib/generic-form-builder/utils/load-utils/form-item-detail';
import { ProvidedValues } from 'lib/generic-form-builder/value-providers';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';

import { Sitecore } from '.sitecore/AndersenWindows.model';

function getInitialValue(
  props: Required<Sitecore.Forms.GenericFormBuilder.Fields.Hidden.HiddenField>
): ProvidedValues {
  const initialValue = getValueProviderValue(props);
  if (initialValue) {
    return initialValue;
  }

  return props.fields.defaultValue.value;
}

export async function getFormItemDetail(
  props: Sitecore.Forms.GenericFormBuilder.Fields.Hidden.HiddenField
): Promise<FormItemDetail | undefined> {
  if (props.fields == undefined || isNullOrWhitespace(props.fields.fieldName.value)) {
    return undefined;
  }
  return standardFieldDetail({
    name: props.fields.fieldName.value,
    id: props.rendering.uid!,
    templateName: 'HiddenField',
    initialValue: getInitialValue(
      props as Required<Sitecore.Forms.GenericFormBuilder.Fields.Hidden.HiddenField>
    ),
    hideOnLoad: false,
  });
}
