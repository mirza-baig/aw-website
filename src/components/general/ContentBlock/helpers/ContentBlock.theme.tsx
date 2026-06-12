'use client';
import classNames from 'classnames';
import { ButtonVariants } from 'helpers/Button/types';
import { ThemeFile } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';

import { BackgroundColor } from './ContentBlock.types';

const getDynamicButtonStyles = (backgroundColor: BackgroundColor): string => {
  return classNames(`${backgroundColor === 'black' ? 'text-primary' : ''}`);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getCTAPadding = (ctaStyle: any) => {
  let padding = '';
  if (getEnum<ButtonVariants>(ctaStyle) === 'link') {
    padding = 'ml-0 px-s md:px-0';
  } else if (getEnum<ButtonVariants>(ctaStyle) === 'link-right-icon') {
    padding = 'ml-0 px-s md:px-0 pr-[50px]!';
  }
  return padding;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ContentBlockTheme = (backgroundColor: BackgroundColor, fields: any): ThemeFile => {
  return {
    aw: {
      classes: {
        contentWrapper: classNames(
          backgroundColor !== 'white' ? 'py-l' : '',
          'col-span-12',
          'px-m',
          'md:w-full',
          'md:max-w-(--breakpoint-lg)',
          'md:mx-auto'
        ),
        headlineClass: 'text-theme-text text-sm-m md:text-m font-bold mb-s',
        bodyClass: 'text-theme-body mb-s',
        buttonGroupClass: {
          wrapper: 'flex-col w-fit',
          cta1Classes: classNames(
            getDynamicButtonStyles(backgroundColor),
            getCTAPadding(fields?.cta1Style),
            'mb-m md:mb-0 w-auto'
          ),
          cta2Classes: classNames(
            getDynamicButtonStyles(backgroundColor),
            getCTAPadding(fields?.cta2Style),
            ' w-auto'
          ),
          cta3Classes: classNames(getCTAPadding(fields?.cta3Style), ' mt-6 md:mt-0 w-auto'),
        },
      },
    },
    rba: {
      classes: {
        contentWrapper: classNames(
          backgroundColor !== 'white' ? 'py-l' : '',
          'col-span-12',
          'px-m',
          'md:w-full',
          'md:max-w-(--breakpoint-lg)',
          'md:mx-auto'
        ),
        headlineClass: 'text-theme-text text-sm-m md:text-m font-medium mb-s',
        bodyClass: 'text-theme-body mb-s',
        buttonGroupClass: {
          wrapper: 'flex-col w-fit',
          cta1Classes: classNames(
            getCTAPadding(fields?.cta1Style),
            getDynamicButtonStyles(backgroundColor),
            'mr-2 w-auto'
          ),
          cta2Classes: classNames(
            getDynamicButtonStyles(backgroundColor),
            getCTAPadding(fields?.cta2Style),
            'my-s md:my-0 w-auto'
          ),
          cta3Classes: classNames(getCTAPadding(fields?.cta3Style), ' md:mt-0 w-auto'),
        },
      },
    },
  };
};
