'use c;ient';
// Lib
import { ThemeFile } from 'lib/context/ThemeContext';

export const HeroMediaBackgroundTheme: ThemeFile = {
  aw: {
    classes: {
      /** Theme classes **/
      mediaContainer: 'relative max-md:mb-s',
      overlay: 'absolute z-0 w-full h-full bg-[rgba(0,0,0,0.5)] left-0 top-0 bg-clip-content',
      iconWrapper: 'mr-s mb-s md:mr-l md:mb-l',
      contentWrapper: 'max-md:px-m md:absolute w-full h-full z-1 flex items-center md:top-0',
      contentContainer:
        'max-w-(--breakpoint-xl) md:ml-[8%] 2xl:ml-auto flex flex-col basis-full mx-auto',
      eyebrow: 'my-xxxs md:max-w-[585px] texy-sm-xs md:text-xs font-medium uppercase font-sans',
      headline: 'my-xxxs md:max-w-[585px] text-sm-l md:text-l font-heavy',
      bodyClass: 'my-xxxs md:max-w-[585px] text-body',
      buttonGroupClass: {
        wrapper: 'my-s md:my-xs flex flex-col md:flex-row gap-4',
        cta1Classes: 'text-black',
      },
    },
  },
  rba: {
    classes: {
      /** Theme classes **/
      mediaContainer: 'relative max-md:mb-s',
      overlay: 'absolute z-1 w-full h-full bg-[rgba(0,0,0,0.5)] left-0 top-0',
      iconWrapper: 'mr-s mb-s md:mr-ml md:mb-ml',
      contentWrapper: 'max-md:px-m md:absolute w-full h-full z-1 flex items-center md:top-0',
      contentContainer:
        'max-w-(--breakpoint-xl) md:ml-[8%] 2xl:ml-auto flex flex-col basis-full mx-auto',
      eyebrow: 'my-xxxs text-link md:max-w-[490px] font-semi-bold uppercase',
      headline: 'my-xxxs text-sm-s md:text-xxl md:max-w-[490px] font-medium',
      bodyClass: 'my-xxxs md:max-w-[490px] text-large-body',
      buttonGroupClass: {
        wrapper: 'my-s md:my-xs',
        cta1Classes: 'md:bg-white md:text-black',
      },
    },
  },
};
