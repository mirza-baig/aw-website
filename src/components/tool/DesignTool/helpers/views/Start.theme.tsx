// Lib
import { ThemeFile, ThemeName } from 'lib/context/ThemeContext';

type StartThemeType = {
  [key in ThemeName]: StartThemeSubType;
};

export type StartThemeSubType = {
  classes: {
    stepStart: string;
    stepContainer: string;
    stepHeading: string;
    stepWrapper: string;
    bouncyCardShadow: string;
    bouncyCardHeadingAdditionalClass: string;
    mobileOnlyCta: string;
    mobileOnlyCtaIcon: string;
  };
};

export const StartTheme = (): ThemeFile | StartThemeType => {
  return {
    aw: {
      classes: {
        stepStart: `step-start pb-[30px] px-0 font-futura-pt`,
        stepContainer: `step-container max-w-[1200px] my-0 mx-auto py-0 px-[20px] md:p-0`,
        stepHeading: `step-heading text-[32px] md:text-[58px] text-black md:text-center font-bold leading-none md:leading-[1.2] max-w-[580px] mt-0 mx-auto mb-[20px] md:mb-[80px] md:relative uppercase px-[15px]`,
        stepWrapper: `step-wrapper flex flex-col md:flex-row items-center justify-center`,
        bouncyCardShadow: ` shadow-[0px_0px_30px_1px_rgba(0,0,0,0.2)] `,
        bouncyCardHeadingAdditionalClass: ` hidden md:block md:text-[30px] md:leading-tight md:font-bold pt-[15px] pl-[15px] mt-[40px] `,
        mobileOnlyCta: ` inline-block w-full p-[1px_12px_16px_12px] md:hidden text-primary text-right text-[24px] font-bold leading-[1.2] uppercase `,
        mobileOnlyCtaIcon: ` inline-block pl-[20px] self-center `,
      },
    },
    rba: {
      classes: {},
    },
  };
};
