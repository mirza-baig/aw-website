import { ThemeName } from 'lib/context/ThemeContext';

export const getFacetsTheme = (themeName: ThemeName) => {
  switch (themeName) {
    case 'aw':
      return {
        facetGroup: {
          wrapper: 'mt-l ml:mt-0 px-m ml:px-0 pb-xl ml:pb-0',
          filterCta: 'py-xxs px-m border font-sans border-dark-gray text-xxs rounded',
          showResultCta:
            'flex w-fit items-center whitespace-nowrap rounded-lg border-4 border-theme-btn-border bg-theme-btn-bg px-m py-[9px] font-sans font-sans text-button font-bold text-theme-btn-text hover:border-theme-btn-border-hover hover:bg-theme-btn-bg-hover hover:text-theme-btn-text-hover disabled:border-gray disabled:text-gray',
          showResultCtaIcon: 'ml-xxs',
        },
        facetWrapper: 'pt-s pb-l border-t border-secondary',
        categoryLabelWrapper: {
          wrapper: 'flex items-center',
          categoryLabel: 'font-sans text-sm-xs ml:text-xs font-heavy',
          clearIcon: 'hidden ml:block mr-s cursor-pointer',
          caretIcon: 'block cursor-pointer',
        },
        listItem: {
          listItemWrapper: 'mt-s flex items-center',
          checkboxInput:
            'h-[18px] w-[18px] bg-white  border rounded-0 cursor-pointer border-dark-gray  focus:ring-0  checked:bg-black checked:hover:bg-black checked:bg-black text-white',
          checkboxLabel: 'text-serif ml-xxs cursor-pointer text-body font-regular',
        },
        showMore: 'block text-small font-sans text-darkprimary border-b font-regular mt-s',
        facetSearch: {
          searchLabel: 'text-serif ml-xxs text-body font-regular',
          searchInput: 'border mt-xxs px-xxxs focus-visible:ring-0 focus:outline-primary',
          searchPlusIcon:
            'h-[18px] w-[18px] flex items-center justify-center border border-dark-gray text-gray',
          resultListItem: 'text-serif ml-xxs text-body font-regular pt-xxs ',
        },
      };

    case 'rba':
      return {};
  }
};
