import { ThemeFile } from 'lib/context/ThemeContext';

export const SocialImageCarouselTheme: ThemeFile = {
  aw: {
    classes: {
      wrapperInline: 'flex flex-col md:flex-row col-span-2 md:col-span-6 items-center theme-white',
      wrapperStack: 'col-span-12',
      headlineClass: 'p-3 max-w-[315px] md:min-w-[350px]',
      headlineTextInline: '',
      headlineTextStack: 'font-sans font-heavy text-m mb-3 ml-10',
      bodyCopyClassInline: ' text-body text-dark-gray',
      bodyCopyClassStack: ' text-body text-dark-gray',
      carouselInline:
        'w-[375px] md:w-[275px] mmd:w-[403px] ml:w-[611px] mml:w-[627px] lg:w-[845px]',
      carouselStack: 'w-full',
    },
    defaultProductFilter: 'ES-CAS',
    defaultSiteName: 'andersenwindows-6o5qt0',
  },
  rba: undefined,
};
