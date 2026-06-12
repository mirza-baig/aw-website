'use client';
import classNames from 'classnames';
import { ThemeFile, ThemeName } from 'lib/context/ThemeContext';

// BackgroundColor used in HeroSimple
export type BackgroundColor = 'black' | 'gray' | 'white';

const awHeadlineClasses =
  'text-theme-text text-sm-l md:text-l font-heavy mb-m mt-m md:mb-l md:mt-l';
const rbaHeadlineClasses =
  'relative text-theme-text text-m md:text-l font-medium mb-m mt-s pb-s md:mt-m md:mb-m';

const getBorderClasses = (theme: ThemeName, backgroundColorStyle: BackgroundColor) => {
  if (theme === 'aw') {
    return classNames(
      `${backgroundColorStyle === 'white' ? 'border-primary border-b-6 pb-xxs' : ''}`
    );
  } else {
    return classNames(
      'after:absolute after:content-[""] after:bottom-0 after:w-l md:after:w-[85px] after:h-[3px] after:bg-primary'
    );
  }
};

export const HeroSimpleTheme = (backgroundColor: BackgroundColor): ThemeFile => {
  return {
    aw: {
      classes: {
        heroContainer: classNames(awHeadlineClasses, getBorderClasses('aw', backgroundColor)),
      },
    },
    rba: {
      classes: {
        heroContainer: classNames(rbaHeadlineClasses, getBorderClasses('rba', backgroundColor)),
      },
    },
  };
};
