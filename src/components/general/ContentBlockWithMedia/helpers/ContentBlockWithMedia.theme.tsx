/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from 'classnames';
import { ButtonVariants } from 'helpers/Button/types';
import { ThemeFile } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';

import { ContentBlockWithMediaProps } from './ContentBlockWithMediaAW';

const getImageContainerClasses = (props: ContentBlockWithMediaProps): string => {
  const hasPrimaryMedia = !!props.fields?.primaryImage?.value?.src || !!props.fields?.primaryVideo;
  const hasSecondaryMedia =
    !!props.fields?.secondaryImage?.value?.src || !!props.fields?.secondaryVideo;

  return hasPrimaryMedia && hasSecondaryMedia
    ? 'grid grid-cols-1 md:grid-cols-2 md:gap-s'
    : 'col-span-12';
};

const getTwoImageOneCaptionMode = (props: ContentBlockWithMediaProps): boolean => {
  const hasPrimaryMedia = !!props.fields?.primaryImage?.value?.src || !!props.fields?.primaryVideo;
  const hasPrimaryCaption = !!props.fields?.primaryImageCaption?.value;
  const hasSecondaryMedia =
    !!props.fields?.secondaryImage?.value?.src || !!props.fields?.secondaryVideo;
  const hasSecondaryCaption = !!props.fields?.secondaryImageCaption?.value;
  return hasPrimaryMedia && hasPrimaryCaption && hasSecondaryMedia && !hasSecondaryCaption;
};

const getImageOuterContainerClasses = (props: ContentBlockWithMediaProps): string => {
  return props.fields?.primaryImage?.value?.src && !props.fields?.secondaryImage?.value?.src
    ? classNames(`mx-auto text-center`)
    : '';
};

const getCTAPadding = (ctaStyle: any) => {
  let padding = '';
  if (getEnum<ButtonVariants>(ctaStyle) === 'link') {
    padding = 'ml-0 px-s md:px-0';
  } else if (getEnum<ButtonVariants>(ctaStyle) === 'link-right-icon') {
    padding = 'ml-0 px-s md:px-0 pr-[50px]!';
  }
  return padding;
};

// RBA-specific functions
const rbaGetImageContainerClasses = (props: ContentBlockWithMediaProps): string => {
  const hasPrimaryMedia = !!props.fields?.primaryImage?.value?.src || !!props.fields?.primaryVideo;
  const hasSecondaryMedia =
    !!props.fields?.secondaryImage?.value?.src || !!props.fields?.secondaryVideo;

  return hasPrimaryMedia && hasSecondaryMedia
    ? 'grid grid-cols-1 md:grid-cols-2 md:gap-s'
    : 'col-span-12 mx-auto';
};

const rbaGetTwoImageOneCaptionMode = (props: ContentBlockWithMediaProps): boolean => {
  const hasPrimaryMedia = !!props.fields?.primaryImage?.value?.src || !!props.fields?.primaryVideo;
  const hasPrimaryCaption = !!props.fields?.primaryImageCaption?.value;
  const hasSecondaryMedia =
    !!props.fields?.secondaryImage?.value?.src || !!props.fields?.secondaryVideo;
  const hasSecondaryCaption = !!props.fields?.secondaryImageCaption?.value;
  return hasPrimaryMedia && hasPrimaryCaption && hasSecondaryMedia && !hasSecondaryCaption;
};

const rbaGetImageOuterContainerClasses = (props: ContentBlockWithMediaProps): string => {
  return props.fields?.primaryImage?.value?.src && !props.fields?.secondaryImage?.value?.src
    ? classNames('mx-auto text-center w-full')
    : '';
};

const rbaGetCTAPadding = (ctaStyle: any) => {
  let padding = '';
  if (getEnum<ButtonVariants>(ctaStyle) === 'link') {
    padding = 'ml-0 px-s md:px-0';
  } else if (getEnum<ButtonVariants>(ctaStyle) === 'link-right-icon') {
    padding = 'ml-0 px-s md:px-0 pr-[50px]!';
  }
  return padding;
};

export const ContentBlockWithMediaTheme = (
  props: ContentBlockWithMediaProps,
  fields: any
): ThemeFile => {
  return {
    aw: {
      classes: {
        headingContainer: 'col-span-12',
        headlineContainer: 'text-s md:text-m font-heavy pb-xxs md:pb-s',
        topCopyContainer: 'pb-s font-regular font-serif text-theme-body',
        bodyContainer: 'col-span-12 font-regular font-serif mb-s text-theme-body',
        imageOuterContainer: classNames(
          getTwoImageOneCaptionMode(props) ? 'mb-m md:mb-0' : 'mb-m',
          getImageOuterContainerClasses(props)
        ),
        imageContainer: getImageContainerClasses(props),
        videoOuterContainer: 'w-full relative',
        captionContainer: 'mt-xxs italic text-left mb-s font-sans text-sm-xxs md:text-caption',
        contentWrapper: classNames(
          'col-span-12',
          'md:w-full',
          'md:max-w-(--breakpoint-lg)',
          'md:mx-auto'
        ),
        buttonGroupClass: {
          wrapper: 'flex-col w-fit',
          cta1Classes: classNames(getCTAPadding(fields?.cta1Style), 'mb-m md:mb-0 w-auto'),
          cta2Classes: classNames(getCTAPadding(fields?.cta2Style), 'mb-m md:mb-0 w-auto'),
          cta3Classes: classNames(getCTAPadding(fields?.cta3Style), 'mb-m md:mb-0 w-auto'),
        },
      },
    },
    rba: {
      classes: {
        headingContainer: 'col-span-12',
        headlineContainer: 'text-theme-text text-sm-m md:text-m font-medium mb-s',
        topCopyContainer: 'mb-s font-regular font-serif text-theme-body',
        bodyContainer: 'col-span-12 font-regular font-serif mb-s text-theme-body',
        imageOuterContainer: classNames(rbaGetImageOuterContainerClasses(props), 'sm:my-xs'),
        imageContainer: rbaGetImageContainerClasses(props),
        videoOuterContainer: 'w-full relative sm:my-xs',
        captionContainer: classNames(
          'mt-xxs md:mt-xxxs border-primary border-l-2 pl-xxs text-left mb-s text-sm-xxs md:text-body col-span-12 **:max-w-full',
          rbaGetTwoImageOneCaptionMode(props) ? 'mb-s md:mb-0' : 'mb-s'
        ),
        contentWrapper: classNames(
          'col-span-12',
          'md:w-full',
          'md:max-w-(--breakpoint-lg)',
          'md:mx-auto'
        ),
        buttonGroupClass: {
          wrapper: 'flex-col w-fit',
          cta1Classes: classNames(rbaGetCTAPadding(fields?.cta1Style), 'mb-m md:mb-0 w-auto'),
          cta2Classes: classNames(
            rbaGetCTAPadding(fields?.cta2Style),
            'mb-m md:mb-0 w-auto md:grow-0'
          ),
          cta3Classes: classNames(rbaGetCTAPadding(fields?.cta3Style), 'mb-m md:mb-0 w-auto'),
        },
      },
    },
  };
};
