import { useWebsiteContext } from 'lib/website/WebsiteContext';

export const useFeatureToggles = () => {
  const websiteState = useWebsiteContext();
  return websiteState.featureToggles;
};
