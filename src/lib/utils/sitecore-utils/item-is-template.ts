import { guidEquals } from 'lib/utils/string-utils/guid-equals';

import { Sitecore } from '.sitecore/AndersenWindows.model';

/**
 * Checks whether a Sitecore item uses the specified template.
 *
 * @typeParam T The item type returned by the type guard when the check succeeds.
 * @param item The Sitecore item to check.
 * @param templateId The template identifier to compare.
 * @returns True when the item exists and its template ID matches; otherwise, false.
 */
export function itemIsTemplate<T extends Sitecore.BaseTemplates.BaseItem>(
  item: Sitecore.BaseTemplates.BaseItem | undefined,
  templateId: string
): item is T {
  return !!item && guidEquals(item?.fields?._AW_TemplateId.value, templateId);
}
