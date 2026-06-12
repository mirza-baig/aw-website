import { Field } from '@sitecore-content-sdk/nextjs';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';

import { Sitecore } from '.sitecore/AndersenWindows.model';

export function getFieldNameForAttribute(
  attribute: Sitecore.Forms.GenericFormBuilder.Attributes.FieldAttribute
): string | undefined {
  if (attribute.fields?.key == undefined) {
    return undefined;
  }

  let nameField: Field<string> | undefined;
  if (attribute.fields.subfield != undefined) {
    const item = attribute.fields['ef-value'];
    if (item == undefined) {
      return undefined;
    }

    const subfieldItem = attribute.fields.subfield as unknown as {
      fields?: { Value: { value: string } };
    };

    const subfieldName = subfieldItem.fields?.Value.value;
    if (isNullOrWhitespace(subfieldName)) {
      return undefined;
    }
    nameField = item.fields[subfieldName] as Field<string> | undefined;
  } else {
    const fieldItem = attribute.fields['ef-value'] as unknown as
      | Sitecore.FieldSets.Forms.FieldNameSettings
      | undefined;
    nameField = fieldItem?.fields?.fieldName;
  }

  const fieldName = nameField?.value;
  if (isNullOrWhitespace(fieldName)) {
    return undefined;
  }

  return fieldName;
}
