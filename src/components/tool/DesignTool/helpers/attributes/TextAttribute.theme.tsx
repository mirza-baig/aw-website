// Lib
import { ThemeFile, ThemeName } from 'lib/context/ThemeContext';

type TextAttributeThemeType = {
  [key in ThemeName]: TextAttributeThemeSubType;
};

export type TextAttributeThemeSubType = {
  classes: {
    attributeOption: string;
    copy: string;
    optionsList: string;
    optionsListItem: string;
    optionsListButton: string;
    optionsListButtonText: string;
    optionsListImageWrapper: string;
    optionsListImage: string;
    optionsListImageSelected: string;
    optionsListImageSelectedBg: string;
    disclaimer: string;
  };
};

export const TextAttributeTheme = (): ThemeFile | TextAttributeThemeType => {
  return {
    aw: {
      classes: {
        attributeOption: ` attribute-options attribute-options--text md:ml-[16px] md:mb-[60px] md:mt-[16px] `,
        copy: ` attribute-options__copy pt-[29px] pl-[15px] text-[14px] md:text-[18px] leading-[17px] font-regular`,
        optionsList: ` attribute-options__list flex flex-wrap w-full max-w-full list-style-none mt-[18px] `,
        optionsListItem: ` attribute-options__list-item flex-[0_0_25%] mb-[40px] mr-[10px] text-center max-w-[25%] lg:mr-[20px] lg:flex-[0_0_16.66%] lg:max-w-[20%] xl:mr-[20px] xl:flex-[0_0_12.5%] xl:max-w-[12.5%] relative `,
        optionsListButton: ` attribute-options__list-btn w-full text-[18px] leading-[22px] cursor-pointer p-[10px_0] bg-[rgba(185,185,185,1)] `,
        optionsListButtonText: ` block text-[16px] text-center `,
        optionsListImageWrapper: ` attribute-options__list-img-wrapper text-center text-[16px] block relative `,
        optionsListImage: ` block h-auto w-full `,
        optionsListImageSelected: ` selected selected-image absolute bottom-0 right-0 text-white pb-[5px] pr-[5px] [&_svg]:relative `,
        optionsListImageSelectedBg: ` before:absolute before:bottom-0 before:right-0 before:border-l-40 before:border-x-[rgba(0,0,0,0)] before:border-r-0 before:border-b-40 before:border-b-primary `,
        disclaimer: ` attribute-options__disclaimer pt-[20px] pl-[15px] mr-[15px] mb-[15px] text-[14px] leading-tight `,
      },
    },
    rba: {
      classes: {},
    },
  };
};
