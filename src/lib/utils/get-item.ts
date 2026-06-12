import { Item } from '@sitecore-content-sdk/nextjs';

import { getEnum } from './get-enum';

export const getItem = (item?: Item): Item => {
  const noitem = {} as unknown as Item;

  return getEnum<Item>(item) || noitem;
};
