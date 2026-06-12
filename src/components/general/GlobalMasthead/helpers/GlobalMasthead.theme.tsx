// Lib
import { ThemeFile } from 'lib/context/ThemeContext';

export const GlobalMastheadTheme: ThemeFile = {
  aw: {
    classes: {
      headline: 'text-sm-m ml:text-m  font-heavy',
      headWrapper:
        'w-full flex flex-col ml:items-center ml:justify-center ml:py-4 ml:px-5 py-[1.3rem] px-6 pt-16 ',
      headLogoWrapper: 'flex items-center justify-start ml:justify-center',
      headLogo: 'flex items-center',
      mastheadWrapper:
        'theme-black sticky top-[55px] left-0 right-0 z-15 col-span-12 flex place-items-center justify-center ml:top-[122px] w-full',
      menuIcon: 'ml:hidden mr-0 md:mr-5',
      anchorWrapper:
        'mt-4 flex flex-col ml:flex-row items-start ml:items-center justify-between w-full transition ease-in-out delay-150',
      socialIconsWrapper: 'mt-4 ml:mt-0',
      iconWrapper: 'flex items-center space-x-2',
      socialIcon: '',
      anchors:
        'lg:space-x-[80px] ml:space-x-[50px] space-y-[12px] ml:space-y-0 flex flex-col ml:flex-row font-semibold',
      linkTitle: 'text-[18px] font-sans font-bold text-white',
    },
  },
  rba: {},
};
