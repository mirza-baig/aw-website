// Lib
import { ThemeFile } from 'lib/context/ThemeContext';

export const FieldWrapperTheme: ThemeFile = {
  aw: {
    classes: {
      label: 'text-body font-regular flex w-full items-center',
      subLabel: 'text-theme-text [&_.body-copy]:text-small! mt-xxxs',
      errorOutline: 'border-error-outline border-2! focus:border-error-outline',
      errorTextColor: 'text-error-outline',
      errorMessage: 'text-small font-regular flex mt-xxxs',
    },
  },
  rba: {
    classes: {
      label: 'text-body font-regular inline-flex items-center',
      subLabel: 'text-theme-text [&_.body-copy]:text-small! mt-m',
      errorOutline: 'border-error-outline border-2! focus:border-error-outline',
      errorTextColor: 'text-error-outline',
      errorMessage: 'text-small font-regular flex mt-xxxs',
    },
  },
};
