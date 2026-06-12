import classNames from 'classnames';
import { ThemeFile } from 'lib/context/ThemeContext';

type StylingVariation = 'with image' | '';

const getAWCopyContainerClass = (
  stylingVariation: StylingVariation,
  topBorder: boolean,
  bottomBorder: boolean
): string => {
  let copyContainerClass =
    'col-span-12 lg:flex lg:flex-col lg:self-center lg:h-full lg:justify-center';

  if (stylingVariation === 'with image') {
    copyContainerClass = classNames(copyContainerClass, 'lg:col-span-4 lg:mr-s');
    if (topBorder) {
      copyContainerClass = classNames(copyContainerClass, 'lg:border-b lg:border-b-gray');
    }
  }

  const topBorderClass = topBorder ? 'border-solid border-t border-black' : 'px-xxs';
  const noTopBorderWithImage = !topBorder && stylingVariation != 'with image' ? 'lg:px-s' : '';
  const bottomBorderClass = bottomBorder ? 'border-b border-b-gray' : '';
  copyContainerClass = classNames(
    copyContainerClass,
    topBorderClass,
    noTopBorderWithImage,
    bottomBorderClass,
    'py-m'
  );

  return copyContainerClass;
};

const getRBACopyContainerClass = (
  stylingVariation: StylingVariation,
  topBorder: boolean
): string => {
  let copyContainerClass =
    'col-span-12 lg:flex lg:flex-col lg:self-center lg:h-full lg:justify-center';

  if (stylingVariation === 'with image') {
    copyContainerClass = classNames(copyContainerClass, 'lg:col-span-4 lg:mr-s');

    if (!topBorder) {
      copyContainerClass = classNames(copyContainerClass, 'px-s lg:pl-l lg:pr-0');
    }
  }

  const topBorderClass = topBorder ? 'border-solid border-t border-black' : '';
  copyContainerClass = classNames(copyContainerClass, topBorderClass, 'py-s');

  return copyContainerClass;
};

const getAWImageContainerClass = (): string => {
  return classNames('col-span-12', 'lg:col-span-8', 'lg:content-right', 'lg:items-right');
};

const getRBAImageContainerClass = (): string => {
  return classNames('col-span-12', 'lg:col-span-8', 'lg:content-right', 'lg:items-right');
};

const getCaptionOffset = (showImage: boolean, hasCaption: boolean): string => {
  if (showImage && hasCaption) {
    return 'pb-px';
  }

  return '';
};

export const HeroBlogArticleTheme = (
  stylingVariation: StylingVariation,
  topBorder: boolean,
  bottomBorder: boolean,
  showImage: boolean,
  hasCaption: boolean
): ThemeFile => {
  return {
    aw: {
      classes: {
        contentClasses: {
          headlineContainer: `text-theme-text text-sm-m lg:text-m font-heavy mb-s last:mb-0`,
          eyebrowContainer: `font-sans text-theme-text text-sm-xxs text-xxs uppercase mb-s`,
          copyContainerClass: getAWCopyContainerClass(stylingVariation, topBorder, bottomBorder),
          body: `text-theme-body text-body font-regular mb-m last:mb-0`,
          imageContainerClass: getAWImageContainerClass(),
          captionClass: `absolute top-full left-0 `,
          sectionWrapperClasses: `mx-m lg:mx-0 ${getCaptionOffset(showImage, hasCaption)}`,
          buttonGroupClass: {
            wrapper: 'my-s md:my-xs',
            cta1Classes: 'text-black',
          },
        },
      },
    },
    rba: {
      classes: {
        contentClasses: {
          headlineContainer: `text-theme-text text-sm-m lg:text-l font-extra-light font-sans mb-xxs lg:mb-s last:mb-0`,
          eyebrowContainer: `font-serif text-theme-text text-sm-xxs text-xxs font-bold uppercase mb-xxs lg:mb-s`,
          copyContainerClass: getRBACopyContainerClass(stylingVariation, topBorder),
          body: `text-theme-body text-body font-regular mb-xxs lg:mb-s last:mb-0`,
          imageContainerClass: getRBAImageContainerClass(),
          captionClass: `absolute top-full left-0 `,
          sectionWrapperClasses: `${showImage ? 'mx-m' : 'mx-0'} lg:mx-0 ${getCaptionOffset(
            showImage,
            hasCaption
          )}`,
          buttonGroupClass: {
            wrapper: 'my-s md:my-xs',
            cta1Classes: 'md:bg-white md:text-black',
          },
        },
      },
    },
  };
};
