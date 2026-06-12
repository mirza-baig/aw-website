// Lib
import { ThemeFile, ThemeName } from 'lib/context/ThemeContext';

type SizingAttributeThemeType = {
  [key in ThemeName]: SizingAttributeThemeSubType;
};

export type SizingAttributeThemeSubType = {
  classes: {
    attributeOption: string;
    copy: string;
    sizingName: string;
    earmark: string;
    dropDownSelectList: string;
    dropDownSelect: string;
    dropDownSelectIcon: string;
    sizingList: string;
    sizingSeparator: string;
    sizingListItem: string;
    sizingListItemButton: string;
    unselected: string;
    selected: string;
    disclaimer: string;
    attributes: {
      attributes: string;
      attributeMenuList: string;
      attributeMenuListItem: string;
      attributeMenuLink: string;
      attributesSection: string;
    };
  };
};

export const SizingAttributeTheme = (): ThemeFile | SizingAttributeThemeType => {
  return {
    aw: {
      classes: {
        attributeOption: ` attribute-options md:ml-[16px] mt-[16px] `,
        copy: ` attribute-options__copy pt-[29px] pl-[15px] text-[14px] md:text-[18px] leading-[17px] font-regular`,
        sizingName: ` attribute-options--sizing__name mb-[15px] pl-[20px] text-[20px] leading-none font-bold relative `,
        earmark: `before:absolute before:left-0 before:top-[3px] before:border-l-14 before:border-b-14 before:border-y-[rgba(0,0,0,0)] before:border-l-primary`,
        dropDownSelectList: ` block border border-black rounded-[4px] p-[12px_20px] relative md:hidden `,
        dropDownSelect: ` appearance-none border-none text-black text-[18px] bg-none bg-[rgba(0,0,0,0)] w-full p-[8px_10px] m-[2px_0_0_0] rounded-[3px] `,
        dropDownSelectIcon: ` absolute h-full right-[20px] top-0 flex z-[-1] items-center `,
        sizingList: `hidden md:flex list-style-none ml-[20px] mt-[18px] mb-0 flex-wrap`,
        sizingSeparator: ` border-t border-t-gray py-[20px] mt-[20px] first:mt-0 md:mt-0 `,
        sizingListItem: ` mr-[20px] mb-[20px] `,
        sizingListItemButton: ` w-[96px] text-[18px] leading-[22px] cursor-pointer border-2 rounded-[20px] p-[4px_14px] [&_sup]:text-[12px] `,
        unselected: ` border-gray `,
        selected: ` p-[1px_6px] border-primary `,
        disclaimer: `  pt-[20px] pl-[15px] mr-[15px] mb-[15px] text-small `,
        attributes: {
          attributes: `attributes flex flex-col w-full md:shrink-0 md:w-[60%] pl-0 pr-0 md:pl-[10px]`,
          attributeMenuList: `attribute-menu--list w-full flex flex-col md:flex-row list-style-none justify-start mt-[16px] text-[14px] `,
          attributeMenuListItem: `attribute-menu--list-item only:w-full only:text-right mr-[16px] `,
          attributeMenuLink: `attribute-menu__link gtm-click text-black flex items-center`,
          attributesSection: `attributes-sections flex flex-row items-end justify-start`,
        },
      },
    },
    rba: {
      classes: {},
    },
  };
};
