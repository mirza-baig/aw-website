// Lib
import { ThemeFile, ThemeName } from 'lib/context/ThemeContext';

type TabbedSwatchAttributeThemeType = {
  [key in ThemeName]: TabbedSwatchAttributeThemeSubType;
};

export type TabbedSwatchAttributeThemeSubType = {
  classes: {
    attributeOption: string;
    copy: string;
    sizingName: string;
    dropDownSelectList: string;
    dropDownSelect: string;
    dropDownSelectIcon: string;
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
    tabButton: string;
    tabActive: string;
    tabInactive: string;
    disclaimer: string;
    unselected: string;
    selected: string;
  };
};

export const TabbedSwatchAttributeTheme = (): ThemeFile | TabbedSwatchAttributeThemeType => {
  return {
    aw: {
      classes: {
        attributeOption: ` attribute-options attribute-options--tabbed md:ml-[16px] md:mb-[60px] md:mt-[16px] `,
        copy: ` attribute-options__copy  mb-[15px] pl-[20px] text-[20px] leading-none font-bold relative before:absolute before:left-0 before:top-[3px] before:border-l-14 before:border-b-14 before:border-y-[rgba(0,0,0,0)] before:border-l-primary `,
        sizingName: ` attribute-options--sizing__name text-[14px] pt-[30px] pl-[20px] uppercase md:text-[20px] `,
        dropDownSelectList: ` block border border-black rounded-[4px] p-[12px_20px] relative md:hidden `,
        dropDownSelect: ` appearance-none border-none text-black text-[18px] bg-none bg-[rgba(0,0,0,0)] w-full p-[8px_10px] m-[2px_0_0_0] rounded-[3px] `,
        dropDownSelectIcon: ` absolute h-full right-[20px] top-0 flex z-[-1] items-center `,
        swiperWrapper: `  `,
        swiperSlide: `  `,
        swiperContainer: ` max-w-full [&_.slick-active_button:before]:text-primary! `,
        list: `attribute-options__list flex list-style-none ml-0 mb-0 max-w-full flex-wrap w-full mt-[18px] `,
        listItem: ` attribute-options__list-item flex-[0_0_25%] max-w-[25%] mb-[2px] text-center lg:flex-[0_0_15%] lg:max-w-[15%] `,
        listItemButton: ` attribute-options__list-btn w-full text-[18px] leading-[22px] cursor-pointer p-px `,
        listItemButtonSelected: ` selected selected-button border-b-4 border-b-primary p-[1px_6px] `,
        listItemButtonText: ` block p-[4px] text-[16px] text-center normal-case `,
        listItemImageWrapper: ` attribute-options__list-img-wrapper relative inline-block p-[4px] border rounded-[50%] `,
        listItemImage: ` attribute-options__list-img h-[60px] w-[60px] rounded-[50%] `,
        tabButton: ` attribute-options--tabbed__tab-btn cursor-pointer text-[#484848] uppercase h-[30px] mx-[10px] border-b-4 md:ml-0 font-light mb-[15px] md:mr-[30px] px-[6px] text-[14px] md:text-[18px] `,
        tabActive: ` attribute-options--tabbed__tab-btn-active border-b-primary `,
        tabInactive: ` attribute-options--tabbed__tab-btn-inactive border-b-[rgba(0,0,0,0)] `,
        disclaimer: `  pt-[20px] mr-[15px] mb-[15px] text-[14px] leading-tight `,
        unselected: ` border-gray hover:border-black `,
        selected: ` border-primary `,
      },
    },
    rba: {
      classes: {},
    },
  };
};
