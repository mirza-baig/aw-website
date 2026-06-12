import { ThemeFile } from 'lib/context/ThemeContext';

export const FoldingDoorSizingCalculatorTheme = (): ThemeFile => {
  return {
    aw: {
      classes: {
        headlineClass: 'mb-3 mt-[42px] leading-[18px] text-xs font-heavy normal-case',
        bodyCopyClass: 'mb-0 normal-case font-regular leading-[22px] text-dark-gray ml-2 mr-2',
        formWrapper: 'col-span-12 grid grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-2 ml:gap-x-[116px]',
        labelClass: 'flex text-body font-regular',
        columnSpan1: 'relative col-span-1 mb-m md:mb-ml print:col-span-11',
        columnSpan2: 'relative md:col-span-2 mb-m md:mb-ml md:pr-28',
        selectColumnSpan1:
          'form-control w-full border border-gray text-sm-xs outline-none focus:border-black',
        selectColumnSpan2:
          'form-control w-full border border-gray text-sm-xs outline-none focus:border-black md:w-1/2',
        errorInvalid:
          'form-control placeholder-dark-gray text-sm-xs is-invalid w-full border border-error-outline focus:border-black',
        errorValid:
          'form-control placeholder-dark-gray text-sm-xs w-full border border-gray outline-none focus:border-black',
        helpText: 'pr-1 text-small leading-[22px]',
        modalLinkButton:
          'mt-2 text-small leading-[22px] text-darkprimary hover:underline focus-visible:ml-0.5',
        prevButton:
          'flex w-fit items-center whitespace-nowrap rounded-lg border-4 border-gray px-m py-[9px] font-sans text-button font-heavy hover:border-black hover:bg-black hover:text-white disabled:border-gray disabled:text-gray',
        printButton:
          'flex w-fit items-center whitespace-nowrap text-body leading-[22px] text-darkprimary hover:underline',
        printHeaderDiv: 'hidden print:col-span-12 print:my-6 print:block print:text-[36px] ',
        resetButton:
          'ml-xs flex w-full items-center justify-end whitespace-nowrap font-sans text-text-link font-heavy text-theme-text hover:underline hover:decoration-secondary hover:underline-offset-8 disabled:border-gray disabled:text-gray md:ml-0 md:w-fit md:px-0',
        resultsOutputWrapper:
          'col-span-12 grid grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-2 ml:gap-x-[116px] print:m-6',
        sitePrepGuideDiv:
          'flex flex-col items-center border-2 border-black p-6 mt-4 md:col-span-2 md:py-8 md:pl-8 md:pr-2 md:flex-row print:hidden',
        submitButton:
          'flex w-fit items-center whitespace-nowrap rounded-lg border-4 border-theme-btn-border bg-theme-btn-bg px-m py-[9px] font-sans text-button font-heavy text-theme-btn-text hover:border-theme-btn-border-hover hover:bg-theme-btn-bg-hover hover:text-theme-btn-text-hover disabled:border-gray disabled:text-gray',
        tableHead:
          'border-b border-neutral-700 bg-neutral-800 text-neutral-50 dark:border-neutral-600 dark:bg-neutral-700',
        tableRow: 'border-b dark:border-neutral-500',
        tdColumn: 'whitespace-nowrap px-4 py-2 font-demi leading-[18px]',
        tdColumnCenter: 'whitespace-nowrap px-4 py-2 text-center font-demi leading-[18px]',
        tdColumnLeft: 'whitespace-pre-line px-4 py-2 text-left font-demi leading-[18px]',
        thLeft:
          'py-4 pl-4 text-left text-sm-xs text-white font-heavy leading-[16px] md:leading-[18px] md:text-lg',
        thCenter: 'py-4 text-center text-lg text-white font-heavy',
        thRight: 'py-4 pr-4 text-center text-lg text-white font-heavy',
        warningMessage: 'text-xxs font-regular text-darkprimary',
      },
    },
    rba: {
      classes: {},
    },
  };
};
