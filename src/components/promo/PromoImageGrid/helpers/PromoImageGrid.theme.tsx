import classNames from 'classnames';
import { ThemeFile, ThemeName } from 'lib/context/ThemeContext';

const getWrapperAlignmentStyles = (alignRight: boolean): string => {
  return alignRight ? classNames('md:flex-row-reverse') : '';
};

const getCopyAlignmentStyles = (alignRight: boolean): string => {
  return alignRight ? classNames('md:ml-[18px]') : classNames('md:mr-[18px]');
};

const getEyebrowStyles = (theme: ThemeName, isMobileCarousel: boolean): string => {
  if (theme === 'aw') {
    return isMobileCarousel
      ? classNames('font-sans text-dark-gray text-xxs uppercase mt-xxs mb-s md:mt-0')
      : classNames('font-sans text-dark-gray text-xxs uppercase mt-m mb-s md:mt-0');
  } else {
    return isMobileCarousel
      ? classNames('mb-xxs font-bold uppercase text-xxs')
      : classNames('mt-s mb-xxs font-bold uppercase text-xxs');
  }
};

export const PromoImageGridTheme = (
  copyAlignRight: boolean,
  mobileCarousel: boolean
): ThemeFile => {
  return {
    aw: {
      classes: {
        componentWrapper: classNames(
          'col-span-12 flex flex-col-reverse md:flex-row',
          getWrapperAlignmentStyles(copyAlignRight)
        ),
        copyStyle: classNames(
          'flex w-full md:w-1/2 md:items-center md:justify-center ml:w-1/4',
          getCopyAlignmentStyles(copyAlignRight)
        ),
        eyebrowClass: getEyebrowStyles('aw', mobileCarousel),
        headlineClass: 'font-heavy text-s mb-s md:text-m md:mb-s',
        bodyClass: 'text-dark-gray',
        buttonClasses: 'mt-m md:mt-l',
        mobileThreeImageGrid: 'grid w-full grid-cols-2 gap-s',
      },
    },
    rba: {},
  };
};
