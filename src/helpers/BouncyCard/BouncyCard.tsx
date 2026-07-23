/***  Disabling no-explicit-any for whole file as this file is containing a whole lot of them, and to apply proper type,
 we need to understand context of every instance of how and when this helper is being used */

/* eslint-disable @typescript-eslint/no-explicit-any */
// Global
import { ImageField, Text } from '@sitecore-content-sdk/nextjs';
import ImageWrapper from 'helpers/Media/ImageWrapper';
// Components
import { LayoutValue } from 'helpers/Media/types';
import { RichTextWrapper } from 'helpers/RichTextWrapper';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import Link from 'next/link';
import { JSX, useState } from 'react';
import { useTheme } from 'src/lib/context/ThemeContext';

import { SliderWrapper } from '../SliderWrapper';
import { BouncyCardTheme, BouncyCardThemeSubType } from './BouncyCard.theme';
export type BouncyCardBaseProps = {
  id: any;
  name: any;
  ctaText: any;
  heading: any;
  image: any;
  icon: any;
  property: any;
  step: {
    heading: any;
    subhead: any;
    copy: any;
  };
  isPerfectMatch: boolean;
  help: {
    cta: any;
    popup: {
      text: any;
      image1: any;
      image2: any;
      image3: any;
      image4: any;
      image5: any;
      mobileImage1: any;
      mobileImage2: any;
      mobileImage3: any;
      mobileImage4: any;
      mobileImage5: any;
    };
  } | null;
};

export type BouncyCardProps = {
  children?: React.ReactNode | React.ReactNode[];
  onClick?: (param: any) => void;
  ctaUrl?: string;
  ctaOnClick?: (e: React.MouseEvent) => void;
  ctaAlwaysVisible?: boolean;
  cardWidth?: string;
  renderAsLink?: boolean;
  onHelpClick?: (param: any) => void;
  helpClickOverride?: boolean;
  mobileFullWidth?: boolean;
  additionalWrapperClassName?: string;
  additionalButtonClassName?: string;
  additionalHeadingClassName?: string;
  additionalCtaClassName?: string;
  bounce?: boolean;
  noBottomCTA?: boolean;
  imageLayout?: LayoutValue;
  defaultImageWidth?: number;
  defaultImageHeight?: number;
} & BouncyCardBaseProps;

const BouncyCard = (props: BouncyCardProps): JSX.Element => {
  const { themeName, themeData } = useTheme(
    BouncyCardTheme(
      props.mobileFullWidth ?? false,
      props.cardWidth ?? '',
      props?.bounce,
      props?.additionalButtonClassName,
      props?.ctaAlwaysVisible,
      props?.noBottomCTA ?? false
    )
  );
  const theme = (themeData as BouncyCardThemeSubType).classes;
  const [showModal, setShowModal] = useState(false);
  const renderAsLink = props.renderAsLink ?? true;

  const closeModal = () => {
    setShowModal(false);
  };

  const openModal = (event: React.MouseEvent) => {
    setShowModal(true);
    window.scrollTo(0, 0);
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    event.preventDefault();
    event.nativeEvent.preventDefault();
    return false;
  };

  const sliderSettings = {
    infinite: false,
    className: `max-w-full [&_.slick-active_button:before]:text-primary!`,
  };

  function HasImageDimensions(image: ImageField) {
    return image?.value?.height && image?.value?.width;
  }

  const option = props;
  const cardImage = option?.image;
  if (cardImage?.value) {
    cardImage.value.height ??= props?.defaultImageHeight ?? 100;
    cardImage.value.width ??= props?.defaultImageWidth ?? 100;
  }

  const ctaUrl = props?.ctaUrl ?? '#/' + props?.id;

  // When the parent provides ctaOnClick, intercept the click so we can use
  // history.replaceState (or any custom handler) instead of the default
  // next/link App Router navigation.
  const handleCtaClick = (e: React.MouseEvent) => {
    if (props.ctaOnClick) {
      e.preventDefault();
      props.ctaOnClick(e);
    }
  };

  const RenderInnerContent = () => {
    return (
      <>
        <div className={theme.optionTop}>
          <div className={theme.optionImgWrapper}>
            <ImageWrapper
              image={cardImage}
              additionalDesktopClasses={theme.optionImage}
              additionalMobileClasses={theme.optionImage}
              imageLayout={
                HasImageDimensions(option.image) ? (props?.imageLayout ?? 'responsive') : 'fill'
              }
            ></ImageWrapper>
          </div>
          <p className={theme.optionHeading + ' ' + (props?.additionalHeadingClassName ?? '')}>
            <Text field={option.heading}></Text>
          </p>
        </div>
        <div className={theme.optionBottom + ' ' + (props?.additionalCtaClassName ?? '')}>
          {option.help?.cta?.value ? (
            <div
              className={theme.optionHelp}
              onClick={(event) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                !props.helpClickOverride && openModal(event);
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                props.onHelpClick && props.onHelpClick(event);
              }}
            >
              <Text field={option?.help?.cta}></Text>
            </div>
          ) : (
            <div className={theme.optionHelp}></div>
          )}
          {option.ctaText?.value && (
            <div className={theme.optionCta}>
              <RichTextWrapper field={option.ctaText}></RichTextWrapper>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div
      className={theme.optionMain + ' ' + (props?.additionalWrapperClassName ?? '')}
      onClick={props.onClick}
    >
      {renderAsLink ? (
        <Link
          href={ctaUrl}
          className={theme.optionBtn}
          title={option.heading?.value}
          aria-label={option.heading?.value}
          onClick={handleCtaClick}
        >
          {RenderInnerContent()}
          {/* Fix S6749: replaced redundant empty fragment fallback with null */}
          {props.children || null}
        </Link>
      ) : (
        <div className={theme.optionBtn}>
          {RenderInnerContent()}
          {/* Fix S6749: replaced redundant empty fragment fallback with null */}
          {props.children || null}
        </div>
      )}
      {showModal && (
        <div className={theme.help.helpContainer}>
          <div className={theme.help.helpOverlay}>
            <div className={theme.help.helpWrapper}>
              <div className={theme.help.helpContent}>
                <div className={theme.help.closeWrapper}>
                  <a className={theme.help.closeButton} onClick={closeModal}>
                    <SvgIcon
                      icon={'close'}
                      size={'xl'}
                      className={theme.help.closeButtonIcon}
                    ></SvgIcon>
                  </a>
                </div>
                <div className={theme.help.mobileDisplay.mobileDisplay}>
                  <div className={theme.help.mobileDisplay.richTextContent}>
                    <RichTextWrapper field={option?.help?.popup?.text} refer=""></RichTextWrapper>
                  </div>
                  <div className={theme.help.mobileDisplay.carousel}>
                    <SliderWrapper sliderSettings={sliderSettings} theme={themeName}>
                      {
                        <div className={theme.help.mobileDisplay.carouselImage}>
                          <ImageWrapper
                            key={1}
                            image={option?.help?.popup?.image1}
                            imageLayout="intrinsic"
                          ></ImageWrapper>
                        </div>
                      }
                      {option?.help?.popup?.image2 && (
                        <div className={theme.help.mobileDisplay.carouselImage}>
                          <ImageWrapper
                            key={2}
                            image={option?.help?.popup?.image2}
                            imageLayout="intrinsic"
                          ></ImageWrapper>
                        </div>
                      )}
                      {option?.help?.popup?.image3 && (
                        <div className={theme.help.mobileDisplay.carouselImage}>
                          <ImageWrapper
                            key={3}
                            image={option?.help?.popup?.image3}
                            imageLayout="intrinsic"
                          ></ImageWrapper>
                        </div>
                      )}
                      {option?.help?.popup?.image4 && (
                        <div className={theme.help.mobileDisplay.carouselImage}>
                          <ImageWrapper
                            key={4}
                            image={option?.help?.popup?.image4}
                            imageLayout="intrinsic"
                          ></ImageWrapper>
                        </div>
                      )}
                      {option?.help?.popup?.image5 && (
                        <div className={theme.help.mobileDisplay.carouselImage}>
                          <ImageWrapper
                            key={5}
                            image={option?.help?.popup?.image5}
                            imageLayout="intrinsic"
                          ></ImageWrapper>
                        </div>
                      )}
                    </SliderWrapper>
                  </div>
                  <button
                    type="button"
                    className={theme.help.mobileDisplay.buttonContainer}
                    onClick={props.onClick}
                  >
                    {renderAsLink ? (
                      <Link
                        href={ctaUrl}
                        className={theme.help.mobileDisplay.button}
                        title={'Choose ' + props.heading?.value}
                        aria-label={'Choose ' + props.heading?.value}
                        onClick={handleCtaClick}
                      >
                        Choose
                      </Link>
                    ) : (
                      <div
                        className={theme.help.mobileDisplay.button}
                        title={'Choose ' + props.heading?.value}
                        aria-label={'Choose ' + props.heading?.value}
                      >
                        Choose
                      </div>
                    )}
                  </button>
                </div>
                <div className={theme.help.desktopDisplay.desktopDisplay}>
                  <div className={theme.help.desktopDisplay.row60}>
                    <div className={theme.help.desktopDisplay.column66}>
                      {option?.help?.popup?.image1 && (
                        <div className={theme.help.desktopDisplay.image}>
                          <ImageWrapper image={option?.help?.popup?.image1}></ImageWrapper>
                        </div>
                      )}
                    </div>
                    <div className={theme.help.desktopDisplay.column33}>
                      <div className={theme.help.desktopDisplay.richTextContent}>
                        <RichTextWrapper
                          field={option?.help?.popup?.text}
                          refer=""
                        ></RichTextWrapper>
                      </div>

                      <button
                        type="button"
                        className={theme.help.desktopDisplay.buttonContainer}
                        onClick={props.onClick}
                      >
                        {renderAsLink ? (
                          <Link
                            href={ctaUrl}
                            className={theme.help.desktopDisplay.button}
                            title={'Choose ' + option.heading?.value}
                            aria-label={'Choose ' + option.heading?.value}
                            onClick={handleCtaClick}
                          >
                            Choose
                          </Link>
                        ) : (
                          <div
                            className={theme.help.desktopDisplay.button}
                            title={'Choose ' + option.heading?.value}
                            aria-label={'Choose ' + option.heading?.value}
                          >
                            Choose
                          </div>
                        )}
                      </button>
                      <div className={theme.help.desktopDisplay.image}>
                        <ImageWrapper image={option?.help?.popup?.image2}></ImageWrapper>
                      </div>
                    </div>
                  </div>
                  <div className={theme.help.desktopDisplay.row40}>
                    <div className={theme.help.desktopDisplay.column40}>
                      {option?.help?.popup?.image3 && (
                        <div className={theme.help.desktopDisplay.image}>
                          <ImageWrapper image={option?.help?.popup?.image3}></ImageWrapper>
                        </div>
                      )}
                    </div>
                    <div className={theme.help.desktopDisplay.column20}>
                      {option?.help?.popup?.image4 && (
                        <div className={theme.help.desktopDisplay.image}>
                          <ImageWrapper image={option?.help?.popup?.image4}></ImageWrapper>
                        </div>
                      )}
                    </div>
                    <div className={theme.help.desktopDisplay.column40}>
                      {option?.help?.popup?.image5 && (
                        <div className={theme.help.desktopDisplay.image}>
                          <ImageWrapper image={option?.help?.popup?.image5}></ImageWrapper>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BouncyCard;
