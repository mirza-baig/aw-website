// Lib
import { ThemeFile, ThemeName } from 'lib/context/ThemeContext';

type HeaderLogoThemeType = {
  [key in ThemeName]: HeaderLogoThemeSubType;
};

export type HeaderLogoThemeSubType = {
  classes: {
    logoLink: string;
    imageWrapper: string;
  };
};

export const HeaderLogoTheme = (): ThemeFile | HeaderLogoThemeType => {
  return {
    aw: {
      classes: {
        logoLink: `hidden md:inline-block logo cursor-pointer absolute pt-[32px] pl-[40px] top-0 print:hidden z-100`,
        imageWrapper: `w-full h-full`,
      },
    },
    rba: {
      classes: {},
    },
  };
};
