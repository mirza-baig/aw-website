import { ThemeName } from 'lib/context/ThemeContext';

export const getSearchBoxTheme = (themeName: ThemeName) => {
  switch (themeName) {
    case 'aw':
      return {
        searchBoxWrapper: 'bg-primary py-s px-m mx-[calc(50%-50vw)]',
        searchBoxContainer: 'relative bg-white rounded-[80px] max-w-(--breakpoint-lg) mx-auto',
        searchBoxContainerFocused: 'rounded-3xl',
        inputWrapper: 'px-m py-xs flex items-center z-2',
        inputWrapperFocused: '',
        searchIconWrapper: 'cursor-pointer z-2 w-[36px] h-[16px]',
        closeIconWrapper: 'text-primary cursor-pointer z-2',
        searchBoxInput:
          'outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 border-0 outline-none w-full font-sans text-sm-xs md:text-s font-regular z-2 placeholder-shown:text-dark-gray',
        suggestionsList:
          'absolute bg-white left-4 top-0 w-full px-l pt-[55px] rounded-3xl shadow-[0_4px_14px_3px_rgba(0,0,0,0.1)] pb-m font-sans text-small text-dark-gray z-1',
        suggestionItem:
          'px-s cursor-pointer relative before:content-[""] before:-z-10 before:hidden hover:before:block before:absolute before:w-[calc(100%+80px)] before:h-full before:top-0 before:left-[-40px] before:bg-light-gray',
      };
    case 'rba':
      return {
        searchBoxWrapper: 'bg-secondary pt-s pb-l px-m -mt-s mx-[calc(50%-50vw)]',
        searchBoxContainer: 'relative bg-white rounded-[100px] max-w-(--breakpoint-lg) mx-auto',
        searchBoxContainerFocused: 'rounded-3xl ',
        inputWrapper: 'px-m py-xs flex items-center',
        inputWrapperFocused: 'rounded-3xl border border-gray',
        searchIconWrapper: 'cursor-pointer z-2 w-[36px]',
        closeIconWrapper: 'text-secondary cursor-pointer z-2',
        searchBoxInput:
          'outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 border-0 outline-none w-full font-sans text-sm-xs md:text-s z-2 placeholder-shown:font-extra-light font-medium',
        suggestionsList:
          'absolute bg-white left-4 top-0 w-full px-l pt-[60px] border border-gray rounded-3xl shadow-[0_4px_14px_3px_rgba(0,0,0,0.1)] pb-m text-dark-gray z-1',
        suggestionItem:
          'px-s cursor-pointer relative before:content-[""] before:-z-10 before:hidden hover:before:block before:absolute before:w-[calc(100%+80px)] before:h-full before:top-0 before:left-[-40px] before:bg-light-gray',
      };
  }
};
