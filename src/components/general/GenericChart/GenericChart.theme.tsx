// Lib
import { ThemeFile } from 'lib/context/ThemeContext';

import { TextAlignment } from './GenericChart.types';

export const GetAlignment = (alignment?: TextAlignment) => {
  switch (alignment) {
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
  titleAlignment?: TextAlignment,
  copyAlignment?: TextAlignment
): ThemeFile => {
  return {
    aw: {
      classes: {
        section: `font-futura-pt`,
        table: `w-full border-collapse border border-black table-fixed`,
        theadRow: `title-row hidden md:table-row `,
        tableRow: `content-row `,
        imageRow: `image-row hidden bg-light-gray md:table-row`,
        rowColumnTitle: `rowColumnTitle border-t border-l border-black p-[5px] bg-light-gray font-serif font-bold text-base ${GetAlignment(titleAlignment)}`,
        rowSubtitle: `row-subtitle font-serif font-regular text-legal md:text-small pt-[5px] `,
        tableData: `block md:table-cell md:border md:border-black`,
        mobileTitleColumn: `mobile-title border-t border-l border-b border-black md:hidden p-[5px] bg-light-gray font-serif font-bold text-base ${GetAlignment(titleAlignment)}`,
        mobileTitleColumnFirst: `mobile-title border-l border-b border-black md:hidden p-[5px] bg-light-gray font-serif font-bold text-base ${GetAlignment(titleAlignment)}`,
        contentClass: `font-serif text-theme-body text-small border-l border-black [&_img]:mx-auto p-[5px] md:border-l-0 md:text-xxs ${GetAlignment(copyAlignment)}`,
        imageColumnHeader: `image-col bg-light-gray`,
        imageColumn: `image-col border border-black bg-light-gray p-[5px] max-md:hidden`,
        imageCell: `p-[5px] border border-black`,
        footer: `content-footer text-legal [&_p]:text-legal italic font-serif mt-xs`,
      },
    },
    rba: {
      classes: {},
    },
  };
};
