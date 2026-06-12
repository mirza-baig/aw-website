// Lib
import { ThemeFile } from 'lib/context/ThemeContext';

export const RbaConsultRequestFormTheme: ThemeFile = {
  aw: {
    classes: {
      formRow: 'flex flex-wrap',
      formColumnThree: 'w-full mb-s md:w-1/3',
      formColumnTwo: 'w-full mb-s md:w-1/2',
      formColumnFullWidth: 'flex flex-col w-full mb-s align-middle md:flex-row',
      formErrorMessage: 'text-[#F14343] text-xs font-regular mt-1 leading-[1.5em]',
      formLabel: 'text-body font-regular flex w-full items-center',
      textInput:
        'flex h-12 w-full rounded-none border border-gray outline-none focus:ring-0 focus:border-2 focus:border-black py-xs pr-xs pl-xxs text-body font-regular placeholder:text-dark-gray',
      textInputError: 'border-error-outline border-2! focus:border-error-outline',
      requiredIndicator: 'text-primary pl-1',
      inputFeedback: 'text-[#F14343] text-small font-regular mt-1 leading-[1.5em]',
      radioInline: 'inline-block md:ml-5',
      radioInlineRight: 'ml-5 inline-block ',
      radioInlineInput: 'h-4 w-4',
      spinnerWrapper: 'z-spinner fixed top-0 left-0 m-0 h-full w-full bg-white p-0',
      spinner: 'absolute left-2/4 top-2/4 mx-auto my-0 h-[60px] w-[60px]',
      radioInlineLabel: 'ml-2 font-sans text-body font-regular hover:cursor-pointer',
      disclaimer: 'pt-5 text-small text-dark-gray  font-light leading-[18px]',
      submitButton:
        'flex w-fit items-center whitespace-nowrap rounded-lg border-4 border-theme-btn-border bg-theme-btn-bg px-m py-[9px] font-sans text-button font-heavy text-theme-btn-text hover:border-theme-btn-border-hover hover:bg-theme-btn-bg-hover hover:text-theme-btn-text-hover disabled:border-gray disabled:text-gray',
    },
  },
  rba: {
    classes: {
      formRow: 'flex flex-wrap',
      formColumnThree: 'w-full mb-s md:w-1/3',
      formColumnTwo: 'w-full mb-s md:w-1/2',
      formColumnFullWidth: 'flex flex-col w-full mb-s align-middle md:flex-row',
      formErrorMessage: 'text-[#F14343] text-xs font-regular mt-1 leading-[1.5em]',
      formLabel: 'text-body font-regular flex w-full items-center',
      textInput:
        'flex h-12 w-full rounded-none border border-gray outline-none focus:ring-0 focus:border-2 focus:border-black py-xs pr-xs pl-xxs text-body font-regular placeholder:text-dark-gray',
      textInputError: 'border-error-outline border-2! focus:border-error-outline',
      requiredIndicator: 'text-primary pl-1',
      inputFeedback: 'text-[#F14343] text-small font-regular mt-1 leading-[1.5em]',
      radioInline: 'inline-block md:ml-5',
      radioInlineRight: 'ml-5 inline-block ',
      radioInlineInput: 'h-4 w-4',
      spinnerWrapper: 'fixed top-0 left-0 m-0 h-full w-full bg-white p-0',
      spinner: 'absolute left-2/4 top-2/4 mx-auto my-0 h-[60px] w-[60px]',
      radioInlineLabel: 'ml-2 font-sans text-body font-regular hover:cursor-pointer',
      disclaimer: 'pt-5 text-small text-dark-gray  font-light leading-[18px]',
      submitButton:
        'flex w-fit items-center whitespace-nowrap rounded-lg border-4 border-theme-btn-border bg-theme-btn-bg px-m py-[9px] font-sans text-button font-heavy text-theme-btn-text hover:border-theme-btn-border-hover hover:bg-theme-btn-bg-hover hover:text-theme-btn-text-hover disabled:border-gray disabled:text-gray',
    },
  },
};
