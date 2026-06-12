// Lib
import { ThemeFile } from 'lib/context/ThemeContext';

export const SwatchCollectionTheme = (): ThemeFile => {
  return {
    aw: {
      classes: {
        swatchTitle: 'text-theme-text text-sm-xs ml:text-xs font-medium mt-m ml:mt-l  mb-xs',
        swatchDescription: 'font-regular text-dark-gray text-body mb-m',
        swatchLabel: 'mx-auto font-serif! text-dark-gray text-small text-center font-regular ',
        swatchFooterCopy: 'font-regular text-theme-body text-small text-dark-gray mt-m',
      },
    },
    rba: {
      classes: {},
    },
  };
};
