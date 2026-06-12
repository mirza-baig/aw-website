import { useSitecore } from '@sitecore-content-sdk/nextjs';

/**
 * "Normal" mode means we are not in "edit" or "preview" mode.
 * @returns Whether we are rendering in "normal" mode.
 */
const useNormalMode = (): boolean => {
  const { page: currentPage } = useSitecore();
  // This should only happen when we're running outside of Sitecore, e.g. Storybook and unit tests.
  if (!currentPage?.layout.sitecore.context.pageState) {
    return true;
  }
  return currentPage?.layout.sitecore.context.pageState === 'normal';
};

export default useNormalMode;
