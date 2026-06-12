import { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { getOptionItems } from 'lib/generic-form-builder/utils/get-option-items';

import { Sitecore } from '.sitecore/AndersenWindows.model';

export async function getComponentServerProps(rendering: ComponentRendering): Promise<unknown> {
  const props = rendering as ComponentRendering<
    Sitecore.Forms.GenericFormBuilder.Fields.TileButton.TileButtonField['fields']
  >;
  if (props.fields?.datasource?.id == undefined) {
    return { options: [] };
  }

  const parentId = props.fields.datasource.id;

  const options = await getOptionItems(parentId, 'title', 'value');

  return { options };
}
