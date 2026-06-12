// Lib
import { ThemeFile } from 'lib/context/ThemeContext';

export const FavoriteProductsTheme: ThemeFile = {
  aw: {
    classes: {
      mainheadline: 'font-sans font-medium md:font-heavy text-black text-s md:text-m',
      productPreviewCradWrapper: 'flex flex-col items-start border border-gray h-full relative',
      eyebrow: 'text-dark-gray uppercase font-sans text-xxs font-heavy order-1',
      headlineWrapper: 'order-2 font-heavy font-sans text-xs',
      headline: 'text-xs font-heavy hover:underline',
      ratingsAndPriceWrapper: 'flex items-center order-3',
      ratingsIconsList: 'flex mr-xxs',
      ratingsText: 'pr-xxs text-xs font-sans',
      priceLevelWrapper: 'border-l border-secondary px-xxs ',
      priceText: 'font-sans leading-none flex [&>*:nth-child(2)]:text-gray',
      priceLevel: 'text-xs font-heavy font-sans',
      body: 'px-s my-s order-3 text-dark-gray',
      headerWrapper: 'flex flex-col items-start px-s pb-s pt-m gap-2 order-1',
      awColorsandCTA:
        'flex max-lg:flex-wrap  lg:mb-s lg:items-end justify-between w-full mt-auto max-lg:mb-s order-3',
      colorSwatchesWrapper: 'px-xs max-lg:mb-s',
      colorLabel: 'text-small',
      swatches: 'mt-xxxs flex',
      actions: 'px-xxs md:px-s order-5 max-md:[&_a]:px-xxs [&_a]:mr-0 max-md:mt-auto',
      buttonGroupClass: {
        wrapper: 'mb-0',
        cta1Classes: 'mb-0',
      },
      colorSwatches:
        'h-[30px] w-[30px] rounded-full mr-[14px] **:h-[30px] **:max-h-[30px] **:w-[30px] [&_img]:rounded-full',
      favoriteProduct:
        'favorite-product-item absolute right-0 top-0 inline h-0 w-0 cursor-pointer border-t-0 border-l-0 border-r-60 border-b-60 border-solid border-[transparent_#e3e3e3_transparent_transparent] transition-[border-color]  duration-500 ease-[ease]',
      favoriteIcon: 'absolute -right-[51px] top-[11px]',
      noResultsHeadline: 'open-sans text-m font-medium',
      cardHeadline: 'open-sans text-s font-heavy',
      cardSubheadline: 'open-sans text-xs font-medium',
    },
  },
  rba: {
    classes: {
      /** Insert Theme classes here **/
    },
  },
};
