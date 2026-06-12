import { XupDynamicResultItem } from 'components/listing/XupCardCollectionDynamic/helpers/XupCardCollectionDynamic.Template.helper';
import { LayoutType } from 'lib/coveo/utils';
import { EnumField, getEnum } from 'lib/utils/get-enum';

import { Sitecore } from '.sitecore/AndersenWindows.model';

export const getFieldsToInclude = (
  resultEntities:
    | Sitecore.Elements.Search.ListResultItem[]
    | Sitecore.Elements.Search.ResultColumn[]
    | Sitecore.Elements.Search.GridResultItem[],
  layoutType: LayoutType
): string[] => {
  const fields: string[] = [];

  switch (layoutType) {
    case 'list':
    case 'grid':
      resultEntities.forEach((item) => {
        for (const searchField in item.fields) {
          const field = getEnum<string>(item.fields[searchField] as EnumField<string>);
          if (field && !fields?.includes(field)) {
            fields.push(field);
          }
        }
      });
      break;
    case 'table':
      resultEntities.forEach((item) => {
        const field = getEnum<string>(
          (item as Sitecore.Elements.Search.ResultColumn).fields?.field
        );
        if (field) {
          fields.push(field);
        }
      });
      break;
    default:
      break;
  }

  return fields;
};

export const getResultItemIndex = (
  resultEntities:
    | Sitecore.Elements.Search.ListResultItem[]
    | Sitecore.Elements.Search.GridResultItem[]
    | XupDynamicResultItem[],
  fieldToMatch: string
): number => {
  if (!resultEntities) {
    return 0;
  }

  for (const [index, resultItem] of resultEntities.entries()) {
    const templateIdsToMatch: string[] = [];

    if (resultItem.fields?.resultType) {
      for (const pageType of resultItem.fields.resultType) {
        const pageTypeIds = getEnum<string>(pageType);
        if (pageTypeIds) {
          templateIdsToMatch.push(...pageTypeIds.split('|'));
        }
      }
    }

    if (templateIdsToMatch.includes(fieldToMatch)) {
      return index;
    }
  }

  return 0;
};
