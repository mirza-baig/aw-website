// Lib
import { ThemeFile } from 'lib/context/ThemeContext';

export const ProductCarouselTheme: ThemeFile = {
  aw: {
    classes: {
      /** Insert Theme classes here **/
      columnClass: 'grid-cols-12 col-span-12 relative mt-4 product-carousel',
      leftColumnClass: 'grid-cols-12 col-span-9',
      rightColumnClass:
        'sm-px-0 border-t col-span-9 border-gray md:col-span-3 md:p-3 md:border-l md:border-t-0',
      headline: 'text-theme-text text-sm-m md:text-m font-bold mb-s',
      bodyClass: 'text-theme-body text-body md:pr-3 lg:pr-[120px] mb-s',
      subBodyClass: 'text-theme-body text-body mb-s',
      subheadlineClass:
        'text-theme-text font-sans text-sm-s md:text-s mt-s md:mt-0 mb-xxs font-bold',
      exploreButtonClass: 'w-full flex justify-center mt-8',
      arrowPrevWrapperClass: 'absolute bottom-[50%] left-0 md:left-[calc(50%-195px)] z-10',
      arrowNextWrapperClass: 'absolute bottom-[50%] right-0 md:right-[calc(50%-195px)] z-10',
      arrowPrevButtonClass: 'flex justify-between items-center pl-0',
      arrowNextButtonClass: 'flex justify-between items-center pr-4.5 md:pr-0',
      arrowButtonClass:
        'button w-11 h-11 flex items-center justify-center rounded-full border-2 border-[#C4BFB6] bg-white cursor-pointer text-[#001722] transition hover:bg-[#001722] hover:text-white hover:border-[#001722]',
    },
  },
  rba: {},
};
