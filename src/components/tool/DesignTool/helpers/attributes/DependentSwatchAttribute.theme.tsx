// Lib
import { ThemeFile, ThemeName } from 'lib/context/ThemeContext';

type DependentSwatchAttributeThemeType = {
  [key in ThemeName]: DependentSwatchAttributeThemeSubType;
};

export type DependentSwatchAttributeThemeSubType = {
  classes: {
    attributeOption: string;
    copy: string;
    container: string;
    containerControl: string;
    title: string;
    controlImage: string;
    swiperWrapper: string;
    swiperSlide: string;
    swiperContainer: string;
    list: string;
    listItem: string;
    listItemButton: string;
    listItemButtonSelected: string;
    listItemButtonText: string;
    listItemImageWrapper: string;
    listItemImage: string;
    listItemImageSelected: string;
    listItemImageSelectedBg: string;
    listItemTitle: string;
    listMore: string;
    listMoreImageWrapper: string;
    listMoreText: string;
    listMoreTextNumber: string;
    listMoreTextMore: string;
    listMoreImage: string;
    disclaimer: string;
  };
};

export const DependentSwatchAttributeTheme = (): ThemeFile | DependentSwatchAttributeThemeType => {
  return {
    aw: {
      classes: {
        attributeOption: ` attribute-options attribute-options--dependent md:ml-[16px] md:mb-[60px] md:mt-[16px] `,
        copy: ` attribute-options__copy pt-[29px] pl-[15px] mb-[15px] text-[14px] md:text-[18px] leading-[17px] font-regular`,
        container: ` attribute-options--dependent__container flex flex-col mt-[10px] p-0 md:mt-[30px] lg:flex-row `,
        containerControl: ` attribute-options--dependent__container-control relative flex items-center mb-[25px] justify-evenly md:flex-[0_0_20%] md:flex-col md:max-w-[20%] `,
        title: ` font-bold order-1 text-center text-[18px] leading-normal md:-order-1 `,
        controlImage: ` block h-auto max-w-full w-[100px] md:w-auto md:m-[0_auto] `,
        swiperWrapper: ` [&_.slick-dots]:mt-0 `,
        swiperContainer: ` attribute-options--dependent__container-dependents max-w-full [&_.slick-active_button:before]:text-primary! md:flex-[0_0_80%] md:max-w-[80%] md:ml-[30px] `,
        list: `attribute-options__list flex list-style-none max-w-full flex-wrap w-full m-0 justify-center `,
        listItem: ` attribute-options__list-item flex-[0_0_25%] mb-[40px] pr-[10px] text-center max-w-[25%] lg:pr-[20px] lg:flex-[0_0_20%] lg:max-w-[20%] xl:flex-[0_0_16.66%] xl:max-w-[16.66%]`,
        listItemButton: ` attribute-options__list-btn w-full text-[18px] leading-[22px] cursor-pointer p-px `,
        listItemButtonSelected: ` selected selected-button border-b-4 border-b-primary p-[1px_6px] `,
        listItemButtonText: ` block mt-[15px] text-[16px] text-center normal-case `,
        listItemImageWrapper: ` attribute-options__list-img-wrapper w-full relative inline-block `,
        listItemImage: ` attribute-options__list-img w-full `,
        listItemImageSelected: ` selected selected-image absolute bottom-0 right-0 text-white pb-[5px] pr-[5px] [&_svg]:relative `,
        listItemImageSelectedBg: ` before:absolute before:bottom-0 before:right-0 before:border-l-50 before:border-x-[rgba(0,0,0,0)] before:border-r-0 before:border-b-50 before:border-b-primary `,
        listItemTitle: ` block mt-[15px] text-[16px] text-center `,
        listMore: ` attribute-options__list-more flex-[0_0_25%] mb-[40px] pr-[10px] text-center max-w-[25%] lg:pr-[20px] lg:flex-[0_0_20%] lg:max-w-[20%] xl:flex-[0_0_16.66%] xl:max-w-[16.66%] hover:cursor-pointer`,
        listMoreImageWrapper: ` attribute-options__list-more-img-wrapper bg-[#f16128] block relative min-h-[80px] md:min-h-[100px] `,
        listMoreText: ` attribute-options__list-more-text absolute w-full h-full text-center justify-center items-center font-bold flex flex-col text-white `,
        listMoreTextMore: ` more leading-[0.8] m-0 text-[16px] md:text-[24px] pl-[15px] pt-[15px] `,
        listMoreTextNumber: ` number leading-[0.8] m-0 text-[28px] md:text-[40px] pl-[15px] pt-[15px] `,
        listMoreImage: ` block h-auto w-full min-h-[80px] md:min-h-[100px] `,
        disclaimer: `  pt-[20px] pl-[15px] mr-[15px] mb-[15px] text-[14px] leading-tight `,
      },
    },
    rba: {
      classes: {},
    },
  };
};
