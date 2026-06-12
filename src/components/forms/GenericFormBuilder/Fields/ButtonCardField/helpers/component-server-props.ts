import { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { getButtonCardItems } from 'components/forms/GenericFormBuilder/Fields/ButtonCardField/helpers/button-card-utils';

import { Sitecore } from '.sitecore/AndersenWindows.model';

export async function getComponentServerProps(rendering: ComponentRendering) {
  const props = rendering as ComponentRendering<
    Sitecore.Forms.GenericFormBuilder.Fields.ButtonCard.ButtonCardField['fields']
  >;
  if (props.fields?.datasource?.id == undefined) {
    return { options: [] };
  }

  const parentId = props.fields.datasource.id;

  const options = await getButtonCardItems(parentId);

  return { options };
}
