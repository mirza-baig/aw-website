import { Item } from '@sitecore-content-sdk/nextjs';

import { getEnum } from './get-enum';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5';

/**
 * Returns the configured heading level or the default heading.
 *
 * @param defHeading The heading level to use when no configured level exists.
 * @param level The optional item containing the configured heading level.
 * @returns The configured heading level, or `defHeading` as a fallback.
 */
export function getHeadingLevel(defHeading: string, level?: Item): string {
  const headingLevel = getEnum<HeadingLevel>(level) ?? defHeading;
  return headingLevel;
}
