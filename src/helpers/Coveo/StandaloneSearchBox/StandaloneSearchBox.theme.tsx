// Lib
import { ThemeFile } from 'lib/context/ThemeContext';

export const StandaloneSearchBoxTheme: ThemeFile = {
  aw: {
    classes: {
      standaloneSearchBoxContainer: 'w-full ml:max-w-[996px] bg-white mx-auto my-xs relative',
      standaloneSearchBoxWrapper:
        'w-full flex ml:flex-row-reverse items-center justify-center p-xxs ml:p-0 border border-gray ml:border-none',
      searchBox: 'flex items-center w-full ml-s ml:ml-0 ml:p-xs  ml:border ml:border-dark-gray',
      searchBoxInput:
        'w-full font-sans text-small ml:text-s text-dark-gray outline-0 p-0 border-0 focus:outline-none focus:ring-0  ',
      closeIconWrapper: 'text-primary cursor-pointer',
      searchIconWrapper: 'ml:p-[17px] ml:border ml:border-l-0 ml:rounded-[2px] cursor-pointer',
      omniResultsWrapper:
        'bg-white pt-xs pb-s px-xs border border-gray border-t-0 font-sans text-small text-dark-gray absolute w-full',
      suggestionsWrapper: '',
      suggestionItem: 'cursor-pointer py-[2px] wrap-break-word',
      instantResultsTitle: 'font-demi text-black mt-xs mb-xxs',
      instantResultsWrapper: '',
    },
  },
  rba: {},
};
