// Lib
import { ThemeFile, ThemeName } from 'lib/context/ThemeContext';

type TextAttributeThemeType = {
  [key in ThemeName]: TextAttributeThemeSubType;
};

export type TextAttributeThemeSubType = {
  classes: {
    attributeOption: string;
    earmark: string;
    copy: string;
    optionsList: string;
    optionsListItem: string;
    optionsListButton: string;
    optionsListButtonSelected: string;
    optionsListButtonUnselected: string;
    optionsListButtonText: string;
    disclaimer: string;
  };
};

export const TextAttributeTheme = (): ThemeFile | TextAttributeThemeType => {
  return {
    aw: {
      classes: {
        attributeOption: ` attribute-options attribute-options--text p-[20px_0_0] max-md:border-t max-md:border-t-black `,
        earmark: `before:absolute before:left-0 before:top-[3px] before:border-l-14 before:border-b-14 before:border-y-[rgba(0,0,0,0)] before:border-l-primary`,
        copy: ` attribute-options__copy pb-[15px] pl-[20px] text-[20px] leading-none font-bold relative`,
        optionsList: ` attribute-options__list flex flex-wrap w-full max-w-full list-style-none `,
        optionsListItem: ` attribute-options__list-item flex m-[0_20px_20px_0] text-center relative `,
        optionsListButton: ` attribute-options__list-btn w-[96px] text-[18px] leading-[22px] cursor-pointer p-[4px_14px] border-2  rounded-[20px] `,
        optionsListButtonSelected: `border-primary`,
        optionsListButtonUnselected: `border-gray`,
        optionsListButtonText: ` block text-[16px] text-center `,
        disclaimer: ` attribute-options__disclaimer pt-[20px] pl-[15px] mr-[15px] mb-[15px] text-[14px] leading-tight `,
      },
    },
    rba: {
      classes: {},
    },
  };
};
