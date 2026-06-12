// Lib
import { ThemeFile, ThemeName } from 'lib/context/ThemeContext';

type PreviewImageThemeType = {
  [key in ThemeName]: PreviewImageThemeSubType;
};

export type PreviewImageThemeSubType = {
  classes: {
    loaderWrapper: string;
    loader: string;
  };
};

export const PreviewImageThemes = (): ThemeFile | PreviewImageThemeType => {
  return {
    aw: {
      classes: {
        loaderWrapper: ` min-h-[150px] lg:min-h-[500px] `,
        loader: ` absolute top-0 left-0 w-full h-full flex items-center justify-center `,
      },
    },
    rba: {
      classes: {},
    },
  };
};
