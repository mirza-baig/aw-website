import { ThemeFile } from 'lib/context/ThemeContext';

export const ShareholderRegistrationTheme: ThemeFile = {
  aw: {
    classes: {
      componentWrapper:
        'px-m md:max-w-screen-lg lg:mx-auto text-center mb-10 py-l col-span-12 md:w-full md:mx-auto',
      imageWrapper: 'px-m md:max-w-screen-lg lg:mx-auto text-center mb-10',
      headlineClass: 'items-top text-[24px] lg:text-[36px] font-demi mb-4 text-dark-gray',
      formLabel: 'mb-2 text-sm text-black cursor-pointer mt-[5px] max-w-full',
      formInput:
        'block mt-1 mb-3 rounded-[3px] border border-[#b9b9b9] mx-0 py-2 px-[10px] w-full text-base text-black',
      buttonClass:
        'align-top bg-[#ff8f2d] border-[#ff8f2d] leading-[38px] py-[5px] px-[35px] text-[18px] text-white border-none rounded-lg mt-1',
      errorClass: 'mt-4 text-center text-sm text-dark-gray',
    },
  },
  rba: {},
};
