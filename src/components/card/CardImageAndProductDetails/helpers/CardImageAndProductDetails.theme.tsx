// Lib
import { ThemeFile } from 'lib/context/ThemeContext';

export const CardImageAndProductDetailsTheme: ThemeFile = {
  aw: {
    classes: {
      headline: 'p-2 text-s font-serif mb:leading-5',
      buttonGroupClass: 'text',
      groupDiv: 'p-2 overflow-y-auto',
      darkImageOverlay: 'absolute inset-0 bg-black/75 text-white flex flex-col justify-end',
      parentDiv: 'inline-block relative col-span-12 max-w-[512px]',
      link: 'leading-[10px] mb:leading-[22px] p-2 flex w-fit items-center whitespace-nowrap text-theme-text hover:underline hover:decoration-primary hover:underline-offset-8 disabled:border-gray disabled:text-gray',
      detailsButton:
        'font-sans space-between relative ml-7 flex w-full grow items-center font-medium text-sm-xs md:text-xs text-secondary hover:underline hover:decoration-black hover:underline-offset-8 uppercase',
      iconClass:
        'absolute -left-7 flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary hover:bg-primary hover:text-white',
    },
  },
  rba: {},
};
