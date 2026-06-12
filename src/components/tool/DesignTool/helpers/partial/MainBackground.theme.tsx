// Lib
import { ThemeFile, ThemeName } from 'lib/context/ThemeContext';

import { DesignToolStep } from '../DesignTool.types';

type MainBackgroundThemeType = {
  [key in ThemeName]: MainBackgroundThemeSubType;
};

export type MainBackgroundThemeSubType = {
  classes: {
    wrapper: string;
    image: string;
    overlay: string;
  };
};

const GetOverlayClass = (step: DesignToolStep) => {
  switch (step) {
    case DesignToolStep.Start:
      return 'opacity-0';
    case DesignToolStep.Select:
      return 'opacity-75';
    case DesignToolStep.Design:
      return 'opacity-95';
    default:
      return step;
  }
};

export const MainBackgroundTheme = (step: DesignToolStep): ThemeFile | MainBackgroundThemeType => {
  return {
    aw: {
      classes: {
        wrapper: `w-full h-full opacity-100 fixed top-0 z-[-1] hidden md:block`,
        image: `w-full h-full object-cover object-center`,
        overlay: `w-full h-full bg-white absolute top-0 ${GetOverlayClass(step)}`,
      },
    },
    rba: {
      classes: {},
    },
  };
};
