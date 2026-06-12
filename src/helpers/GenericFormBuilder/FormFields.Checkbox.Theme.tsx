import classNames from 'classnames';
import { ThemeName } from 'lib/context/ThemeContext';

export const getCheckboxTheme = (themeName: ThemeName) => {
  switch (themeName) {
    case 'aw':
      return {
        input: classNames(
          'peer relative h-[20px] w-[20px] cursor-pointer appearance-none bg-none! checked:bg-black checked:hover:bg-black checked:focus:bg-black',
          'border-dark-gray checked:border-black! hover:border-black',
          'outline-none focus:border-black focus:bg-gray focus:ring-0 focus:ring-offset-0',
          'disabled:border-gray'
        ),
        customTickIcon:
          'pointer-events-none absolute stroke-transparent text-transparent peer-checked:stroke-white peer-checked:text-white',
        invalidInput:
          'border-2 !border-error-outline hover:border-error-outline checked:hover:border-black',
      };

    case 'rba':
      return {
        input: classNames(
          'peer relative h-[20px] w-[20px] cursor-pointer appearance-none bg-none! checked:bg-black checked:hover:bg-black checked:focus:bg-black',
          'border-dark-gray checked:border-black! hover:border-black',
          'outline-none focus:border-black focus:bg-gray focus:ring-0 focus:ring-offset-0',
          'disabled:border-gray'
        ),
        customTickIcon:
          'pointer-events-none absolute stroke-transparent text-transparent peer-checked:stroke-white peer-checked:text-white',
        invalidInput:
          'border-2 !border-error-outline hover:border-error-outline checked:hover:border-black',
      };
  }
};
