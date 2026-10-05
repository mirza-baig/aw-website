import { Item } from '@sitecore-content-sdk/nextjs';

import { getEnum } from './get-enum';

type ImagePositions = 'left' | 'right';

/**
 * Returns the configured image position or the default position.
 *
 * @param defaultPos The position to use when no configured value exists.
 * @param imagePos The optional Sitecore item containing the image position.
 * @returns The configured image position, or `defaultPos` when unavailable.
 */
export function getImagePosition(defaultPos: string, imagePos?: Item): string {
  const imagePosition = getEnum<ImagePositions>(imagePos) ?? defaultPos;
  return imagePosition;
}
