import { ThemeFile } from 'lib/context/ThemeContext';

import { ButtonCardTheme } from './FormFields.ButtonCard.Theme';
import { getCheckboxTheme } from './FormFields.Checkbox.Theme';
import { TileButtonTheme } from './FormFields.TileButton.Theme';
export const FormFieldsTheme: ThemeFile = {
  aw: {
    classes: {
      label: 'text-body font-regular flex w-full items-center',
      subLabel: 'text-theme-text [&_.body-copy]:text-small! mt-xxxs',
      input:
        'flex h-12 w-full rounded-none border border-gray outline-none focus:ring-0 focus:border-2 focus:border-black py-xs pr-xs pl-xxs text-sm-xs font-regular placeholder:text-dark-gray',
      textarea:
        'block min-h-auto w-full rounded-none border border-gray outline-none focus:ring-0 focus:border-2 focus:border-black py-xs pr-xs pl-xxs text-sm-xs font-regular placeholder:text-dark-gray',
      textareaCharCount: 'font-serif text-small font-regular mt-xxs',
      headline: 'md:text-m font-medium text-sm-s',
      description: 'font-serif text-body font-regular text-dark-gray',
      disclaimerText: 'font-serif text-legal text-regular text-dark-gray body-copy',
      errorOutline: 'border-error-outline border-2! focus:border-error-outline ',
      errorTextColor: 'text-error-outline',
      errorMessage: 'text-small font-regular flex mt-xxxs',
      eyebrow: 'text-black font-serif md:text-xxs text-sm-xxs font-heavy uppercase',
      buttonCard: ButtonCardTheme('aw'),
      tileButton: TileButtonTheme('aw'),
      checkbox: getCheckboxTheme('aw'),
      bodyText: 'font-serif text-body font-regular',
      radio:
        'flex border-dark-gray border-2 focus:text-black text-black checked:ring-black! checked:outline-offset-0! checked:ring-offset-2! focus:ring-offset-2 checked:ring-offset-2! checked:ring-offset-white! checked:ring-black! checked:bg-none',
      consentText: 'font-serif text-body font-regular body-copy',
    },
  },
  rba: {
    classes: {
      label: 'text-body font-regular inline-flex items-center',
      subLabel: 'text-theme-text [&_.body-copy]:text-small! mt-xxxs',
      input:
        'flex h-12 w-full rounded-none border border-dark-gray outline-none focus:ring-0 focus:border-2 focus:border-black py-xs pr-xs pl-xxs text-sm-xs font-regular placeholder:text-dark-gray',
      textarea:
        'block min-h-auto w-full rounded-none border border-dark-gray outline-none focus:ring-0 focus:border-2 focus:border-black py-xs pr-xs pl-xxs text-body font-regular placeholder:text-dark-gray',
      textareaCharCount: 'text-xxs fonst-serif font-regular mt-xxs',
      headingRuleLine:
        'before:block before:w-[64px] before:h-px before:bg-black before:mb-s  before:top-0 before:left-0',
      headline: 'font-sans md:text-m font-extra-light text-sm-s',
      description: 'font-serif text-body font-regular text-dark-gray',
      disclaimerText: 'font-serif text-[10px] leading-[16px] text-regular text-dark-gray',
      errorOutline: 'border-error-outline border-2! focus:border-error-outline ',
      errorTextColor: 'text-error-outline',
      errorMessage: 'text-small font-regular flex mt-xxxs',
      eyebrow: 'text-black font-serif md:text-xxs text-sm-xxs font-heavy uppercase text-left',
      buttonCard: ButtonCardTheme('rba'),
      radio:
        'flex border-dark-gray border-2 text-black focus:text-black checked:ring-black! checked:outline-offset-0! checked:ring-offset-2! focus:ring-offset-2 checked:ring-offset-2! checked:ring-offset-white! checked:ring-black! checked:bg-black! checked:bg-none',
      tileButton: TileButtonTheme('rba'),
      checkbox: getCheckboxTheme('rba'),
      bodyText: 'font-serif text-body font-regular',
      consentText: 'text-[10px]! leading-[16px]! font-regular font-serif text-dark-gray',
    },
  },
};
