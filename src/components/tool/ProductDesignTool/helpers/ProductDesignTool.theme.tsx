// Lib
import { ThemeFile, ThemeName } from 'lib/context/ThemeContext';

type ProductDesignToolThemeType = {
  [key in ThemeName]: DesignThemeSubType;
};

export type DesignThemeSubType = {
  classes: {
    wrapper: string;
    headerNavWrapper: string;
    stepWrapper: string;
    imageWrapper: string;
  };
};

export const ProductDesignToolTheme = (
  navigationVisible: boolean
): ThemeFile | ProductDesignToolThemeType => {
  return {
    aw: {
      classes: {
        wrapper: `designtool2 h-full print:overflow-x-auto`,
        headerNavWrapper: `header absolute ${
          navigationVisible ? 'top-[110px]' : 'top-0'
        } right-0 pt-[32px] pr-[40px] print:hidden z-100`,
        stepWrapper: `col-span-12 font-futura-pt`,
        imageWrapper: 'main-background object-fit-wrapper visible white',
      },
    },
    rba: {
      classes: {},
    },
  };
};
