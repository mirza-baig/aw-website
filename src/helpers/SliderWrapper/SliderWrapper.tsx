'use client';

import classNames from 'classnames';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { ThemeName, useTheme } from 'lib/context/ThemeContext';
import React, { ReactNode, useEffect, useState } from 'react';
import Slider, { Settings } from 'react-slick';

import styles from './slick.module.css';

// We can ignore this typeerror, as this are props coming from Slick slider setting which we don't have type defined for.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ArrowIcon = (props: any) => {
  const { className, style, onClick, direction, classes } = props;

  const renderIcon = (direction: 'left' | 'right') => {
    switch (direction) {
      case 'right':
        return <SvgIcon icon="arrow-right" size="lg" />;
      case 'left':
        return <SvgIcon icon="arrow-left" size="lg" />;
      default:
        return null;
    }
  };

  return (
    <button
      className={classNames(className, 'text-theme-text hover:text-theme-text', classes)}
      style={{ ...style }}
      onClick={onClick}
      type="button"
      aria-label={`${direction} arrow`}
    >
      {renderIcon(direction)}
    </button>
  );
};

export type SliderType = Slider & {
  innerSlider: {
    props: Required<Settings>;
  };
};

export type SliderRefType = React.MutableRefObject<SliderType>;

export type sliderSettings = Settings & {
  [key: string]: unknown;
  afterIndexChange?: (currentIndex: number) => void;
};

type SliderWrapperProps = {
  theme?: ThemeName;
  sliderSettings?: sliderSettings;
  sliderRef?: SliderRefType;
  children: ReactNode[];
};

export const SliderWrapper = ({ sliderSettings, sliderRef, children }: SliderWrapperProps) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [prevSlideIndex, setPrevSlideIndex] = useState(-1);
  const { themeName } = useTheme();

  //Fix for slider adaptiveHeight
  useEffect(() => {
    const setSlides = (item: HTMLElement) => {
      const myElement = item;
      myElement.style.height = 'auto';
      myElement.style.margin = 'auto';
    };

    const setActiveSlides = (item: HTMLElement) => {
      const myElement = item;
      myElement.style.height = 'fit-content';
    };

    if (sliderSettings?.adaptiveHeight === true) {
      const slides = document.querySelectorAll('.slick-slide.slick-active.slick-current > div');
      slides.forEach(setSlides);

      const activeSlides = document.querySelectorAll('.slick-slide.slick-active.slick-current');
      activeSlides.forEach(setActiveSlides);
    }
    /* we can ignore 'sliderSettings?.adaptiveHeight' from deps as the value will not change  */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevSlideIndex]);

  const renderCustomPaging = (index: number) => {
    const getCustomPagingText = () => {
      if (
        sliderRef?.current &&
        sliderSettings?.enableNumberedPagination &&
        sliderRef.current?.innerSlider?.props?.rows > 1
      ) {
        return `${index + 1} / ${
          (sliderRef.current?.innerSlider?.props.children as Array<React.ReactNode>)?.length
        }`;
      } else {
        if (sliderRef?.current && sliderRef.current.innerSlider.props.slidesToShow > 1) {
          return `${index + 1} / ${
            children.length - Math.floor(sliderRef?.current?.innerSlider?.props.slidesToShow - 1)
          }`;
        }

        return `${index + 1} / ${children.length}`;
      }
    };

    return (
      <span className={classNames(Math.ceil(currentSlideIndex) !== index && 'hidden')}>
        {getCustomPagingText()}
      </span>
    );
  };

  const settings = {
    className: sliderSettings?.className,
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <ArrowIcon direction="right" classes={sliderSettings?.nextArrowClasses} />,
    prevArrow: <ArrowIcon direction="left" classes={sliderSettings?.prevArrowClasses} />,
    beforeChange: (currentIndex: number, nextIndex: number) => {
      setCurrentSlideIndex(nextIndex);
      setPrevSlideIndex(currentIndex);
    },
    afterChange: (currentIndex: number) => {
      if (sliderSettings?.afterIndexChange) {
        sliderSettings?.afterIndexChange(currentIndex);
      }
      const event = new Event('sliderChange');
      document.dispatchEvent(event);
    },
    ...sliderSettings,
  };

  if (sliderSettings?.enableNumberedPagination) {
    settings.className = settings.className + ' numbered-pagination';
    settings.dotsClass = sliderSettings.numberedPaginationClasses
      ? (sliderSettings.numberedPaginationClasses as string)
      : 'mt-xs text-center text-theme-text';
    settings.customPaging = (i: number) => {
      return renderCustomPaging(i);
    };
  }

  return (
    <div className={styles.sliderWrapper}>
      <div className={themeName}>
        <Slider ref={sliderRef} {...settings}>
          {children}
        </Slider>
      </div>
    </div>
  );
};
