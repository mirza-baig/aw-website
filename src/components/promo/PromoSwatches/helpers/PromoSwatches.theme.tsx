//Lib
import classNames from 'classnames';
import { LayoutStyles } from 'helpers/SwatchCollection/SwatchCollection';
import { ThemeFile } from 'lib/context/ThemeContext';

export const PromoSwatchesTheme = (layoutStyle: LayoutStyles): ThemeFile => {
  return {
    aw: {
      classes: {
        eyebrow: classNames(
          'font-sans text-xxs font-regular text-dark-gray uppercase mb-m',
          layoutStyle === 'side-by-side' ? 'ml:mb-s' : 'ml:mb-m'
        ),
        headline: 'text-theme-text text-sm-m ml:text-m font-medium ml:font-heavy mb-s',
        bodycopy: 'text-theme-body text-body mb-m ml:mb-l font-regular',
      },
    },
    rba: {
      classes: {},
    },
  };
};
