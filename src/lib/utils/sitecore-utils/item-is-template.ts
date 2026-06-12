import { guidEquals } from 'lib/utils/string-utils/guid-equals';

import { Sitecore } from '.sitecore/AndersenWindows.model';

export const itemIsTemplate = <T extends Sitecore.BaseTemplates.BaseItem>(
  item: Sitecore.BaseTemplates.BaseItem | undefined,
  templateId: string
): item is T => {
  return !!item && guidEquals(item?.fields?._AW_TemplateId.value, templateId);
};
