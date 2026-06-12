// Lib
import classNames from 'classnames';
import { ComponentBackgroundVariants } from 'helpers/Component/Component';
import { ThemeFile } from 'lib/context/ThemeContext';

const getAWCopyContainerClass = (hasImage: boolean): string => {
  let copyContainerClass = 'col-span-12 flex flex-col lg:self-center z-1 p-6';

  if (hasImage) {
    copyContainerClass = classNames(copyContainerClass, 'lg:mr-[20px] lg:col-span-6');
  } else {
    copyContainerClass = classNames(copyContainerClass, 'items-center', 'text-center');
  }

  return copyContainerClass;
};

const getRBACopyContainerClass = (hasImage: boolean): string => {
  let copyContainerClass = 'col-span-12 lg:flex lg:flex-col lg:self-center z-1 lg:max-w-screen-ml';

  if (hasImage) {
    copyContainerClass = classNames(copyContainerClass, 'lg:pl-l', 'lg:col-span-7', 'lg:h-full');
  } else {
    copyContainerClass = classNames(copyContainerClass, 'items-start', 'lg:mx-auto');
  }

  return copyContainerClass;
};

const getBaseImageContainerClass = (): string => {
  return classNames('col-span-12', 'lg:content-right', 'lg:items-right');
};

const getAWImageContainerClass = (): string => {
  return classNames(
    getBaseImageContainerClass(),
    'lg:col-span-6',
    'mt-m',
    'lg:mt-0',
    'lg:ml-[20px]'
  );
};

const getRBAImageContainerClass = (): string => {
  return classNames(
    getBaseImageContainerClass(),
    'lg:col-span-5',
    'lg:-order-1',
    'mt-xs',
    'lg:mt-0'
  );
};

const getRBAQuoteClass = (style: ComponentBackgroundVariants): string => {
  const cssClass = 'absolute hidden lg:inline lg:pt-s w-[200px] h-[150px]';

  switch (style) {
    case 'black':
      return classNames(cssClass, 'opacity-[.15] fill-white text-white');
    case 'white':
      return classNames(cssClass, 'opacity-[.05] fill-black text-black');
    case 'gray':
      return classNames(cssClass, 'opacity-[.05] fill-black text-black');
    default:
      break;
  }
  return cssClass;
};

export const PromoReviewContentAuthoredTheme = (
  hasImage: boolean,
  style: ComponentBackgroundVariants
): ThemeFile => {
  return {
    aw: {
      classes: {
        firstHeadline: {
          headlineContainer: `text-theme-text text-sm-m lg:text-m font-medium`,
          headlineOutsideContainer: `${
            hasImage ? 'ml-0!' : 'justify-center'
          } text-theme-text text-sm-m lg:text-m font-medium lg: mb-2!  lg:mx-auto lg:max-w-5xl lg:px-0`,
        },
        contentClasses: {
          componentClass: `p-m ${hasImage ? 'pt-s' : 'pt-m'} lg:pt-m lg:px-0 lg:mx-auto max-w-5xl`,
          starContainerClass: ``,
          body: `text-theme-body text-sm-xxs leading-4.5 lg:text-body lg:leading-4.5 font-regular lg:max-w-3xl mt-m`,
          imageContainerClass: getAWImageContainerClass(),
          copyContainerClass: getAWCopyContainerClass(hasImage),
          reviewerNameClass: `text-theme-text text-sm-xxs leading-[1em] lg:text-xxs lg:leading-[1em] mt-m font-heavy`,
          additionalInfoClass: `text-theme-text text-sm-xxs leading-4.5 lg:text-xxs lg:leading-4.5 mt-2`,
          quoteClass: ``,
        },
        buttonGroupClass: {
          wrapper: classNames('col-span-12', 'flex', 'flex-col', 'lg:flex-row', 'items-start'),
          cta1Classes: classNames(
            'lg:mr-3 lg:first:ml-0 lg:last:mr-0',
            'bg-theme-btn-bg text-theme-btn-text'
          ),
          cta2Classes: '',
        },
      },
    },
    rba: {
      classes: {
        firstHeadline: {
          headlineContainer: `text-theme-text text-s lg:text-m`,
          headlineOutsideContainer: `text-theme-text text-sm-m lg:text-l font-extra-light -mb-s lg:-mb-[10px] mt-8 lg:mx-auto lg:max-w-(--breakpoint-lg) px-m lg:px-0`,
        },
        contentClasses: {
          componentClass: `px-m pt-s pb-m lg:px-0 lg:py-ml relative lg:mx-auto max-w-(--breakpoint-lg)`,
          starContainerClass: `lg:mt-xxs`,
          body: `font-sans text-theme-body text-body lg:text-s font-extra-light mt-[7px] ${
            hasImage ? 'grow lg:mt-[10px]' : 'lg:mt-[9px]'
          }`,
          imageContainerClass: getRBAImageContainerClass(),
          copyContainerClass: getRBACopyContainerClass(hasImage),
          reviewerNameClass: `text-theme-text text-body font-bold h-[18px] ${
            hasImage ? 'mt-[7px]' : 'mt-[7px] lg:mt-[11px]'
          }`,
          additionalInfoClass: `text-theme-text text-body h-[18px] ${
            hasImage ? 'mt-px lg:mt-0' : 'mt-px'
          } lg:mb-[5px]`,
          quoteClass: getRBAQuoteClass(style),
        },
        buttonGroupClass: {
          wrapper: classNames('col-span-12', 'flex', 'flex-col', 'lg:flex-row', 'items-start'),
          cta1Classes: classNames(
            'lg:mr-3 lg:first:ml-0 lg:last:mr-0',
            'bg-theme-btn-bg text-theme-btn-text'
          ),
          cta2Classes: 'my-s md:my-0',
        },
      },
    },
  };
};
