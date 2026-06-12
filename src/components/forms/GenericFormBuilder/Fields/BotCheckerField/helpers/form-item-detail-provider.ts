import {
  botCheckerFieldDetail,
  FormItemDetail,
} from 'lib/generic-form-builder/utils/load-utils/form-item-detail';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';

import { Sitecore } from '.sitecore/AndersenWindows.model';

export async function getFormItemDetail(
  props: Sitecore.Forms.GenericFormBuilder.Fields.BotChecker.BotCheckerField
): Promise<FormItemDetail | undefined> {
  if (props.fields == undefined || isNullOrWhitespace(props.fields.fieldName.value)) {
    return undefined;
  }
  return botCheckerFieldDetail({ name: props.fields.fieldName.value });
}
