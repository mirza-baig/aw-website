import { ThemeFile } from 'lib/context/ThemeContext';

export const PromoImageWithSliderTheme: ThemeFile = {
  aw: {
    classes: {
      sideBySide: {
        headline: 'text-theme-text text-sm-m md:text-m  font-heavy',
        promoContent: 'col-span-12 ml:col-span-3 order-last ml:order-first flex flex-col',
        promoImgSlider: 'col-span-12 ml:col-span-9 ',
      },
      fullWidth: {
        headline: 'text-theme-text text-sm-m md:text-m  font-heavy',
        promoContent: 'col-span-12 order-last',
        promoImgSlider: 'col-span-12',
      },
      expandButton: {
        wrapper: 'flex flex-row md:flex-row-reverse items-center gap-x-xxs  group',
        icon: 'flex h-m w-m items-center justify-center rounded-full border-2 border-primary hover:bg-primary',
        text: 'text-text-link font-sans font-regular group-hover:underline underline-offset-4',
      },
      caption: 'md:mb-0 ',
      imageLabels:
        'top-[30px] z-10 inline-block py-s text-center text-sm-xxs md:text-xs font-sans font-heavy text-black md:absolute md:w-[160px] md:bg-black md:text-white uppercase md:hidden',
      rangewrapper: 'flex items-center justify-center bg-light-gray px-m',
      bodyCopy:
        'col-span-12 md:col-span-10 text-theme-body text-body mb-s font-regular mt-xxs md:mt-s',
    },
  },
  rba: {
    classes: {
      sideBySide: {
        headline: 'text-theme-text text-sm-m md:text-m font-medium ',
        promoContent:
          'col-span-12 ml:col-span-4 order-last ml:order-first flex flex-col justify-between',
        promoImgSlider: 'col-span-12 ml:col-span-8',
      },
      fullWidth: {
        headline: 'text-theme-text text-sm-m md:text-l font-medium ',
        promoContent: 'col-span-12 order-last',
        promoImgSlider: 'col-span-12',
      },
      expandButton: {
        wrapper: 'flex flex-row items-center gap-x-xxs mb-xxs md:mb-0 ',
        icon: '',
        text: 'text-small font-heavy',
      },
      caption: '',
      bodyCopy: 'col-span-12 md:col-span-10 text-theme-body text-body mb-s font-regular',
      rangewrapper: 'flex items-center justify-center bg-light-gray px-xxs',
      imageLabels:
        'top-[30px] z-10 inline-block py-s text-center text-sm-xxs md:text-xs font-serif font-bold text-black md:absolute md:w-[160px] md:bg-black md:text-white uppercase md:hidden',
    },
  },
};
