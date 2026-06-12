// Lib
import { ThemeFile } from 'lib/context/ThemeContext';

export const BazaarvoiceQuestionAnswerTheme: ThemeFile = {
  aw: {
    classes: {
      wrapperClass: 'flex flex-col col-span-12 border-solid border-gray border-b pb-m -mt-2',
      headline:
        'col-span-12 text-sm-m lg:text-m leading-tight font-heavy border-solid border-gray border-b mb-ml pb-3',
      accordionToggleContainer:
        'group flex flex-row grow w-full self-justify relative hover:cursor-pointer',
      accordionHeadline: 'w-full flex',
      readQuestion:
        'lg:inline mr-m mb-xxs lg:mb-0 text-xs font-heavy font-sans group-hover:underline',
      readQuestionCount:
        'lg:inline mr-m mb-xxs lg:mb-0 text-xs font-medium font-sans group-hover:font-regular group-hover:no-underline',
      accordionRatingContainer: 'inline mr-m',
      accordionToggleIndicator:
        'flex items-center justify-center inline-flex absolute right-0 top-[calc(50%-1rem)] h-8 w-8 rounded-full border-2 border-primary group-hover:bg-primary group-hover:text-white',
      iconClass: `inline`,
      contentOpen: '',
      contentClosed: 'h-0 overflow-hidden',
    },
  },
  rba: {},
};
