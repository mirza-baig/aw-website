import { ThemeFile } from 'lib/context/ThemeContext';

export const ListHighlightAndCtaTheme = (): ThemeFile => {
  return {
    aw: {
      classes: {
        headlineBorder: 'col-span-12 border-t border-black md:col-span-3',
        headlineClass: 'text-sm-xs lg:text-xs font-bold mr-1 uppercase',
        listItemContainer: 'col-span-12 border-black md:col-span-6',
        listItemHeadlineBorder: 'gap-s border-t border-gray', // p-3
        contentClasses: {
          listItemHeadlineClass:
            'text-sm-s md:text-s py-2 font-bold content-center flex flex-1 items-center justify-start mt-2',
          body: 'text-body text-dark-gray font-regular mb-m flex flex-col',
        },
        buttonClass: {
          wrapper: 'flex flex-col md:flex-row items-start',
          cta1Classes: 'mr-3 ml-0',
        },
        buttonGroupClass: {
          wrapper: 'flex-col',
          cta1Classes: 'mr-0 mb-m md:mb-0',
          cta2Classes: '',
        },
        buttonGroupClassRightIcon: {
          wrapper: 'flex-col mb-0',
          cta1Classes: 'mr-0 ',
          cta2Classes: 'ml-xs md:ml-0 px-s md:px-0',
        },
      },
    },
    rba: {},
  };
};
