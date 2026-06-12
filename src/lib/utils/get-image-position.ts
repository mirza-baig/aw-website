import { Item } from '@sitecore-content-sdk/nextjs';

import { getEnum } from './get-enum';

type ImagePositions = 'left' | 'right';

export const getImagePosition = (defaultPos: string, imagePos?: Item): string => {
  const imagePosition = getEnum<ImagePositions>(imagePos) ?? defaultPos;
  return imagePosition;
};
