/* eslint-disable @typescript-eslint/no-unused-expressions */
import classNames from 'classnames';
import { ProductSwatch } from 'components/product/ProductIntro/helpers/product-swatch';
import { useTheme } from 'lib/context/ThemeContext';
import useExperienceEditor from 'lib/utils/use-experience-editor';
import { JSX, useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';

import ImageWrapper from '../Media/ImageWrapper';
import { maxhTypes, maxwTypes, RatioTypes } from '../Media/types';
import styles from './slick.module.css';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export type ImageToggleWrapperProps = Sitecore.FieldSets.ImagePrimary &
  Sitecore.FieldSets.ImageSecondary & {
    ratio?: RatioTypes;
    maxH?: maxhTypes;
    maxW?: maxwTypes;
  } & {
    updateToggleState?: (state: boolean) => void;
    colorSwatches?: {
      interiorColorSwatches?: ProductSwatch[];
      exteriorColorSwatches?: ProductSwatch[];
    };
    selectedSwatchIndex?: number;
  };

export const ImageToggleWrapper = (props: ImageToggleWrapperProps): JSX.Element => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const { themeName } = useTheme();
  const { fields, ratio, maxW, maxH, updateToggleState, colorSwatches, selectedSwatchIndex } =
    props;
  const isEE = useExperienceEditor();

  const primaryImage =
    isEE || fields?.primaryImage?.value?.src
      ? {
          image: fields?.primaryImage,
          mobileImage: fields?.primaryImageMobile,
          mobileFocusArea: fields?.primaryImageMobileFocusArea,
          additionalDesktopClasses: 'w-fit mx-auto',
          additionalMobileClasses: 'w-fit mx-auto',
          ratio: ratio,
          maxW: maxW,
          maxH: maxH,
        }
      : false;

  const secondaryImage =
    isEE || fields?.secondaryImage?.value?.src
      ? {
          image: fields?.secondaryImage,
          mobileImage: fields?.secondaryImageMobile,
          mobileFocusArea: fields?.secondaryImageMobileFocusArea,
          additionalDesktopClasses: 'w-fit mx-auto',
          additionalMobileClasses: 'w-fit mx-auto',
          ratio: ratio,
          maxW: maxW,
          maxH: maxH,
        }
      : false;

  const activeButtonStyle =
    'text-regular inline-block rounded-full px-l py-[8px] text-small uppercase leading-tight border-2 border-black font-heavy text-secondary';
  const inactiveButtonStyle =
    'inline-block rounded-full px-l py-[8px] text-small uppercase leading-tight font-heavy text-dark-gray';

  // Helper function to get exterior button style
  const getExteriorButtonStyle = (): string => {
    if (
      colorSwatches?.exteriorColorSwatches?.length &&
      colorSwatches?.interiorColorSwatches?.length
    ) {
      return currentSlideIndex >= colorSwatches?.interiorColorSwatches.length
        ? activeButtonStyle
        : inactiveButtonStyle;
    }
    return currentSlideIndex === 1 ? activeButtonStyle : inactiveButtonStyle;
  };

  const slider = useRef<Slider>(null);

  const sliderSettings = {
    dots: false,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (_currentSlide: number, nextSlide: number) => {
      setCurrentSlideIndex(nextSlide);
    },
  };

  useEffect(() => {
    if (selectedSwatchIndex != undefined && selectedSwatchIndex >= 0 && colorSwatches) {
      if (
        colorSwatches?.interiorColorSwatches &&
        currentSlideIndex < colorSwatches?.interiorColorSwatches?.length
      ) {
        slider?.current?.slickGoTo(selectedSwatchIndex);
      } else {
        slider?.current?.slickGoTo(
          colorSwatches?.interiorColorSwatches
            ? colorSwatches?.interiorColorSwatches?.length + selectedSwatchIndex
            : 0
        );
      }
    }

    // "colorSwatches" have direct layout props, so we can ignore react-hooks/exhaustive-deps warning for this suggested dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSwatchIndex, currentSlideIndex]);

  const imageSlider = (): JSX.Element => {
    if (
      colorSwatches?.exteriorColorSwatches?.length &&
      colorSwatches?.interiorColorSwatches?.length
    ) {
      return (
        <div className={styles.sliderWrapper}>
          <Slider ref={slider} {...sliderSettings} swipeToSlide={false} swipe={true}>
            {/* By default interior images will be the first */}
            {colorSwatches?.interiorColorSwatches?.map((swatchItem, index: number) => {
              return (
                <ImageWrapper
                  key={`interior-slide-${swatchItem.fields?.productImageSwatch?.id ?? index}`}
                  imageLayout="intrinsic"
                  image={swatchItem.fields?.productImage}
                  mobileImage={swatchItem.fields?.productImage}
                  mobileFocusArea={fields?.primaryImageMobileFocusArea}
                  additionalDesktopClasses="w-fit mx-auto"
                  additionalMobileClasses="w-fit mx-auto"
                  ratio={ratio}
                  maxW={maxW}
                  maxH={maxH}
                />
              );
            })}
            {colorSwatches?.exteriorColorSwatches?.map((swatchItem, index: number) => {
              return (
                <ImageWrapper
                  key={`exterior-slide-${swatchItem.fields?.productImageSwatch?.id ?? index}`}
                  imageLayout="intrinsic"
                  image={swatchItem.fields?.productImage}
                  mobileImage={swatchItem.fields?.productImage}
                  mobileFocusArea={fields?.primaryImageMobileFocusArea}
                  additionalDesktopClasses="w-fit mx-auto"
                  additionalMobileClasses="w-fit mx-auto"
                  ratio={ratio}
                  maxW={maxW}
                  maxH={maxH}
                />
              );
            })}
          </Slider>
        </div>
      );
    } else {
      //This classes are used to fix image rendering size withing ImageToggleWrapper
      const fixedImageClasses = '[&_img]:min-h-0! [&_img]:h-auto! [&_img]:min-w-0! [&_img]:w-auto!';
      return (
        <div className={styles.sliderWrapper}>
          <Slider ref={slider} {...sliderSettings}>
            <ImageWrapper
              {...primaryImage}
              imageLayout="intrinsic"
              additionalMobileClasses={fixedImageClasses}
              additionalDesktopClasses={fixedImageClasses}
            />
            <ImageWrapper
              {...secondaryImage}
              imageLayout="intrinsic"
              additionalMobileClasses={fixedImageClasses}
              additionalDesktopClasses={fixedImageClasses}
            />
          </Slider>
        </div>
      );
    }
  };

  const isToggleAvailable = !!(
    (primaryImage && secondaryImage) ||
    (colorSwatches?.exteriorColorSwatches?.length && colorSwatches?.interiorColorSwatches?.length)
  );

  return (
    <>
      {/* render image toggle slider */}
      {imageSlider()}
      {/* Toggle Buttons */}
      {isToggleAvailable && (
        <div className={classNames('mt-m mb-m flex justify-center')}>
          <div
            className={classNames(
              'relative rounded-full border border-gray text-center',
              themeName === 'aw' && 'font-sans!'
            )}
          >
            {/* Extracted ternary logic into a variable for clarity */}
            {(() => {
              let interiorButtonClass: string;
              if (
                colorSwatches?.exteriorColorSwatches?.length &&
                colorSwatches?.interiorColorSwatches?.length
              ) {
                interiorButtonClass =
                  currentSlideIndex < colorSwatches?.interiorColorSwatches?.length
                    ? activeButtonStyle
                    : inactiveButtonStyle;
              } else {
                interiorButtonClass =
                  currentSlideIndex === 0 ? activeButtonStyle : inactiveButtonStyle;
              }
              return (
                <button
                  className={classNames(interiorButtonClass)}
                  onClick={() => {
                    updateToggleState?.(true);
                    if (colorSwatches) {
                      slider?.current?.slickGoTo(0);
                    } else {
                      slider?.current?.slickPrev();
                    }
                  }}
                >
                  Interior
                </button>
              );
            })()}
            <button
              className={classNames(getExteriorButtonStyle())}
              onClick={() => {
                updateToggleState?.(false);
                colorSwatches?.interiorColorSwatches?.length
                  ? slider?.current?.slickGoTo(colorSwatches?.interiorColorSwatches?.length ?? 1)
                  : slider?.current?.slickNext();
              }}
            >
              Exterior
            </button>
          </div>
        </div>
      )}
    </>
  );
};
