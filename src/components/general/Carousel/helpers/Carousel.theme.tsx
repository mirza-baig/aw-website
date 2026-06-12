// Lib
import { ThemeFile } from 'lib/context/ThemeContext';

export const CarouselTheme: ThemeFile = {
  aw: {
    classes: {
      headlineClass: ' text-theme-text text-sm-m md:text-m font-heavy mb-xxs ',
      subHeadlineClass: 'text-theme-text text-sm-s md:text-s font-medium mb-s ',
      buttonClass: {
        wrapper: 'justify-center mt-m',
        cta1Classes: 'font-heavy text-secondary',
      },
      slideCaption: '',
    },
  },
  rba: {
    classes: {
      headlineClass: 'text-theme-text text-sm-m md:text-l font-medium mb-xxs',
      subHeadlineClass: ' text-theme-text text-sm-s md:text-s font-extra-light mb-s',
      buttonClass: {
        wrapper: 'justify-center mt-m',
        cta1Classes: 'font-bold',
      },
      slideCaption: '',
    },
  },
};
