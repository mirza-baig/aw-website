import classNames from 'classnames';
import { ThemeFile } from 'lib/context/ThemeContext';

export type ComponentAlignment = 'left' | 'center' | 'right';

const getDynamicStyles = (alignment: ComponentAlignment): string => {
  switch (alignment) {
    case 'center':
      return classNames('col-span-12 col-start-2 md:col-span-12 md:col-start-6');
    case 'right':
      return classNames('col-span-12 col-start-12 md:col-span-12 md:col-start-12');
    case 'left':
    default:
      return classNames('col-span-12');
  }
};

export const FreeStandingCtaTheme = (alignment: ComponentAlignment): ThemeFile => ({
  aw: {
    classes: {
      contentWrapper: getDynamicStyles(alignment),
      'col-start-12': { 'grid-column-start': 12 },
    },
  },
  rba: {
    classes: {},
  },
});
