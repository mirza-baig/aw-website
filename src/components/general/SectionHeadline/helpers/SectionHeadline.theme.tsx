import classNames from 'classnames';
import { ThemeFile, ThemeName } from 'lib/context/ThemeContext';

import { BorderStyle, TextAlignment } from './SectionHeadline.types';

const awHeadlineClasses = 'text-s md:text-m font-heavy pb-xs mb-s';

const rbaHeadlineClasses = 'text-m md:text-l font-extra-light pb-xs mb-s';

const getBorderClasses = (theme: ThemeName, borderStyle: BorderStyle) => {
  if (borderStyle !== 'default') {
    let borderClasses = theme === 'aw' ? 'border-b-6 ' : 'border-b-3 ';

    switch (borderStyle) {
      case 'dark':
        borderClasses += theme === 'aw' ? 'border-primary' : 'border-secondary';
        break;
      case 'light':
        borderClasses += theme === 'aw' ? 'border-light-gray' : 'border-gray';
        break;
      default:
        break;
    }

    return borderClasses;
  }
  return '';
};

const getDynamicStyles = (
  theme: ThemeName,
  alignment: TextAlignment,
  borderStyle: BorderStyle
): string => {
  return classNames(`text-${alignment}`, getBorderClasses(theme, borderStyle));
};

export const SectionHeadlineTheme = (
  alignment: TextAlignment,
  borderStyle: BorderStyle
): ThemeFile => {
  return {
    aw: {
      classes: {
        headlineContainer: classNames(
          awHeadlineClasses,
          getDynamicStyles('aw', alignment, borderStyle)
        ),
      },
    },
    rba: {
      classes: {
        headlineContainer: classNames(
          rbaHeadlineClasses,
          getDynamicStyles('rba', alignment, borderStyle)
        ),
      },
    },
  };
};
