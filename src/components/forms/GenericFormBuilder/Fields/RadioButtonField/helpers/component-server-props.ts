import { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { getOptionItems } from 'lib/generic-form-builder/utils/get-option-items';

import { Sitecore } from '.sitecore/AndersenWindows.model';

export async function getComponentServerProps(rendering: ComponentRendering) {
  const props = rendering as ComponentRendering<
    Sitecore.Forms.GenericFormBuilder.Fields.RadioButton.RadioButtonField['fields']
  >;
  if (props.fields?.datasource?.id == undefined) {
    return { options: [] };
  }

  const parentId = props.fields.datasource.id;
  const label = props.fields.displayFieldName.value ?? 'value';
  const value = props.fields.valueFieldName.value ?? 'value';

  const options = await getOptionItems(parentId, label, value);

  return { options };
}
