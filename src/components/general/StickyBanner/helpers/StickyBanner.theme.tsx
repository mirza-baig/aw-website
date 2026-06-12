// Lib
import { ThemeFile } from 'lib/context/ThemeContext';

export const StickyBannerTheme: ThemeFile = {
  aw: {
    classes: {
      headline: 'text-white text-sm-m ml:text-m  font-heavy',
      bannerWrapper:
        'grid-rows-auto grid grid-cols-2 place-items-center px-m ml:px-l lg:px-m ml:mx-auto ml:max-w-screen-lg min-h-[75px]  ml:grid-cols-12 ml:place-items-start my-s',
      bodyClass: 'text-white text-body font-regular mt-xxs',
      buttonGroupClass: {
        wrapper: 'flex-col items-center font-heavy mb-0 gap-y-6 ml:gap-0',
        cta1Classes: 'mr-0 ',
        cta2Classes: 'ml:ml-0 text-white',
      },
      iconWrapper: 'absolute top-3 right-3 text-white',
      textWrapper: 'col-span-2 text-center ml:col-span-7 ml:text-left mb-m ml:mb-0 self-center',
    },
  },
  rba: {
    classes: {
      headline: 'text-s text-white font-medium',
      bannerWrapper:
        'grid-rows-auto grid grid-cols-2 px-m ml:px-l lg:px-m ml:mx-auto ml:max-w-screen-lg ml:grid-cols-12 place-items-start min-h-[48px] my-s ml:my-xs',
      bodyClass: 'text-white text-body font-regular mt-xxs ml:mt-0',
      buttonGroupClass: {
        wrapper: 'flex-col ml:items-center font-bold  gap-y-6 gap-x-6 ml:space-x-0 mb-xxs ml:mb-0',
        cta1Classes: 'mr-0 px-s',
        cta2Classes: ' m-0 text-white',
      },
      iconWrapper: 'absolute top-3 right-3 text-white',
      textWrapper: 'col-span-2 ml:col-span-7 mb-s ml:mb-0 self-center ',
    },
  },
};
