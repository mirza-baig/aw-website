import { ThemeFile } from 'lib/context/ThemeContext';

export const FormStructureTheme = (): ThemeFile => {
  return {
    aw: {
      classes: {
        stepsWrapper: 'relative mb-m',
        stepLabel: 'mb-xxs block text-center font-sans text-button font-semibold',
      },
    },
    rba: {
      classes: {
        stepsWrapper: 'relative mb-s',
        stepLabel: 'mb-xxs block text-center font-serif text-xs font-bold',
      },
    },
  };
};
