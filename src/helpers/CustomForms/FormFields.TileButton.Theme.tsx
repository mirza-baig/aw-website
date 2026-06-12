import { ThemeName } from 'lib/context/ThemeContext';

export const TileButtonTheme = (themeName: ThemeName) => {
  switch (themeName) {
    case 'aw':
      return {
        tileButtonLayout: 'grid gap-x-s md:grid-cols-12',
        tileButtonContainer: 'relative col-span-12 flex',
        tileButtonCheckboxSelected:
          '[&:checked+.button-card-item]:bg-white! md:[&:checked+.button-card-item]:bg-light-gray [&:checked+.button-card-item]:before:border-primary [&:checked+.button-card-item]:before:border-4 md:[&:checked+.button-card-item]:before:border-[6px] [&:checked+.button-card-item_.button-description]:text-black!',
        tileButtonRadioSelected:
          '[&:checked+.button-card-item]:before:border-2 [&:checked+.button-card-item]:before:border-black [&:checked+.button-card-item_.radio]:border-black [&:checked+.button-card-item_.radio]:before:inline-block',
        tileButtonItem:
          'group button-card-item relative flex flex-row bg-light-gray p-s before:content-[""] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:border-2 before:border-gray hover:cursor-pointer hover:before:border-black before:rounded-[10px] w-full break-all min-h-[64px]',
        tileButtonItemDesktop: 'md:flex-col md:justify-center',
        tileButtonCheckboxItem: 'items-center justify-center',
        tileButtonRadioItem: 'items-start',
        tileButtonItemContent: 'flex items-center',
        tileButtonItemRadio:
          'radio relative bg-white min-w-[32px] min-h-[32px] rounded-full border-2 border-gray group-hover:border-black mr-s before:hidden before:content-[""] before:absolute before:w-[24px] before:h-[24px] before:bg-primary before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full',
        title: 'md:text-xs break-normal font-heavy font-sans md:text-center px-s text-button',
      };
    case 'rba':
      return {
        tileButtonLayout: 'grid gap-x-s md:grid-cols-12',
        tileButtonContainer: 'relative col-span-12 flex',
        tileButtonCheckboxSelected:
          '[&:checked+.button-card-item]:before:border-primary [&:checked+.button-card-item]:before:border-4 md:[&:checked+.button-card-item]:before:border-[6px] [&:checked+.button-card-item_.button-description]:text-black!',
        tileButtonRadioSelected:
          '[&:checked+.button-card-item]:before:border-2 [&:checked+.button-card-item]:before:border-black [&:checked+.button-card-item_.radio]:border-black [&:checked+.button-card-item_.radio]:before:inline-block',
        tileButtonItem:
          'group button-card-item relative flex flex-row bg-light-gray p-s before:content-[""] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:border-2 before:border-gray hover:cursor-pointer hover:before:border-black rounded-[100px] before:rounded-[100px] w-full break-all min-h-[64px]',
        tileButtonItemDesktop: 'md:flex-col md:justify-center',
        tileButtonCheckboxItem: 'items-center justify-center',
        tileButtonRadioItem: 'items-start',
        tileButtonItemContent: 'flex items-center pr-s',
        tileButtonItemRadio:
          'radio relative bg-white min-w-[32px] min-h-[32px] rounded-full border-2 border-gray group-hover:border-black mr-s before:hidden before:content-[""] before:absolute before:w-[20px] before:h-[20px] before:bg-primary before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full',
        title: 'text-xs break-normal font-heavy md:text-center px-s mb:xxxs',
      };
  }
};
