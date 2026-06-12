// Lib
import { ThemeFile, ThemeName } from 'lib/context/ThemeContext';

type DescriptionAttributeThemeType = {
  [key in ThemeName]: DescriptionAttributeThemeSubType;
};

export type DescriptionAttributeThemeSubType = {
  classes: {
    attributeOption: string;
    copy: string;
  };
};

export const DescriptionAttributeTheme = (): ThemeFile | DescriptionAttributeThemeType => {
  return {
    aw: {
      classes: {
        attributeOption: ` attribute-text attribute-description `,
        copy: ` copy mb-[15px] pt-[15px] text-[14px] leading-[17px] font-regular`,
      },
    },
    rba: {
      classes: {},
    },
  };
};
