import { ComponentRendering, PlaceholdersData } from '@sitecore-content-sdk/nextjs';

export function getAllRenderings(placeholders: PlaceholdersData | undefined): ComponentRendering[] {
  if (!placeholders) {
    return [];
  }

  const result: ComponentRendering[] = [];

  for (const items of Object.values(placeholders)) {
    for (const item of items) {
      if ('componentName' in item) {
        result.push(item);
        if (item.placeholders) {
          result.push(...getAllRenderings(item.placeholders));
        }
      }
    }
  }

  return result;
}
