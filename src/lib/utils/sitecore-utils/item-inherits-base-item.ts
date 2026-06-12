import { Item } from '@sitecore-content-sdk/nextjs';

import { Sitecore } from '.sitecore/AndersenWindows.model';

export const itemInheritsBaseItem = <T extends Sitecore.BaseTemplates.BaseItem>(
  item: Item | undefined
): item is T & Item => {
  if (item?.fields === undefined) {
    return false;
  }

  return Object.hasOwn(item.fields, '_AW_TemplateId');
};
