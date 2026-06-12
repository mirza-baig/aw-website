import classNames from 'classnames';
import { ThemeFile, ThemeName } from 'lib/context/ThemeContext';

type ComponentStyle = 'brand-color-solid' | 'black-outline' | 'black-solid' | 'brand-color-outline';

const getAWTextAlignment = (hasImage: boolean, ctaRightAlign: boolean): string => {
  if (hasImage) {
    return `text-start`;
  } else if (ctaRightAlign) {
    return `text-center md:text-start`;
  }

  return `text-center`;
};

const getAWCopyContainerClass = (
  hasImage: boolean,
  ctaRightAlign: boolean,
  ctaCount: number
): string => {
  let copyContainerClass = 'col-span-12 px-[15px] py-m';

  copyContainerClass = classNames(copyContainerClass, 'flex flex-col');

  if (ctaRightAlign) {
    copyContainerClass = classNames(copyContainerClass, 'md:-order-1');
  }

  if (hasImage) {
    copyContainerClass = classNames(
      copyContainerClass,
      'text-center',
      'md:col-span-8',
      'px-[15px]',
      'lg:px-m',
      'lg:py-[46.5px]',
      'items-start'
    );
  } else if (ctaRightAlign) {
    copyContainerClass = classNames(
      copyContainerClass,
      'text-center',
      'lg:p-[32px]',
      'items-center',
      'md:items-start'
    );

    if (ctaCount > 0) {
      copyContainerClass = classNames(copyContainerClass, 'md:col-span-8');
    }
  } else {
    copyContainerClass = classNames(
      copyContainerClass,
      'lg:px-17',
      'lg:pt-l',
      'lg:pb-l',
      'items-center',
      'md:col-span-12',
      'text-center'
    );
  }

  copyContainerClass = classNames(copyContainerClass, 'bg-theme-bg', 'text-theme-text');
  return copyContainerClass;
};

const getAWContentWrapperClass = (componentStyle: ComponentStyle): string => {
  let contentWrapperClass = 'col-span-12 grid grid-cols-2 md:grid-cols-12';

  switch (componentStyle) {
    case 'brand-color-solid':
      contentWrapperClass = classNames(contentWrapperClass, 'bg-primary', 'text-white');
      break;
    case 'brand-color-outline':
      contentWrapperClass = classNames(contentWrapperClass, 'border-2 border-primary');
      break;
    case 'black-solid':
      contentWrapperClass = classNames(contentWrapperClass, 'bg-secondary', 'text-white');
      break;
    case 'black-outline':
      contentWrapperClass = classNames(contentWrapperClass, 'border-2', 'border-secondary');
      break;
    default:
      break;
  }
  return classNames(contentWrapperClass);
};

const getImageContainerClass = (theme: ThemeName): string => {
  switch (theme) {
    case 'aw':
      return classNames('col-span-12', 'md:col-span-4');
    case 'rba':
      return classNames('col-span-12', 'md:col-span-6', 'px-0');
    default:
      break;
  }
  return classNames('col-span-12', 'md:col-span-4');
};

const getAWCtaContainerClass = (
  hasImage: boolean,
  ctaRightAlign: boolean,
  ctaCount: number
): string => {
  let ctaContainerClass = classNames(
    'col-span-12',
    'flex',
    'flex-col',
    'md:flex-row',
    'md:content-center',
    'md:justify-center',
    'mb-0'
  );

  if (hasImage) {
    ctaContainerClass = classNames(
      ctaContainerClass,
      'items-start',
      'mt-m',
      'mb-s',
      'md:mt-[32px]'
    );
  } else if (ctaRightAlign) {
    ctaContainerClass = classNames(ctaContainerClass, 'items-center');
    ctaContainerClass = classNames(ctaContainerClass, 'pt-s pr-s pl-s pb-m md:p-m');

    if (ctaCount > 1) {
      ctaContainerClass = classNames(ctaContainerClass, 'md:col-span-4');
    } else if (ctaCount > 0) {
      ctaContainerClass = classNames(
        ctaContainerClass,
        'md:col-span-4 mmd:whitespace-nowrap md:place-content-end!'
      );
    }
    ctaContainerClass = classNames(ctaContainerClass, 'bg-theme-bg', 'text-theme-text');
  } else {
    ctaContainerClass = classNames(ctaContainerClass, 'items-center mt-m');
  }

  return ctaContainerClass;
};

const getAWCtaExtraClass = (): string => {
  const baseClasses = classNames('mt-s first:mt-0 md:mt-0 mr-0 md:mr-3 md:first:ml-0 md:last:mr-0');
  return classNames(baseClasses);
};

const getAWBodyCopyPadding = (hasImage: boolean, ctaRightAlign: boolean): string => {
  let baseClasses: string;

  if (hasImage) {
    baseClasses = classNames('mt-m md:mt-s');
  } else if (ctaRightAlign) {
    baseClasses = classNames('mt-[10px]');
  } else {
    baseClasses = classNames('mt-m');
  }

  return classNames(baseClasses);
};

const getAWSubheadlinePadding = (): string => {
  const baseClasses = classNames('mt-2');
  return classNames(baseClasses);
};

export const themePromoBannerAuthored = (
  componentStyle: ComponentStyle,
  ctaRightAlign: boolean,
  hasImage: boolean,
  ctaCount: number
): ThemeFile => {
  return {
    aw: {
      classes: {
        firstHeadline: {
          headlineContainer: `text-s md:text-m font-heavy text-theme-text ${getAWTextAlignment(
            hasImage,
            ctaRightAlign
          )}`,
          alignment: 'center',
        },
        contentClasses: {
          subHeadlineContainer: `text-sm-m lg:text-s font-medium ${getAWSubheadlinePadding()} text-theme-text ${getAWTextAlignment(hasImage, ctaRightAlign)}`,
          body: `text-body text-theme-text font-medium ${getAWBodyCopyPadding(
            hasImage,
            ctaRightAlign
          )} ${getAWTextAlignment(hasImage, ctaRightAlign)}`,
          imageContainerClass: getImageContainerClass('aw'),
          imageRatio: 'hero',
          contentWrapperClass: getAWContentWrapperClass(componentStyle),
          copyContainerClass: getAWCopyContainerClass(hasImage, ctaRightAlign, ctaCount),
          legalCopyClass: `text-legal mt-xxs col-span-12 text-left`,
        },
        buttonGroupClass: {
          wrapper: getAWCtaContainerClass(hasImage, ctaRightAlign, ctaCount),
          cta1Classes: getAWCtaExtraClass(),
          cta2Classes: getAWCtaExtraClass(),
        },
      },
    },
    rba: {},
  };
};
