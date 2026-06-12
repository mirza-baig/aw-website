// Lib
import { ThemeFile } from 'lib/context/ThemeContext';

export const FormTheme = (): ThemeFile => {
  return {
    aw: {
      classes: {
        form: '',
        steps: '',
        headline: 'md:text-m font-medium text-sm-s mb-s',
        description: 'font-serif text-body font-regular text-dark-gray mb-s',
      },
    },
    rba: {
      classes: {
        form: '',
        steps: '',
        headline: 'md:text-m font-light text-sm-s mb-s',
        description: 'font-serif text-body font-regular text-dark-gray mb-s',
      },
    },
  };
};
