import classNames from 'classnames';
import { ThemeFile } from 'lib/context/ThemeContext';

import { TextAlignment } from './GenericCard.types';

const getHeadlineAlignmentStyles = (alignment: TextAlignment): string => {
  return alignment == 'center' ? classNames('justify-center') : '';
};

const getIconAlignmentStyles = (alignment: TextAlignment): string => {
  return alignment === 'center' ? 'mx-auto' : 'right-auto!';
};

const getTextAlignmentStyles = (alignment: TextAlignment): string => {
  return alignment == 'center' ? 'text-center' : 'text-left';
};

const getButtonWrapperStyles = (alignment: TextAlignment): string => {
  return alignment === 'center'
    ? 'mb-m col-span-12 flex flex-col md:justify-center items-center'
    : 'mb-m col-span-12 flex ';
};

export const GenericCardTheme = (alignment: TextAlignment): ThemeFile => {
  return {
    aw: {
      classes: {
        cardWrapper: 'flex grow flex-col',
        copyWrapper: classNames('flex grow flex-col mt-s', getTextAlignmentStyles(alignment)),
        eyebrow: 'text-sm-xs md:text-xs uppercase text-dark-gray mb-s font-regular',
        headline: classNames(
          'mb-xxs text-sm-s md:text-s font-heavy',
          getHeadlineAlignmentStyles(alignment)
        ),
        subheadline: 'mb-xxs text-sm-xs md:text-xs font-medium',
        body: 'text-theme-body text-body font-regular mb-s',
        buttonGroupClass: {
          wrapper: classNames('mb-s flex flex-col space-y-4', getButtonWrapperStyles(alignment)),
          cta1Classes: '',
        },
        iconClass: classNames('h-[80px] w-[80px]', getIconAlignmentStyles(alignment)),
        textAlignment: classNames(getTextAlignmentStyles(alignment)),
      },
    },
    rba: {},
  };
};
