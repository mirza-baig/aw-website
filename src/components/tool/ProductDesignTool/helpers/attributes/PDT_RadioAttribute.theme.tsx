// Lib
import { ThemeFile, ThemeName } from 'lib/context/ThemeContext';

type RadioAttributeThemeType = {
  [key in ThemeName]: RadioAttributeThemeSubType;
};

export type RadioAttributeThemeSubType = {
  classes: {
    attributeOption: string;
    copy: string;
    radio: string;
    radioContainer: string;
    radioList: string;
    radioListItem: string;
    radioListLabel: string;
    radioButton: string;
    radioButtonIcon: string;
    radioUnselected: string;
    radioSelected: string;
    radioText: string;
    radioName: string;
    radioDesc: string;
    disclaimer: string;
    radioTextSelected: string;
  };
};

export const RadioAttributeTheme = (): ThemeFile | RadioAttributeThemeType => {
  return {
    aw: {
      classes: {
        attributeOption: ` attribute-options attribute-options--radio md:ml-[16px] md:mb-[60px] md:mt-[16px] `,
        copy: ` attribute-options__copy pt-[29px] pl-[15px] text-[14px] md:text-[18px] leading-[17px] font-regular`,
        radio: ` radio p-[30px_0] m-[0_0_10px_0] `,
        radioContainer: ` radio__container `,
        radioList: ` radio__list flex flex-wrap list-style-none w-full m-0 md:m-[0_0_0_16px] `,
        radioListItem: ` radio__list-item flex flex-[0_0_100%] max-w-full md:flex-[0_0_100%] md:max-w-full radio-item-margin `,
        radioListLabel: ` radio__list-label w-full flex text-left cursor-pointer `,
        radioButton: ` radio__btn bg-[#e4e5e4] relative max-w-[20%] rounded-[23px] min-w-[42px] h-[24px] `,
        radioUnselected: ` pdt-radio-border-unselected `,
        radioSelected: ` pdt-radio-border-selected `,
        radioButtonIcon: ` top-[3px] md:top-[2px] w-[19px] h-[19px] rounded-[50%] absolute transition-all `,
        radioText: ` radio__span-text inline-flex flex-col grow w-full ml-[10px] `,
        radioName: ` radio__name block text-[#484848] mb-[10px] text-[18px] leading-[1.2] font-bold md:text-[20px] `,
        radioDesc: ` radio__desc block text-[#484848] mb-[10px] text-[14px] md:text-[18px] `,
        disclaimer: `  pt-[20px] pl-[15px] mr-[15px] mb-[15px] text-[14px] leading-tight `,
        radioTextSelected: ` radio__span-text inline-flex flex-col grow w-full ml-[10px] selected bg-[#f7ccbf] [&_small]:translate-x-[10%] [&_small]:bg-[#ef6134] `,
      },
    },
    rba: {
      classes: {},
    },
  };
};
