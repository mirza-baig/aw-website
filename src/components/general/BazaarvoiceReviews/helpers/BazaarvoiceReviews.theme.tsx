// Lib
import { ThemeFile } from 'lib/context/ThemeContext';

export const BazaarvoiceReviewsTheme: ThemeFile = {
  aw: {
    classes: {
      wrapperClass: 'flex flex-col col-span-12 border-solid border-gray border-y py-s lg:py-ml',
      headline: 'col-span-12 text-sm-m lg:text-m leading-tight font-heavy',
      accordionToggleContainer:
        'group flex flex-row grow w-full self-justify relative hover:cursor-pointer',
      accordionHeadline: 'w-full flex',
      readMore: `lg:inline mr-m mb-xxs lg:mb-0 text-xs font-heavy font-sans group-hover:underline`,
      accordionRatingContainer: `inline-block mr-m align-middle`,
      accordionToggleIndicator: `flex items-center justify-center inline-flex absolute right-0 top-[calc(50%-1rem)] h-8 w-8 rounded-full border-2 border-primary group-hover:bg-primary group-hover:text-white`,
      iconClass: `inline`,
      contentOpen: '',
      contentClosed: 'h-0 overflow-hidden',
    },
  },
  rba: {},
};
