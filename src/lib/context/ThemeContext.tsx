import { ThemeFile, ThemeName } from 'lib/website/theme';
import { useWebsiteContext } from 'lib/website/WebsiteContext';

export const useTheme = (themeFile?: ThemeFile) => {
  const websiteState = useWebsiteContext();
  const themeName = websiteState.theme;
  const themeData = themeFile ? themeFile[themeName] : undefined;
  return { themeName, themeData };
};

export type { ThemeFile, ThemeName };
