import { Item } from '@sitecore-content-sdk/nextjs';
import { getEnum } from 'lib/utils/get-enum';
import { PartialFields } from 'lib/utils/type-utils/partial-fields';

import { Sitecore } from '.sitecore/AndersenWindows.model';

export function isRuleIncludedInField(
  props: PartialFields<Sitecore.FieldSets.Forms.ValidationSettings>,
  validationRuleToMatch: string
): boolean {
  return (
    props.fields?.validations?.some((validationItem: Item) => {
      const validation = validationItem as unknown as Sitecore.FieldSets.Forms.FieldValidation;
      const validationType = getEnum(validation.fields?.validationType);
      return validationType === validationRuleToMatch;
    }) ?? false
  );
}
