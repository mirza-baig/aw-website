import { ThemeName } from 'lib/context/ThemeContext';

export const getPagerTheme = (themeName: ThemeName) => {
  switch (themeName) {
    case 'aw':
      return {
        pagerWrapper: 'flex items-center justify-center md:justify-end font-sans mt-m md:mt-xs',
        navButton:
          'flex items-center justify-center border border-secondary rounded-full w-ml h-ml',
        disabledNavButton: 'cursor-not-allowed',
        nextButton: 'ml-xs',
        previousButton: 'mr-xs',
        pageNumber:
          'flex items-center justify-center w-m h-m hover:border hover:border-gray rounded-full mx-xxxs text-xxs',
        currentPage: 'bg-secondary text-white hover:border-secondary',
      };
    case 'rba':
      return {};
  }
};
