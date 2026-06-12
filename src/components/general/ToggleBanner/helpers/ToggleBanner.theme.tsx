// Lib
import { ThemeFile } from 'lib/context/ThemeContext';

export const ToggleBannerTheme: ThemeFile = {
  aw: {
    classes: {
      /** Insert Theme classes here **/
      mainWrapper: 'col-span-12 flex flex-col flex-wrap ml:flex-row',
      headlineWrapper: 'flex-1 px-[15px] pt-m md:py-m lg:px-m lg:py-[24px]',
      buttonWrappers: 'flex flex-col p-4 md:flex-row ml:justify-end ml:self-center',
      buttonLeftClass:
        'peer-[:not(:hover)]:border-theme-btn-border-hover peer-[:not(:hover)]:bg-theme-btn-bg-hover peer-[:not(:hover)]:text-theme-btn-text-hover',
      buttonRightClass: 'peer text-center mt-4 ml-0 h-[44px] md:mt-0 md:-ml-[54px]',
      buttonHoverClass:
        'hover:border-theme-btn-border-hover hover:bg-theme-btn-bg-hover hover:text-theme-btn-text-hover',
    },
  },
  rba: {
    classes: {
      /** Insert Theme classes here **/
      mainWrapper: 'col-span-12 flex flex-col flex-wrap ml:flex-row',
      headlineWrapper: 'flex-1 px-[15px] pt-m md:py-m lg:px-m lg:py-[24px]',
      buttonWrappers: 'flex flex-col p-4 md:flex-row ml:justify-end ml:self-center',
      buttonLeftClass:
        'peer-[:not(:hover)]:bg-theme-btn-bg-hover peer-[:not(:hover)]:text-theme-btn-text-hover',
      buttonRightClass: 'peer text-center mt-4 ml-0 h-[44px] md:mt-0 md:-ml-[54px]',
      buttonHoverClass: 'hover:bg-theme-btn-bg-hover hover:text-theme-btn-text-hover',
    },
  },
};
