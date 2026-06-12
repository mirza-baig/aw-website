// Lib
import { ThemeFile, ThemeName } from 'lib/context/ThemeContext';

type BrandHardwareAttributeThemeType = {
  [key in ThemeName]: BrandHardwareAttributeThemeSubType;
};

export type BrandHardwareAttributeThemeSubType = {
  classes: {
    attributeOption: string;
    optionsList: string;
    optionsListItem: string;
    brandCollectionOptionsListItem: string;
    optionsListButton: string;
    optionsListButtonText: string;
    optionsListImageWrapper: string;
    optionsListImage: string;
    disclaimer: string;
    unselected: string;
    selected: string;
  };
};

export const BrandHardwareAttributeTheme = (): ThemeFile | BrandHardwareAttributeThemeType => {
  return {
    aw: {
      classes: {
        attributeOption: ` attribute-options attribute-options--swatch md:ml-[16px] md:mb-[60px] md:mt-[16px] `,
        optionsList: ` attribute-options__list flex flex-wrap w-full max-w-full list-style-none `,
        optionsListItem: ` attribute-options__list-item flex-[0_0_25%] pr-[10px] text-center max-w-[25%] `,
        brandCollectionOptionsListItem: ` attribute-options__list-item flex-[0_0_50%] pr-[10px] text-center max-w-[50%] lg:flex-[0_0_25%] lg:max-w-[25%] `,
        optionsListButton: ` attribute-options__list-btn w-full text-[18px] leading-[22px] cursor-pointer p-px `,
        optionsListButtonText: ` block mt-[15px] text-[16px] text-center `,
        optionsListImageWrapper: ` attribute-options__list-img-wrapper text-center text-[16px] block relative border p-2  `,
        optionsListImage: ` block h-auto w-full `,
        disclaimer: ` attribute-options__disclaimer pt-[20px] pl-[15px] mr-[15px] mb-[15px] text-[14px] leading-tight `,
        unselected: ` border-gray hover:border-black `,
        selected: ` border-primary `,
      },
    },
    rba: {
      classes: {},
    },
  };
};
