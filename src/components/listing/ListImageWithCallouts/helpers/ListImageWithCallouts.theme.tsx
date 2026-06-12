import { ThemeFile } from 'lib/context/ThemeContext';

export const ListImageWithCalloutsTheme: ThemeFile = {
  aw: {
    classes: {
      listWrapper: 'pt-xl pb-xl',
      headline:
        'text-theme-text text-center md:text-left text-sm-m md:text-m font-bold mb-s md:mb-m',
      callOutItemClasses: {
        calloutContainer: 'mt-s md:mt-0 pt-s px-xs md:px-0 border-t border-theme-text',
        calloutItemHeadline: 'text-theme-text text-xs font-bold mb-xxs',
        calloutBody: 'text-theme-body text-body',
      },
      imageContainer: 'top-0',
    },
  },
  rba: {},
};
