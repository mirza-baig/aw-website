// Lib
import { ThemeFile } from 'lib/context/ThemeContext';

import { BackgroundColor, TextAlignment } from './GenericChart.types';

const GetBackgroundColorStyling = (backgroundColor: BackgroundColor) => {
  switch (backgroundColor) {
    case 'black':
      return 'bg-black text-white';
    case 'gray':
      return 'bg-gray text-black';
    case 'white':
    default:
      return 'bg-white text-black';
  }
};

const GetBorderColorStyling = (backgroundColor: BackgroundColor) => {
  switch (backgroundColor) {
    case 'black':
      return 'border-b-gray border-b';
    case 'gray':
    case 'white':
    default:
      return 'border-b-black border-b';
  }
};

export const GetTextAlignment = (textAlignment: TextAlignment) => {
  switch (textAlignment) {
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-right';
    case 'left':
      return 'text-left';
    default:
      return '';
  }
};

export const GenericChartTheme = (
  titleRowBackground: BackgroundColor,
  titleColumnBackground: BackgroundColor,
  textAlignment: TextAlignment
): ThemeFile => {
  return {
    aw: {
      classes: {
        section: `font-futura-pt`,
        table: ` w-full table-fixed ${GetTextAlignment(textAlignment)}`,
        theadRow: ` title-row hidden md:table-row `,
        tableRow: ` content-row `,
        titleRow: ` border-b-black ${GetBackgroundColorStyling(titleRowBackground)}`,
        imageRow: ` image-row hidden md:table-row`,
        titleColumn: `  ${GetBackgroundColorStyling(titleColumnBackground)}`,
        columnHeader: `column-header border border-black ${GetBackgroundColorStyling(
          titleColumnBackground
        )} ${GetBorderColorStyling(
          titleColumnBackground
        )} text-[14px] md:text-[18px] p-[5px_15px] font-demi`,
        tableData: `bg-white border border-black block md:table-cell border-b-black`,
        rowHeader: `row-header p-[5px] ${GetBackgroundColorStyling(
          titleRowBackground
        )} leading-[1.25] [&_h3]:text-[22px] [&_h3]:font-bold [&_h3]:mb-[10px] [&_h4]:text-[18px] [&_h4]:font-demi [&_h4]:mb-[8px]`,
        mobileTitleColumn: ` mobile-title md:hidden p-[5px] ${GetBackgroundColorStyling(
          titleRowBackground
        )} ${GetBorderColorStyling(
          titleRowBackground
        )} leading-[1.25] [&_h3]:text-[22px] [&_h3]:font-bold [&_h4]:text-[14px] [&_h4]:font-demi`,
        contentClass: ` [&_img]:mx-auto p-[5px]`,
        imageColumnHeader: `image-col`,
        imageColumn: `image-col p-[5px] max-md:hidden`,
        imageCell: `p-[5px]`,
        footer: `content-footer`,
      },
    },
    rba: {
      classes: {},
    },
  };
};
