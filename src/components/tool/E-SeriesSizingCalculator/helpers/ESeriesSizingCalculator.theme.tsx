import { ThemeFile } from 'lib/context/ThemeContext';

export const ESeriesSizingCalculatorTheme = (): ThemeFile => {
  return {
    aw: {
      classes: {
        contentWrapper: 'col-span-12',
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
        footer: 'mt-2.5',
        helpText: 'pr-1 text-small leading-[22px]',
        singleButton: { wrapper: 'md:mb-0', cta1Classes: 'font-heavy' },
        modalLinkButton: 'text-small leading-[22px] text-darkprimary hover:underline',
        printButton:
          'flex w-fit items-center whitespace-nowrap text-body leading-[22px] text-primary hover:underline',
        printHeaderDiv: 'hidden print:col-span-12 print:my-6 print:block print:text-[36px] ',
        resetButton:
          'ml-xs flex w-full items-center justify-end whitespace-nowrap font-sans text-text-link font-demi text-theme-text hover:underline hover:decoration-secondary hover:underline-offset-8 disabled:border-gray disabled:text-gray md:font-heavy md:ml-0 md:w-fit md:px-0',
        resultsOutputWrapper:
          'col-span-12 grid grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-2 ml:gap-x-[116px] print:m-6',
        submitWrapper:
          'relative col-span-1 my-s mb-s flex w-full md:col-span-2 md:my-xs md:flex-row md:items-center md:space-x-4',
        submitButton:
          'mr-m flex w-fit items-center whitespace-nowrap rounded-lg border-4 border-theme-btn-border bg-theme-btn-bg px-m py-[9px] font-sans text-button font-heavy text-theme-btn-text text-black hover:border-theme-btn-border-hover hover:bg-theme-btn-bg-hover hover:text-theme-btn-text-hover disabled:border-gray disabled:text-gray',
        tableHead:
          'border-b border-neutral-700 bg-neutral-800 text-neutral-50 dark:border-neutral-600 dark:bg-neutral-700',
        tableRow: 'border-b dark:border-neutral-500',
        tdColumn: 'leading-[18px] whitespace-nowrap p-4 font-demi',
        tdColumnCenter: 'leading-[18px] whitespace-nowrap p-4 text-center font-demi',
        thLeft:
          'py-4 pl-4 leading-[16px] text-sm-xs text-white text-left font-heavy md:text-xs md:leading-[18px]',
        thCenter:
          'py-4 leading-[16px] text-sm-xs text-white text-center font-heavy md:text-xs md:leading-[18px]',
        thRight:
          'py-4 leading-[16px] text-sm-xs text-white pr-4 text-center font-heavy md:text-xs md:leading-[18px]',
      },
    },
    rba: {
      classes: {},
    },
  };
};
