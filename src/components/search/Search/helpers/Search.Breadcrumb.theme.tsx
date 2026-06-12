import { ThemeName } from 'lib/context/ThemeContext';

export const getBreadcrumbTheme = (themeName: ThemeName) => {
  switch (themeName) {
    case 'aw':
      return {
        wrapperClass: 'flex justify-between items-center font-sans mb-s',
        titleClass: 'font-heavy text-xxs',
        ctaClass: 'font-medium text-small disabled:cursor-not-allowed',
        breadcrumbPillsWrapper: '',
        breadcrumbPill: '',
      };
    case 'rba':
      return {
        wrapperClass: 'flex justify-between items-center font-serif',
        titleClass: 'font-serif! font-bold text-body',
        ctaClass: 'font-bold  ml:font-heavy text-button ml:text-small disabled:cursor-not-allowed ',
        breadcrumbPillsWrapper: 'flex flex-wrap items-center gap-x-xxs gap-y-s',
        breadcrumbPill:
          'flex items-center gap-xxs py-xxs px-s cursor-pointer ring-1 ring-gray ring-inset rounded-[100px] text-body font-bold bg-light-gray hover:ring-2 hover:ring-black',
      };
  }
};
