// Lib
import { ThemeName } from 'lib/context/ThemeContext';

export const ButtonCardTheme = (themeName: ThemeName) => {
  switch (themeName) {
    case 'aw':
      return {
        buttonCardItemSelected:
          '[&:checked+.button-card-item]:bg-white md:[&:checked+.button-card-item]:bg-light-gray [&:checked+.button-card-item]:before:border-primary [&:checked+.button-card-item]:before:border-4 md:[&:checked+.button-card-item]:before:border-[6px] [&:checked+.button-card-item_.button-description]:text-black!',
        buttonCardItem:
          'button-card-item relative flex flex-row items-center inline-flex bg-light-gray p-xxs before:content-[""] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:border before:border-gray hover:cursor-pointer hover:before:border-black hover:before:border-2 before:rounded-[10px] h-full max-h-[255px] w-full',
        buttonCardItemDesktop:
          'md:flex-col md:justify-center md:py-ml min-h-[64px] md:min-h-[255px]',
        image: 'md:mb-m mr-xxs md:mr-0 relative',
        title: 'font-sans text-button md:text-xs font-heavy md:text-center mb:xxxs md:mb-xxxs',
        description: 'button-description md:text-center text-body text-dark-gray',
      };
    case 'rba':
      return {
        buttonCardItemSelected:
          '[&:checked+.button-card-item]:before:border-primary [&:checked+.button-card-item]:before:border-4 md:[&:checked+.button-card-item]:before:border-[6px] [&:checked+.button-card-item_.button-description]:text-black!',
        buttonCardItem:
          'button-card-item relative flex flex-row items-center inline-flex bg-light-gray p-xxs before:content-[""] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:border before:border-gray hover:cursor-pointer hover:before:border-black hover:before:border-2 before:rounded-[5px] md:before:rounded-[10px] h-full max-h-[255px] w-full',
        buttonCardItemDesktop:
          'md:flex-col md:justify-center md:py-ml min-h-[64px] md:min-h-[255px]',
        image: 'md:mb-m mr-xxs md:mr-0 relative',
        title: 'text-xs font-heavy md:font-bold md:text-center mb:xxxs md:mb-xxxs',
        description: 'button-description md:text-center text-body text-dark-gray',
      };
  }
};
