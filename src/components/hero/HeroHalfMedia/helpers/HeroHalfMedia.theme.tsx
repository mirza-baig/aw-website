'use client';
// Lib
import classNames from 'classnames';
import { ThemeFile } from 'lib/context/ThemeContext';

const getCopyContainerClass = (theme: string, ctaRightAlign: boolean): string => {
  let copyContainerClass = 'col-span-12 ml:col-span-6 ml:flex ml:flex-col ml:self-center';

  switch (theme) {
    case 'aw':
      copyContainerClass = classNames(copyContainerClass, 'p-m pt-s ml:pt-m ml:px-xl xl:px-xxl');
      break;
    case 'rba':
      copyContainerClass = classNames(copyContainerClass, 'px-[25px] py-m ml:px-xl xl:px-[100px]');
      break;
    default:
      break;
  }

  if (ctaRightAlign) {
    copyContainerClass = classNames(copyContainerClass, 'ml:-order-1');
  }

  return copyContainerClass;
};

const getCopyContainerClassWithOutLeftMargin = (theme: string, ctaRightAlign: boolean): string => {
  let copyContainerClassWithOutLeftMargin =
    'col-span-12 ml:col-span-6 ml:flex ml:flex-col ml:self-center';

  switch (theme) {
    case 'aw':
      copyContainerClassWithOutLeftMargin = classNames(
        copyContainerClassWithOutLeftMargin,
        'p-m pt-s ml:pt-m'
      );
      break;
    case 'rba':
      copyContainerClassWithOutLeftMargin = classNames(
        copyContainerClassWithOutLeftMargin,
        'px-[25px] py-m'
      );
      break;
    default:
      break;
  }

  if (ctaRightAlign) {
    copyContainerClassWithOutLeftMargin = classNames(
      copyContainerClassWithOutLeftMargin,
      'ml:-order-1'
    );
  }

  return copyContainerClassWithOutLeftMargin;
};
const getImageContainerClass = (): string => {
  return classNames('col-span-12', 'ml:col-span-6', 'ml:content-right', 'ml:items-right');
};

export const HeroHalfMediaTheme = (ctaRightAlign: boolean, hasBodyCopy: boolean): ThemeFile => {
  return {
    aw: {
      classes: {
        firstHeadline: {
          headlineContainer: `text-theme-text text-sm-l ml:text-l font-heavy ${
            hasBodyCopy ? 'mb-2' : 'mb-m'
          } last:mb-0`,
          alignment: 'center',
        },
        eyebrowClass: {
          eyebrowContainer: `text-theme-text text-sm-xxs text-xxs uppercase mb-s`,
        },
        contentClasses: {
          body: `text-theme-body text-body font-regular mb-m last:mb-0`,
          imageContainerClass: getImageContainerClass(),
          copyContainerClass: getCopyContainerClass('aw', ctaRightAlign),
          copyContainerClassWithOutLeftMargin: getCopyContainerClassWithOutLeftMargin(
            'aw',
            ctaRightAlign
          ),
        },
        buttonGroupClass: {
          wrapper: classNames(
            'col-span-12',
            'flex',
            'flex-col',
            'ml:flex-row',
            'items-start',
            'gap-xs',
            'ml:gap-0'
          ),
          cta1Classes: classNames('ml:mr-3 ml:first:ml-0 ml:last:mr-0'),
          cta2Classes: '',
        },
      },
    },
    rba: {
      classes: {
        firstHeadline: {
          headlineContainer: `text-theme-text text-s ml:text-l font-medium ${
            hasBodyCopy ? 'mb-[5px] ml:mb-2' : 'mb-s'
          } last:mb-0`,
          alignment: 'center',
        },
        eyebrowClass: {
          eyebrowContainer: `text-theme-text text-sm-xxs text-xxs uppercase mt-s mb-s`,
        },
        contentClasses: {
          body: `text-theme-body text-body font-regular mb-s last:mb-0`,
          imageContainerClass: getImageContainerClass(),
          copyContainerClass: getCopyContainerClass('rba', ctaRightAlign),
          copyContainerClassWithOutLeftMargin: getCopyContainerClassWithOutLeftMargin(
            'rba',
            ctaRightAlign
          ),
        },
        buttonGroupClass: {
          wrapper: classNames('col-span-12', 'flex', 'flex-col', 'ml:flex-row', 'items-start'),
          cta1Classes: classNames('ml:mr-3 ml:first:ml-0 ml:last:mr-0'),
          cta2Classes: 'my-s md:my-0',
        },
      },
    },
  };
};
