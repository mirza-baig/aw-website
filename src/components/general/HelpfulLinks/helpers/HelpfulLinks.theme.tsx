import { ThemeFile } from 'lib/context/ThemeContext';
export const HelpfulLinksTheme: ThemeFile = {
  aw: {
    classes: {
      container: 'col-span-12 pt-l pb-s md:pb-ml -mx-m px-m ml:px-xxl bg-light-gray',
      headlineClass: 'text-theme-text pb-s text-sm-m md:text-m font-heavy md:text-center',
      linkWrapperClasses:
        'hover:underline hover:decoration-primary hover:underline-offset-8 disabled:border-gray disabled:text-gray',
      wrapper: 'flex flex-col md:flex-row md:flex-wrap md:gap-m md:justify-center',
      linkClasses: 'text-black text-text-link font-sans font-heavy',
    },
  },
  rba: {},
};
