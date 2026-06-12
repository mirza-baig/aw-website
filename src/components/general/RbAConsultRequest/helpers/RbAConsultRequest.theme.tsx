import classNames from 'classnames';
import { ThemeFile } from 'lib/context/ThemeContext';

export const RbAConsultRequestTheme = (hasSidebar: boolean): ThemeFile => {
  return {
    aw: {
      classes: {
        cover: 'z-spinner p-0 m-0 top-0 left-0 fixed',
        contentContainer: 'grid grid-cols-2 ml:grid-cols-12',
        content: classNames(
          'order-2 col-span-2 float-left pb-5 ml:order-1',
          hasSidebar ? 'ml:mr-6 ml:col-span-8' : 'ml:col-span-12'
        ),
        headlineClass: 'font-sans text-[34px] font-demi mb-xs leading-[1.25em]',
        body: 'font-sans text-xs font-light leading-[1.5em]',
        formWrapper: 'col-span-12 grid grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-3 ml:gap-x-[116px]',
        columnSpan1: 'relative col-span-1 mb-m md:mb-ml print:col-span-11',
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
        sidebar: classNames(
          hasSidebar
            ? 'order-1 col-span-2 float-right mb-5 block ml:order-2 ml:col-span-4 ml:mb-0'
            : 'hidden'
        ),
        sidebarWrapper: 'border-2 border-primary',
        sidebarH2:
          'm-[30px] mb-5 border-y-2 border-primary py-5 text-center font-sans text-[34px] font-bold leading-[1.25em]',
        sidebarH3:
          'text-primary font-bold m-[30px] mt-0 text-center font-sans text-[22px] leading-[1.25em]',
        offerDetails: 'bg-primary text-white text-xxs p-2.5 text-center',
        submitButton:
          'flex w-fit items-center whitespace-nowrap rounded-lg border-4 border-theme-btn-border bg-theme-btn-bg px-m py-[9px] font-sans text-button font-heavy text-theme-btn-text hover:border-theme-btn-border-hover hover:bg-theme-btn-bg-hover hover:text-theme-btn-text-hover disabled:border-gray disabled:text-gray',
      },
    },
    rba: {
      classes: {},
    },
  };
};
