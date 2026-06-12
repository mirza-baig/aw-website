// Lib
import { ThemeFile, ThemeName } from 'lib/context/ThemeContext';

type SelectThemeType = {
  [key in ThemeName]: SelectThemeSubType;
};

export type SelectThemeSubType = {
  classes: {
    stepSelect: string;
    stepContainer: string;
    stepHeading: string;
    stepCopy: string;
    stepSubhead: string;
    stepWrapperOptions: string;
    stepWrapperProducts: string;
    mobileResetBtn: string;
    mobileResetBtnIcon: string;
    bouncyCardShadow: string;
  };
};

export const SelectTheme = (): ThemeFile | SelectThemeType => {
  return {
    aw: {
      classes: {
        stepSelect: `step-select py-[30px] px-0 font-futura-pt`,
        stepContainer: `step-container max-w-[1200px] my-0 mx-auto py-0 px-[20px] md:p-0`,
        stepHeading: `step-heading text-[32px] text-black leading-[1.2] mb-[5px] p-[0_15px] font-bold md:text-center md:mb-[15px]`,
        stepCopy: `step-copy text-[16px] leading-[17px] text-black mb-[10px] p-[0_15px] md:text-[18px] md:text-center md:mb-[25px]`,
        stepSubhead: `text-[24px] text-black mb-[25px] p-[0_15px] font-bold md:text-center md:mb-[40px]`,
        stepWrapperOptions: `flex flex-wrap justify-center lg:px-[15px]`,
        stepWrapperProducts: `flex flex-wrap justify-center lg:px-[15px]`,
        mobileResetBtn: `block md:hidden bottom-[10px] text-primary fixed right-[10px] z-10 rotate-90 scale-x-[-1]`,
        mobileResetBtnIcon: `font-black rotate-90 scale-x-[-1] [&>svg]:bg-primary [&>svg]:text-white [&>svg]:p-[5px] [&>svg]:rounded-[20px] [&>svg]:shadow-[0px_0px_0px_2px_#ffffff] [&>svg]:drop-shadow-[-8px_0_6px_#b9b9b9]`,
        bouncyCardShadow: ` shadow-[0px_0px_30px_1px_rgba(0,0,0,0.2)] `,
      },
    },
    rba: {
      classes: {},
    },
  };
};
