// Lib
import { ThemeFile } from 'lib/context/ThemeContext';

export const PromoMediaBackgroundTheme: ThemeFile = {
  aw: {
    classes: {
      /** Theme classes **/
      mediaContainer: 'relative max-md:mb-[15.75px]',
      overlay: 'absolute z-1 w-full h-full bg-[rgba(0,0,0,0.5)] left-0 top-0',
      iconWrapper: 'mr-s mb-s md:mr-l md:mb-l',
      contentWrapper: 'max-md:px-m md:absolute w-full h-full z-1 flex items-center md:top-0',
      contentContainer: ' md:ml-[8%] flex flex-col basis-full mx-auto',
      eyebrow: 'my-xxxs md:max-w-[585px] text-sm-xs md:text-xs font-medium uppercase font-sans',
      headline: 'my-xxxs md:max-w-[585px] text-sm-l leading-[2.35rem] lg:text-m font-heavy',
      bodyClass: 'my-xxxs  leading-[22px] font-regular md:max-w-[585px] md:text-xs md:font-medium',
      buttonGroupClass: {
        wrapper: 'my-s md:my-xs',
        cta1Classes: 'text-black',
      },
    },
  },
  rba: {
    classes: {
      /** Theme classes **/
      mediaContainer: 'relative max-md:mb-m',
      overlay: 'absolute z-1 w-full h-full bg-[rgba(0,0,0,0.5)] left-0 top-0',
      iconWrapper: 'mr-s mb-s md:mr-ml md:mb-ml',
      contentWrapper:
        'col-span-12 max-md:px-m md:absolute w-full h-full z-1 flex items-center md:top-0',
      contentContainer: 'col-span-12 md:ml-[8%] flex flex-col basis-full mx-auto',
      eyebrow:
        'md:my-xxxs md:max-w-[490px] font-semi-bold uppercase font-serif leading-[14px] text-sm',
      headline: 'mt-[5px] text-sm-s md:my-xxxs md:text-l md:max-w-[490px] font-medium',
      bodyClass:
        'mt-[5px] md:my-xxxs md:max-w-[490px] text-[0.850rem] leading-[1.35rem] text-dark-gray md:text-lg md:leading-6',
      buttonGroupClass: {
        wrapper: 'my-s md:my-xs',
        cta1Classes: 'md:bg-white md:text-black',
      },
    },
  },
};
