'use client';
import { ThemeFile } from 'lib/context/ThemeContext';

export const HeroTwoColumnTheme: ThemeFile = {
  aw: {
    classes: {
      headlineClass: 'text-sm-l lg:text-l font-heavy mb-s',
      subheadlineClass: 'text-sm-m lg:text-m font-medium mb-s',
      bodyClass: 'text-body text-dark-gray font-regular mb-s',
      buttonGroupClass: {
        wrapper: '', //'flex-col',
        cta1Classes: '', //'mr-2 mb-m md:mb-0',
        cta2Classes: '',
      },
    },
  },
  rba: {
    classes: {
      headlineClass: 'text-sm-m lg:text-l font-medium',
      subheadlineClass: 'text-sm-m lg:text-l font-extra-light',
      bodyClass: 'text-body text-dark-gray font-regular mb-xxs',
      buttonGroupClass: {
        wrapper: '', //'flex-col md:items-center',
        cta1Classes: '', //'mr-2',
        cta2Classes: '', //'my-s md:my-0',
      },
    },
  },
};
