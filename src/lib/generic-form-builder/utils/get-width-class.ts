import { getEnum } from 'lib/utils/get-enum';

import { Sitecore } from '.sitecore/AndersenWindows.model';

enum FieldWidth {
  fullWidth = '12',
  halfWidth = '6',
  thirdWidth = '4',
  quarterWidth = '3',
  sixthWidth = '2',
  twelthWidth = '1',
}
const widthClasses: Record<FieldWidth, string> = {
  [FieldWidth.halfWidth]: 'col-span-12 md:col-span-6',
  [FieldWidth.thirdWidth]: 'col-span-12 md:col-span-4',
  [FieldWidth.quarterWidth]: 'col-span-12 md:col-span-3',
  [FieldWidth.sixthWidth]: 'col-span-12 md:col-span-2',
  [FieldWidth.twelthWidth]: 'col-span-12 md:col-span-1',
  [FieldWidth.fullWidth]: 'col-span-12',
};

export function getWidthClass(props?: Sitecore.FieldSets.Forms.FieldWidth) {
  const widthSet = getEnum<FieldWidth>(props?.fields?.width) ?? FieldWidth.fullWidth;

  return widthClasses[widthSet] ?? widthClasses[FieldWidth.fullWidth];
}
