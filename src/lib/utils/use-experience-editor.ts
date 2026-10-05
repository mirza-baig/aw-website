'use client';

import { useSitecore } from '@sitecore-content-sdk/nextjs';

/**
 * Determines whether the current Sitecore page is rendered in Experience Editor mode.
 *
 * @returns `true` when Sitecore's `pageEditing` flag is enabled; otherwise, `false`.
 */
const useExperienceEditor = (): boolean => {
  const { page: currentPage } = useSitecore();
  if (!currentPage?.layout.sitecore.context) {
    return false;
  }
  return currentPage?.layout.sitecore.context.pageEditing ?? false;
};

export default useExperienceEditor;
