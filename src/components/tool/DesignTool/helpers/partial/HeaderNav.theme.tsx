// Lib
import { ThemeFile, ThemeName } from 'lib/context/ThemeContext';

type HeaderNavThemeType = {
  [key in ThemeName]: HeaderNavThemeSubType;
};

export type HeaderNavThemeSubType = {
  classes: {
    nav: string;
    navBack: string;
    navBackLink: string;
    navBackLinkIcon: string;
    navReset: string;
    navResetLink: string;
    navResetLinkIcon: string;
  };
};

export const HeaderNavTheme = (): ThemeFile | HeaderNavThemeType => {
  return {
    aw: {
      classes: {
        nav: `hidden md:flex m-0 pt-[16px] md:items-center md:list-none md:justify-center lg:pt-0`,
        navBack: `pr-[60px] w-[170px]`,
        navBackLink: `text-primary text-[18px] uppercase w-full flex justify-between hover:no-underline`,
        navBackLinkIcon: `font-light self-center flex flex-row`,
        navReset: `w-[125px]`,
        navResetLink: `text-primary text-[18px] uppercase w-full flex justify-between hover:no-underline`,
        navResetLinkIcon: `rotate-90 scale-x-[-1] font-light self-center flex flex-row`,
      },
    },
    rba: {
      classes: {},
    },
  };
};
