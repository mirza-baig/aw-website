// Lib
import { ThemeFile } from 'lib/context/ThemeContext';

export const ContentBlockWithSidebarTheme: ThemeFile = {
  aw: {
    classes: {
      /** Insert Theme classes here **/
      leftColumnClass: 'grid-cols-12 col-span-9',
      rightColumnClass:
        'sm-px-0 border-t col-span-9 border-gray md:col-span-3 md:p-3 md:border-l md:border-t-0',
      headlineClass: 'text-theme-text text-sm-m md:text-m font-semibold mb-s leading-6}',
      bodyClass: 'text-theme-body text-body md:pr-3 lg:pr-[120px] mb-s',
      subBodyClass: 'text-small',
      subheadlineClass:
        'text-theme-text font-sans text-sm-s md:text-s mt-s md:mt-0 mb-xxs font-semibold',
    },
  },
  rba: {
    classes: {
      /** Insert Theme classes here **/
      leftColumnClass: 'grid-cols-12 col-span-9',
      rightColumnClass:
        'sm-px-0 border-t col-span-9 border-gray md:col-span-3 md:p-3 md:border-l md:border-t-0',
      headline: 'text-theme-text text-sm-m md:text-m font-bold mb-s',
      bodyClass: 'text-theme-body text-body md:pr-3 lg:pr-[120px] mb-s',
      subBodyClass: 'text-theme-body text-body mb-s',
      subheadlineClass:
        'text-theme-text font-sans text-sm-s md:text-s mt-s md:mt-0 mb-xxs font-bold',
    },
  },
};
