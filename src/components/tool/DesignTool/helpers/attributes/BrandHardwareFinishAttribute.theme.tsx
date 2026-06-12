// Lib
import { ThemeFile, ThemeName } from 'lib/context/ThemeContext';

type BrandHardwareFinishAttributeThemeType = {
  [key in ThemeName]: BrandHardwareFinishAttributeThemeSubType;
};

export type BrandHardwareFinishAttributeThemeSubType = {
  classes: {
    attributeOption: string;
    optionsList: string;
    optionsListImageWrapper: string;
    disclaimer: string;
    listItem: string;
    listItemImage: string;
    listItemButton: string;
    listItemButtonText: string;
    listItemImageWrapper: string;
    unselected: string;
    selected: string;
  };
};

export const BrandHardwareFinishAttributeTheme = ():
  | ThemeFile
  | BrandHardwareFinishAttributeThemeType => {
  return {
    aw: {
      classes: {
        attributeOption: ` attribute-options attribute-options--swatch brand-hardware-finish-attribute md:ml-[16px] md:mb-[60px] md:mt-[16px] `,
        optionsList: ` attribute-options__list flex flex-wrap w-full max-w-full list-style-none mt-[18px] `,
        disclaimer: ` attribute-options__disclaimer pt-[20px] pl-[15px] mr-[15px] mb-[15px] text-[14px] leading-tight `,
        listItem: ` attribute-options__list-item flex-[0_0_25%] max-w-[25%] mb-2 text-center lg:flex-[0_0_15%] lg:max-w-[15%] `,
        listItemImage: ` attribute-options__list-img h-[60px] w-[60px] rounded-[50%] `,
        listItemButton: ` attribute-options__list-btn w-full text-[18px] leading-[22px] cursor-pointer p-px `,
        listItemButtonText: ` block p-[4px] text-[16px] text-center normal-case `,
        listItemImageWrapper: ` attribute-options__list-img-wrapper relative inline-block p-2 border rounded-[50%] `,
        unselected: ` border-none p-2`,
        selected: ` border-primary p-1 border-4 `,
      },
    },
    rba: {
      classes: {},
    },
  };
};
