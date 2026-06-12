'use client';

import { Text } from '@sitecore-content-sdk/nextjs';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import Component from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import ImagePrimary from 'helpers/Media/ImagePrimary';
import ModalWrapper from 'helpers/ModalWrapper/ModalWrapper';
import PhotoItemWithDetail, {
  PhotoItemWithDetailProps,
} from 'helpers/PhotoItemWithDetail/PhotoItemWithDetail';
import { getPhotoItemProps } from 'helpers/PhotoItemWithDetail/PhotoItemWithDetail.Utils';
import SingleButton from 'helpers/SingleButton/SingleButton';
import { SliderWrapper } from 'helpers/SliderWrapper';
import { SliderRefType, SliderType } from 'helpers/SliderWrapper/SliderWrapper';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';
import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import React, { JSX, useRef, useState } from 'react';

import { CuratedImageDisplayTheme } from './helpers/CuratedImageDisplay.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type ExtendedImageItem = Sitecore.BaseTemplates.BasePhoto & {
  url?: string;
  fields?: Sitecore.BaseTemplates.BasePhoto['fields'] & {
    Alt?: { value: string };
    Height?: { value: string };
    Width?: { value: string };
    alt?: { value: string };
    height?: { value: string };
    width?: { value: string };
  };
};

type CuratedImageDisplayProps = ComponentProps &
  Sitecore.Components.General.CuratedImageDisplay.CuratedImageDisplay & {
    fields?: {
      images: ExtendedImageItem[];
    };
  };

type DisplayStyle = 'grid' | 'horizontal-scroll';

function CuratedImageDisplay_Default(props: CuratedImageDisplayProps): JSX.Element {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isLightboxVisible, setIsLightboxVisible] = useState(false);

  const sliderRef = useRef<SliderType | null>(null);

  const sliderSettings = {
    initialSlide: props.fields?.images && props.fields?.images.length > 1 ? currentSlideIndex : 0,
    arrows: false,
    dots: false,
  };

  const openModal = (index: number) => {
    setIsLightboxVisible(true);
    setCurrentSlideIndex(index);
  };

  const { themeData } = useTheme(CuratedImageDisplayTheme);
  const { currentScreenWidth } = useCurrentScreenType();

  const DESKTOP_DISPLAY_STYLE = getEnum<DisplayStyle>(props.fields?.desktopDisplayStyle) ?? 'grid';
  const MOBILE_DISPLAY_STYLE = getEnum<DisplayStyle>(props.fields?.mobileDisplayStyle) ?? 'grid';

  // Shared utility functions to avoid duplication
  const getImageUrl = (imageItem: ExtendedImageItem) => {
    return imageItem.fields?.thumbnailImage?.value?.src ?? '';
  };

  const getImageProps = (imageItem: ExtendedImageItem) => {
    const thumbnailImage = imageItem.fields?.thumbnailImage?.value;

    return {
      alt: thumbnailImage?.alt ?? '',
      height: Number.parseInt(String(thumbnailImage?.height ?? '0'), 10),
      width: Number.parseInt(String(thumbnailImage?.width ?? '0'), 10),
    };
  };

  const renderCuratedImages = (): JSX.Element => {
    if (currentScreenWidth < getBreakpoint('md')) {
      // Renderings for mobile devices
      switch (MOBILE_DISPLAY_STYLE) {
        case 'grid':
          return gridStyleImages();
        case 'horizontal-scroll':
          return scrollStyleImage();
      }
    } else {
      // Renderings for tablets and large screen devices
      switch (DESKTOP_DISPLAY_STYLE) {
        case 'grid':
          return gridStyleImages();
        case 'horizontal-scroll':
          return scrollStyleImage();
      }
    }
  };

  const gridStyleImages = (): JSX.Element => {
    return (
      <ul className="grid grid-cols-2 gap-y-m md:grid-cols-12 md:gap-s">
        {props.fields?.images.map((ImageItem: ExtendedImageItem, index: number) => {
          const imageUrl = getImageUrl(ImageItem);
          const hasThumbnail = !!imageUrl;

          const scaledThumbnail = {
            value: {
              src: imageUrl,
              ...getImageProps(ImageItem),
            },
          };

          return (
            <li
              key={(() => {
                if (ImageItem.fields?.thumbnailImage?.value?.src) {
                  return `image-${ImageItem.fields.thumbnailImage.value.src.split('/').pop()?.split('?')[0]}`;
                }
                if (ImageItem.fields?.fullImage?.value?.src) {
                  return `image-${ImageItem.fields.fullImage.value.src.split('/').pop()?.split('?')[0]}`;
                }
                return `image-${index}`;
              })()}
              className="group relative col-span-12 md:col-span-4 lg:col-span-3"
            >
              <button
                type="button"
                onClick={() => {
                  openModal(index);
                }}
                className="w-full"
              >
                <ImagePrimary
                  imageLayout={hasThumbnail ? 'responsive' : 'fill'}
                  ratio="square"
                  fields={{
                    primaryImageCaption: {
                      value: '',
                    },
                    primaryImage: scaledThumbnail,
                    primaryImageMobile: scaledThumbnail,
                  }}
                  alwaysUseFocusArea={!hasThumbnail}
                  additionalMobileClasses={hasThumbnail ? '' : 'aspect-square'}
                />
                <SvgIcon
                  className="-translate-t-3/4 absolute top-1/2 left-1/2 -translate-x-1/2 rounded-full bg-black bg-opacity-[.65] p-l text-white opacity-0 transition-all ease-linear group-hover:-translate-y-1/2 group-hover:opacity-100"
                  icon="zoom-pinch"
                />
              </button>
            </li>
          );
        })}
      </ul>
    );
  };

  const scrollStyleImage = (): JSX.Element => {
    const sliderSettings = {
      dots: false,
      arrow: true,
      infinite: false,
      slidesToShow: 4,
      responsive: [
        {
          breakpoint: getBreakpoint('md'),
          settings: {
            slidesToShow: 1,
            dots: true,
          },
        },
        {
          breakpoint: getBreakpoint('lg'),
          settings: {
            slidesToShow: 3,
            dots: false,
          },
        },
      ],
    };

    return (
      <SliderWrapper sliderSettings={sliderSettings}>
        {props.fields?.images.map((ImageItem: ExtendedImageItem, index: number) => {
          const imageUrl = getImageUrl(ImageItem);
          const hasThumbnail = !!imageUrl;

          const scaledThumbnail = {
            value: {
              src: imageUrl ?? '',
              ...getImageProps(ImageItem),
            },
          };

          const getFragmentKey = () => {
            if (ImageItem.fields?.thumbnailImage?.value?.src) {
              return `fragment-${ImageItem.fields.thumbnailImage.value.src.split('/').pop()?.split('?')[0]}`;
            }
            if (ImageItem.fields?.fullImage?.value?.src) {
              return `fragment-${ImageItem.fields.fullImage.value.src.split('/').pop()?.split('?')[0]}`;
            }
            return `ImageItem-${index}`;
          };

          return (
            <React.Fragment key={getFragmentKey()}>
              <button
                type="button"
                onClick={() => {
                  openModal(index);
                }}
                className="group relative cursor-pointer md:mr-s"
              >
                <ImagePrimary
                  imageLayout={hasThumbnail ? 'responsive' : 'fill'}
                  ratio="square"
                  fields={{
                    primaryImageCaption: {
                      value: '',
                    },
                    primaryImage: scaledThumbnail,
                    primaryImageMobile: scaledThumbnail,
                  }}
                  alwaysUseFocusArea={!hasThumbnail}
                  additionalMobileClasses={hasThumbnail ? '' : 'aspect-square'}
                />
                <SvgIcon
                  className="-translate-t-3/4 absolute top-1/2 left-1/2 -translate-x-1/2 rounded-full bg-black bg-opacity-[.65] p-l text-white opacity-0 transition-all ease-linear group-hover:-translate-y-1/2 group-hover:opacity-100"
                  icon="zoom-pinch"
                />
              </button>
            </React.Fragment>
          );
        })}
      </SliderWrapper>
    );
  };

  const renderPhotoItem = () => {
    return props.fields?.images?.map((result: ExtendedImageItem, index: number) => {
      // Use the new data structure with fullImage nested in fields
      const transformedResult = {
        ...result,
        fields: {
          ...result.fields,
          fullImage: result.fields?.fullImage,
          thumbnailImage: result.fields?.thumbnailImage,
        },
      } as unknown as Sitecore.BaseTemplates.BasePhoto & Sitecore.Data.Photos.Photo;

      const photoObject = getPhotoItemProps(transformedResult, false) as PhotoItemWithDetailProps;

      if (props.fields?.hideRelatedPages?.value && photoObject?.fields) {
        photoObject.fields.relatedPages = [];
      }

      const getPhotoKey = () => {
        return result.fields?.fullImage?.value?.src
          ? `photo-${result.fields.fullImage.value.src.split('/').pop()}`
          : `photo-${index}`;
      };

      return <PhotoItemWithDetail key={getPhotoKey()} {...photoObject} />;
    });
  };

  const hasImage = props.fields?.images?.find((image: Sitecore.BaseTemplates.BasePhoto) => {
    return image.fields?.fullImage?.value?.src ?? image.fields?.thumbnailImage?.value?.src;
  });

  if (!hasImage) {
    return (
      <Component
        variant="lg"
        backgroundVariant=""
        dataComponent="general/curatedimagedisplay"
        {...props}
        sectionWrapperClasses="hidden"
      ></Component>
    );
  }

  return (
    <Component
      variant="lg"
      backgroundVariant=""
      sectionWrapperClasses=""
      dataComponent="general/curatedimagedisplay"
      {...props}
    >
      <div className="col-span-12">
        <Headline {...props} classes={themeData.classes.headline} />
        <BodyCopy {...props} classes={themeData.classes.bodyCopy} />
        <SingleButton {...props} classes={themeData.classes.SingleButton} />
        {renderCuratedImages()}
        {/* Photo gallery */}
        {isLightboxVisible && (
          <ModalWrapper
            isModalOpen={isLightboxVisible}
            size="extra-large"
            customContentWrapperclass="w-auto h-auto max-w-[1200px] max-h-[90vh]"
            handleClose={() => setIsLightboxVisible(false)}
          >
            <div className="px-ml pb-ml pt-s">
              {props.fields?.images && props.fields?.images.length > 1 ? (
                <>
                  <SliderWrapper
                    sliderSettings={sliderSettings}
                    sliderRef={sliderRef as SliderRefType}
                  >
                    {renderPhotoItem()}
                  </SliderWrapper>
                  <div className="mt-m flex items-center justify-between text-xxs md:justify-center">
                    <button
                      type="button"
                      className="ml-xxxs flex cursor-pointer items-center text-button font-bold md:mr-xs"
                      onClick={() => {
                        if (sliderRef.current) {
                          sliderRef.current.slickPrev();
                        }
                      }}
                    >
                      <SvgIcon className="mr-xs" icon="arrow-left" />

                      <Text field={props.fields?.previousLabel} tag="span" />
                    </button>
                    <button
                      type="button"
                      className="mr-xxxs flex cursor-pointer items-center text-button font-bold md:ml-xs"
                      onClick={() => {
                        if (sliderRef.current) {
                          sliderRef.current.slickNext();
                        }
                      }}
                    >
                      <Text field={props.fields?.nextLabel} tag="span" />
                      <SvgIcon className="ml-xs" icon="arrow-right" />
                    </button>
                  </div>
                </>
              ) : (
                renderPhotoItem()
              )}
            </div>
          </ModalWrapper>
        )}
      </div>
    </Component>
  );
}

export const Default = withDatasourceCheck(CuratedImageDisplay_Default);
