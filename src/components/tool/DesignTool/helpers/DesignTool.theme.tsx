// Lib
import { ThemeFile, ThemeName } from 'lib/context/ThemeContext';

type DesignToolThemeType = {
  [key in ThemeName]: DesignToolThemeSubType;
};

export type DesignToolThemeSubType = {
  classes: {
    wrapper: string;
    headerNavWrapper: string;
    stepWrapper: string;
    imageWrapper: string;
  };
};

export const DesignToolTheme = (navigationVisible: boolean): ThemeFile | DesignToolThemeType => {
  return {
    aw: {
      classes: {
        wrapper: `designtool2 h-full print:overflow-x-auto ${navigationVisible ? '' : 'pt-[45px] md:pt-[70px]'}`,
        headerNavWrapper: `header absolute ${
          navigationVisible ? 'top-[110px]' : 'top-0'
        } right-0 pt-[32px] pr-[40px] print:hidden z-100`,
        stepWrapper: `w-full font-futura-pt`,
        imageWrapper: 'main-background object-fit-wrapper visible white',
      },
    },
    rba: {
      classes: {},
    },
  };
};
