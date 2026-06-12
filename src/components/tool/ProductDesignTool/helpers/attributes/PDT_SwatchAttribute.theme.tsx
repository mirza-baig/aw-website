// Lib
import { ThemeFile, ThemeName } from 'lib/context/ThemeContext';

type SwatchAttributeThemeType = {
  [key in ThemeName]: SwatchAttributeThemeSubType;
};

export type SwatchAttributeThemeSubType = {
  classes: {
    attributeOption: string;
    copy: string;
    swiperWrapper: string;
    swiperSlide: string;
    swiperContainer: string;
    optionsList: string;
    optionsListItem: string;
    optionsListButton: string;
    optionsListButtonText: string;
    optionsListImageWrapper: string;
    optionsListImage: string;
    disclaimer: string;
    unselected: string;
    selected: string;
  };
};

export const SwatchAttributeTheme = (): ThemeFile | SwatchAttributeThemeType => {
  return {
    aw: {
      classes: {
        attributeOption: ` attribute-options attribute-options--swatch md:mt-[16px]  `,
        copy: ` attribute-options__copy mb-[15px] pl-[20px] text-[20px] leading-none font-bold relative before:absolute before:left-0 before:top-[3px] before:border-l-14 before:border-b-14 before:border-y-[rgba(0,0,0,0)] before:border-l-primary `,
        swiperWrapper: `  `,
        swiperSlide: `  `,
        swiperContainer: ` max-w-full [&_.slick-active_button:before]:text-primary! `,
        optionsList: ` attribute-options__list flex max-md:flex-wrap list-style-none ml-0 mb-0 max-w-full w-full `,
        optionsListItem: ` attribute-options__list-item mr-[2%] flex-[0_0_48%] max-w-[48%] text-center md:flex-[0_0_20%] md:max-w-[20%] md:mr-[5%]`,
        optionsListButton: ` attribute-options__list-btn w-full text-[18px] leading-[22px] cursor-pointer p-px `,
        optionsListButtonText: ` block p-[4px] text-[16px] text-center `,
        optionsListImageWrapper: ` attribute-options__list-img-wrapper text-center text-[16px] block relative border p-[5px] flex flex-col items-center justify-center aspect-square `,
        optionsListImage: ` block mx-auto h-[78px] w-[78px] md:h-[106px] md:w-[106px] max-w-full max-h-full [&_span]:max-w-full [&_span]:max-h-full [&_img]:min-w-[initial]! [&_img]:w-auto! [&_img]:min-h-[initial]! [&_img]:h-auto!`,
        disclaimer: ` attribute-options__disclaimer pt-[20px] mr-[15px] mb-[15px] text-[14px] leading-tight `,
        unselected: ` border-gray hover:border-black `,
        selected: ` border-primary `,
      },
    },
    rba: {
      classes: {},
    },
  };
};
