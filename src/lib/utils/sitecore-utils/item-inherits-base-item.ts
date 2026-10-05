import { Item } from '@sitecore-content-sdk/nextjs';

import { Sitecore } from '.sitecore/AndersenWindows.model';

/**
 * Determines whether an item inherits from BaseItem (has a `_AW_TemplateId` field).
 *
 * @typeParam T The item type returned by the type guard when the check succeeds.
 * @param item The Sitecore item to inspect.
 * @returns True when the item has an own `_AW_TemplateId` field; otherwise, false.
 */
export function itemInheritsBaseItem<T extends Sitecore.BaseTemplates.BaseItem>(
  item: Item | undefined
): item is T & Item {
  if (item?.fields === undefined) {
    return false;
  }

  return Object.hasOwn(item.fields, '_AW_TemplateId');
}
