// Lib
import { ThemeFile } from 'lib/context/ThemeContext';

export const PricePreviewCardTheme: ThemeFile = {
  aw: {
    classes: {
      /**  Theme classes  **/
      productPreviewCradWrapper:
        'flex flex-col items-center text-center border border-gray-200 h-full relative bg-white',
      topWrapper: 'flex flex-col items-center w-full',
      imageWrapper: 'w-full mt-6 mb-6 flex justify-center',
      titleWrapper: 'mb-4',
      seriesName: 'text-black font-sans font-heavy text-xs leading-tight',
      productType: 'text-dark-gray uppercase text-xxs font-heavy tracking-wide mt-1 min-h-[1.25em]',
      bottomWrapper: 'w-full bg-light-gray -mx-4 p-4 pb-0 flex-grow flex flex-col items-center',
      priceSectionWrapper: 'mb-6 flex flex-col items-center gap-2 text-xxs text-black',
      priceLabel: '',
      priceRange: 'font-heavy',
      buttonWrapper:
        'col-span-12 mb-m mt-auto flex flex-col items-center space-y-4 md:justify-center',
      cta1Classes: '',
    },
  },
  rba: {},
};
