import classNames from 'classnames';
import { ThemeFile } from 'lib/context/ThemeContext';

import { Sitecore } from '.sitecore/AndersenWindows.model';

export type ContentBlockWithMediaAndProductProps =
  Sitecore.Components.General.ContentBlockWithMedia.ContentBlockWithMedia;
const getImageContainerClasses = (props: ContentBlockWithMediaAndProductProps): string => {
  return props.fields?.primaryImage?.value?.src && props.fields?.secondaryImage?.value?.src
    ? classNames('grid grid-cols-1 md:grid-cols-10 md:gap-s doubleimgvariation')
    : classNames('grid grid-cols-1 md:grid-cols-10 md:gap-s singleimgvariation');
};

export const ContentBlockWithMediaAndProductTheme = (
  props: ContentBlockWithMediaAndProductProps
): ThemeFile => {
  return {
    aw: {
      classes: {
        headingContainer: 'col-span-12',
        headlineContainer: 'text-s md:text-m font-heavy pb-xxs md:pb-s mb-m ',
        headlineContainerMobile: 'text-lg pb-xxs pb-s font-bold ',
        headlineContainerProductDescription:
          'text-s md:text-s font-heavy pb-xxs md:pb-s text-center',
        headlineContainerProductUsed:
          'text-s md:text-s font-sans text-left font-bold pb-2.5 text-center',
        topCopyContainer: 'pb-s font-regular font-serif text-theme-body',
        productDescription:
          'pb-s font-regular font-serif text-base font-heavy text-center pt-[16px]',
        productDescriptionMobile: 'pb-s font-regular font-serif text-base font-heavy text-center',
        topCopySubtitle: 'font-regular text-theme-body font-extrabold text-black',
        bodyContainer: 'col-span-12 font-regular font-serif mb-s',
        imageOuterContainer: classNames('mb-m col-span-4 '),
        imageOuterContainerSecond: classNames('mb-m col-span-8 '),
        imageContainer: classNames('img-container', getImageContainerClasses(props)),
        captionContainer: 'mt-xxs italic text-left mb-s font-sans text-sm-xxs md:text-caption',
        contentWrapper: classNames(
          'col-span-12',
          'md:w-full',
          'md:max-w-(--breakpoint-lg)',
          'md:mx-auto'
        ),
        buttonGroupClass: {
          wrapper: 'flex-col',
          cta1Classes: classNames('mb-6 md:mb-0'),
          cta2Classes: classNames('mb-6 md:mb-0'),
          cta3Classes: 'mb-m md:mb-0',
        },
      },
    },
    rba: {},
  };
};
