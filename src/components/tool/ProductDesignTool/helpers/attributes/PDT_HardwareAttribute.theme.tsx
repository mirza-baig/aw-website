// Lib
import { ThemeFile, ThemeName } from 'lib/context/ThemeContext';

type HardwareAttributeThemeType = {
  [key in ThemeName]: HardwareAttributeThemeSubType;
};

export type HardwareAttributeThemeSubType = {
  classes: {
    attributeOption: string;
    titleMobile: string;
    copy: string;
    container: string;
    containerHardware: string;
    containerTypeDesktop: string;
    listBordered: string;
    hardwareTypeListItem: string;
    hardwareListItem: string;
    listItem: string;
    hardwareListItemButton: string;
    listItemButton: string;
    listItemButtonSelected: string;
    hardwareListItemButtonText: string;
    listItemButtonText: string;
    hardwareListItemImageWrapper: string;
    listItemImageWrapper: string;
    hardwareListItemImage: string;
    listItemImage: string;
    hardwareListItemImageSelected: string;
    listItemImageSelected: string;
    hardwareListItemImageSelectedBg: string;
    listItemImageSelectedBg: string;
    dropDownSelectList: string;
    dropDownSelectListMobile: string;
    dropDownSelect: string;
    dropDownSelectIcon: string;
    containerTypeMobile: string;
    containerTypeMobileImage: string;
    containerFinish: string;
    containerFinishWithoutBorder: string;
    containerFinishTitleMobile: string;
    containerlist: string;
    containerOptional: string;
    title: string;
    disclaimer: string;
    unselected: string;
    selected: string;
  };
};

export const HardwareAttributeTheme = (): ThemeFile | HardwareAttributeThemeType => {
  return {
    aw: {
      classes: {
        attributeOption: ` attribute-options attribute-options--hardware `,
        titleMobile: ` attribute-options__mobile-title pl-[15px] pt-[15px] text-[14px] leading-[17px] uppercase md:hidden `,
        copy: ` attribute-options__copy pt-[29px] pl-[15px] text-[14px] md:text-[18px] leading-[17px] font-regular`,
        container: ` attribute-options--hardware__container flex flex-col mt-[10px] `,
        containerHardware: ` attribute-options--hardware__container-hardware flex flex-col md:flex-row  `,
        containerTypeDesktop: ` attribute-options--hardware__container-hardware-type desktop hidden md:flex flex-[0_0_100%] min-w-full min-h-[100px] mb-[25px] `,
        listBordered: ` attribute-options__list bordered flex flex-col list-style-none ml-0 mb-0 max-w-full flex-wrap p-[20px_15px] `,
        hardwareTypeListItem: ` attribute-options__list-item flex-[0_0_50%] max-w-[50%] `,
        hardwareListItem: ` attribute-options__list-item flex-[0_0_25%] mb-[40px] pr-[10px] text-center max-w-[25%] lg:pr-[20px] lg:flex-[0_0_25%] lg:max-w-[20%] xl:pr-[20px] xl:flex-[0_0_20%] xl:max-w-[20%] `,
        listItem: ` attribute-options__list-item flex-[0_0_25%] max-w-[25%] mb-[2px] text-center lg:flex-[0_0_15%] lg:max-w-[15%] `,
        hardwareListItemButton: ` w-full `,
        listItemButton: ` attribute-options__list-btn w-full text-[18px] leading-[22px] cursor-pointer p-px `,
        listItemButtonSelected: ` selected selected-button border-b-4 border-b-primary p-[1px_6px] `,
        hardwareListItemButtonText: ` inline-block mt-[15px] text-[16px] leading-snug `,
        listItemButtonText: ` block p-[4px] text-[16px] text-center normal-case `,
        hardwareListItemImageWrapper: ` attribute-options__list-img-wrapper relative block border`,
        listItemImageWrapper: ` attribute-options__list-img-wrapper relative inline-block p-[4px] border rounded-[50%] `,
        hardwareListItemImage: ` m-[0_auto] `,
        listItemImage: ` attribute-options__list-img h-[60px] w-[60px] rounded-[50%] `,
        hardwareListItemImageSelected: ` selected selected-image absolute bottom-0 right-0 text-white pb-[5px] pr-[5px] [&_svg]:relative `,
        listItemImageSelected: ` selected selected-image absolute bottom-0 right-0 text-white pb-[5px] pr-[5px] [&_svg]:relative `,
        hardwareListItemImageSelectedBg: ` before:absolute before:bottom-0 before:right-0 before:border-l-50 before:border-x-[rgba(0,0,0,0)] before:border-r-0 before:border-b-50 before:border-b-primary `,
        listItemImageSelectedBg: ` before:absolute before:bottom-0 before:right-0 before:border-l-50 before:border-x-[rgba(0,0,0,0)] before:border-r-0 before:border-b-50 before:border-b-primary `,
        dropDownSelectList: ` block border border-black rounded-[4px] p-[12px_20px] relative md:hidden `,
        dropDownSelectListMobile: ` attribute-options__dropdown-list flex md:hidden `,
        dropDownSelect: ` appearance-none border-none text-black text-[18px] bg-none bg-[rgba(0,0,0,0)] w-full p-[8px_10px] m-[2px_0_0_0] rounded-[3px] `,
        dropDownSelectIcon: ` absolute h-full right-[20px] top-0 flex z-[-1] items-center `,
        containerTypeMobile: ` attribute-options--hardware__container-hardware-type mobile flex flex-col items-center md:hidden `,
        containerTypeMobileImage: `  `,
        containerFinish: ` attribute-options--hardware__container-hardware-finish md:flex-[0_0_100%] md:min-w-full border-t border-t-gray pt-[20px] mt-[20px] md:mt-0 `,
        containerFinishWithoutBorder: ` attribute-options--hardware__container-hardware-finish md:flex-[0_0_100%] md:min-w-full mt-[20px] md:mt-0 `,
        containerFinishTitleMobile: ` attribute-options__title flex md:hidden pl-[15px] pt-[15px] mt-[20px] mb-[15px] text-[14px] leading-tight uppercase `,
        containerlist: ` attribute-options__list flex list-style-none ml-0 mb-0 max-w-full flex-wrap w-full `,
        containerOptional: ` attribute-options--hardware__container-optional border-t border-t-gray pt-[20px] mt-[20px] md:mt-0 `,
        title: `  attribute-options--sizing__name mb-[15px] pl-[20px] text-[20px] leading-none font-bold relative before:absolute before:left-0 before:top-[3px] before:border-l-14 before:border-b-14 before:border-y-[rgba(0,0,0,0)] before:border-l-primary  `,
        disclaimer: ` attribute-options__disclaimer pt-[12px] mr-[15px] text-[14px] leading-tight `,
        unselected: ` border-gray hover:border-black `,
        selected: ` border-primary `,
      },
    },
    rba: {
      classes: {},
    },
  };
};
