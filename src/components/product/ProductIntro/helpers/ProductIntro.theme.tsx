// Lib
import { ThemeFile } from 'lib/context/ThemeContext';

export const ProductIntroTheme: ThemeFile = {
  aw: {
    classes: {
      imageColClasses: 'col-span-6 ml:col-span-5',
      descriptionColClasses: 'md:col-start-7 col-span-6 relative',
      eyebrow: 'font-sans text-sm-xxs md:text-sm-s text-dark-gray font-regular mb-xxxs uppercase',
      headlineWrapper: 'text-sm-s md:text-s font-heavy font-sans mb-xxs',
      headline: 'text-sm-s md:text-s font-heavy font-sans mb-xxs',
      bodyClass: 'text-dark-gray',
      claimClass: 'mb-[10px] text-primary font-sans text-sm-xs font-bold',
      disclaimerClass: ' mb-s text-dark-gray font-sans text-m! font-regular',
      buttonGroupClass: {
        wrapper: 'flex-col md:items-center',
        cta1Classes: '',
        cta2Classes: 'my-s md:my-0',
      },
      ratingsAndPriceWrapper: 'flex items-center mb-s',
      ratingsIconsList: 'flex mr-m',
      ratingsText: 'mr-m',
      ratingsWrapper: 'flex items-center',
      priceLevelWrapper: 'border-l border-secondary p-xxs',
      priceTextClasses: 'text-gray font-sans text-xxs font-medium',
      priceLevelClasses: 'text-black font-heavy',
      favoriteProductWrapper: 'absolute top-0 right-0 md:hidden',
      favoriteProduct:
        'favorite-product absolute right-0 top-0 inline h-0 w-0 cursor-pointer border-t-0 border-l-0 border-r-52 border-b-52 border-solid border-[transparent_#e3e3e3_transparent_transparent] transition-[border-color]  duration-500 ease-[ease]',
      favoriteIcon: 'absolute -right-[46px] top-[7px]',
      swatchHeadline: 'font-sans! font-heavy text-sm-xxs md:text-base mb-s uppercase',
      swatchTitle: 'mt-xxs text-center font-regular text-base font-serif',
    },
  },
  rba: {},
};
