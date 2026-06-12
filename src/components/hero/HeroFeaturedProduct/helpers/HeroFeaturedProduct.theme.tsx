// Lib
import { ThemeFile } from 'lib/context/ThemeContext';

export const HeroFeaturedProductTheme: ThemeFile = {
  aw: {
    classes: {
      productWrapper: 'relative bg-light-gray text-center pt-xs md:pt-l',
      headingsWrapper: 'font-bold',
      smallHeadline: 'text-m text-dark-gray',
      largeHeadline: 'text-sm-xxl md:text-xxl -mb-s',
      imageWrapper: '-mb-s ml:-mb-xl h-full',
      subheadingsList:
        'flex flex-col justify-center text-center mt-s md:flex-row md:mt-l font-sans!',
      subheadingItem:
        'relative px-m py-s first:before:hidden before:absolute before:content-[""] before:w-full before:h-px before:bg-secondary before:top-0 before:left-0 md:before:w-px md:px-l md:before:h-full md:mt-s',
      rteClasses: 'font-heavy md:text-s [&_a]:font-sans',
      additionalDesktopClasses: 'relative h-[310px] md:h-[592px] md:max-w-[592px] mx-auto',
      additionalMobileClasses: 'relative h-auto md:h-[592px] md:max-w-[592px] mx-auto',
    },
  },
  rba: {},
};
