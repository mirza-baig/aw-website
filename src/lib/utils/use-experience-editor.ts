import { useSitecore } from '@sitecore-content-sdk/nextjs';

const useExperienceEditor = (): boolean => {
  const { page: currentPage } = useSitecore();
  if (!currentPage?.layout.sitecore.context) {
    return false;
  }
  return currentPage?.layout.sitecore.context.pageEditing ?? false;
};

export default useExperienceEditor;
