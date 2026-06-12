// Lib
import { ThemeFile } from 'lib/context/ThemeContext';

export const ProductPreviewCardTheme: ThemeFile = {
  aw: {
    classes: {
      /**  Theme classes  **/
      productPreviewCradWrapper: 'flex flex-col items-start border border-gray h-full relative',
      eyebrow: 'text-dark-gray uppercase text-xxs font-heavy order-1',
      headlineWrapper: 'order-2 font-heavy font-sans text-xs',
      headline: 'text-xs font-heavy hover:underline ',
      ratingsAndPriceWrapper: 'flex items-center order-3',
      ratingsIconsList: 'flex mr-xxs',
      ratingsText: 'pr-xxs text-xs',
      priceLevelWrapper: 'border-l border-secondary px-xxs leading-none flex',
      priceTextClasses: 'font-sans text-gray text-xs',
      priceLevelClasses: 'text-black font-heavy',
      body: 'px-s my-s order-3 text-dark-gray',
      headerWrapper: 'flex flex-col items-start px-s pb-s pt-m gap-2 order-1 w-full',
      awColorsandCTA: 'order-3 mb-s mt-auto flex w-full flex-wrap justify-between lg:items-end',
      colorSwatchesWrapper: 'pl-s mt-s order-2 items-center w-full',
      colorLabel: 'text-small',
      swatches: 'mt-xxxs flex',
      actions: 'order-5 mt-auto px-xxs md:px-s [&_a]:mr-0 max-md:[&_a]:px-xxs w-full',
      buttonWrapper: 'col-span-12 mb-m flex flex-col items-center space-y-4 md:justify-center',
      buttonGroupClass: {
        cta1Classes: '',
        cta2Classes: '',
      },
      colorSwatches:
        'h-[30px] w-[30px] rounded-full mr-[14px] **:h-[30px] **:w-[30px] [&_img]:rounded-full',
      favoriteProduct:
        'favorite-product absolute right-0 top-0 inline h-0 w-0 cursor-pointer border-t-0 border-l-0 border-r-60 border-b-60 border-solid border-[transparent_#e3e3e3_transparent_transparent] transition-[border-color]  duration-500 ease-[ease]',
      favoriteIcon: 'absolute -right-[51px] top-[11px]',
    },
  },
  rba: {},
};
