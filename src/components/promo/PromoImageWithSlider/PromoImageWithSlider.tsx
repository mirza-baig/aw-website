'use client';

import 'react-before-after-slider-component/dist/build.css';

import { Text } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import { Caption } from 'helpers/Caption';
import Component from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { ComponentProps } from 'lib/component-props';
import { useModalIdContext } from 'lib/context/GenericModalIDContext';
import { useTheme } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';
import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX, KeyboardEvent, useEffect, useRef, useState } from 'react';
import ReactBeforeSliderComponent from 'react-before-after-slider-component';

import { PromoImageWithSliderTheme } from './helpers/PromoImageWithSlider.theme';
import styles from './helpers/slider.module.css';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type layoutStyle = 'full-width' | 'side-by-side';

type PromoImageWithSliderProps = ComponentProps &
  Sitecore.Components.Promo.PromoImageWithSlider.PromoImageWithSlider;

function PromoImageWithSlider_Default(props: PromoImageWithSliderProps) {
  const { themeData, themeName } = useTheme(PromoImageWithSliderTheme);
  const { currentScreenWidth } = useCurrentScreenType();

  const [sliderValue, setSliderValue] = useState(50);
  const [showDetails, setShowDetails] = useState(false);
  const [forceUpdateToggle, setForceUpdateToggle] = useState(false);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const { selectedModalId } = useModalIdContext();

  useEffect(() => {
    if (props.isGenericModal && selectedModalId != '') {
      // Toggle the force update state to trigger a re-render
      setForceUpdateToggle((prevToggle) => !prevToggle);
    }
  }, [props.isGenericModal, selectedModalId]);

  useEffect(() => {
    setForceUpdateToggle((prevToggle) => !prevToggle);
  }, [props.forceUpdate]);

  useEffect(() => {
    // setTimeout because once slider-component gets rerendered, we will have access to image elements in dom
    setTimeout(() => {
      const secondImage = sliderRef.current?.querySelector(
        '.before-after-slider__first-photo-container'
      );

      const firstImage = sliderRef.current?.querySelector(
        '.before-after-slider__second-photo-container'
      );

      //secondImage &&
      secondImage?.classList.add(
        'after:block',
        'after:py-s',
        'after:text-center',
        'after:min-w-[160px]',
        'after:bg-black',
        'after:text-white',
        'after:uppercase',
        'after:w-fit',
        'after:content-none',
        `${
          props.fields?.rightImageLabel?.value
            ? 'md:after:content-[attr(data-afterLabel)]'
            : 'md:after:content-[""]'
        }`
      );
      //firstImage &&
      firstImage?.classList.add(
        'after:block',
        'after:py-s',
        'after:text-center',
        'after:min-w-[160px]',
        'after:bg-black',
        'after:text-white',
        'after:uppercase',
        'after:w-fit',
        'after:content-none',
        `${
          props.fields?.leftImageLabel?.value
            ? 'md:after:content-[attr(data-beforeLabel)]'
            : 'md:after:content-[""]'
        }`
      );

      secondImage?.setAttribute('data-afterLabel', props.fields?.rightImageLabel?.value ?? '');
      firstImage?.setAttribute('data-beforeLabel', props.fields?.leftImageLabel?.value ?? '');
    }, 100);
    // "props.fields.rightImageLabel.value" and "props.fields.leftImageLabel.value" are directly coming from layout service.
    // We can ignore the react-hooks/exhaustive-deps warning for this useEffect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sliderRef.current, forceUpdateToggle]);

  const LAYOUT_STYLE = getEnum<layoutStyle>(props.fields?.layoutStyle) ?? 'full-width';

  const FIRST_IMAGE = {
    imageUrl: props.fields?.rightImage.value?.src ?? '',
    alt: props.fields?.rightImage.value?.alt as string,
  };

  const SECOND_IMAGE = {
    imageUrl: props.fields?.leftImage.value?.src ?? '',
    alt: props.fields?.leftImage.value?.alt as string,
  };

  const delimiterIconStyles = {
    width: '48px',
    height: '48px',
    display: currentScreenWidth < getBreakpoint('md') ? 'none' : 'block',
    backgroundPosition: 'center',
    borderRadius: 'none',
    backgroundColor: themeName === 'aw' ? '#F26924' : '#000000',
    backgroundRepeat: 'no-repeat',
    // Note: using icons file from public folder directly as we can only use background-image property
    // to customise slider thumb (delimiterIconStyles)
    backgroundImage:
      themeName === 'aw'
        ? "url('/before-after-slider-arrow-aw.svg')"
        : "url('/before-after-slider-arrow-rba.svg')",
  };

  let promoContentColumn;
  let promoImageColumn;

  switch (LAYOUT_STYLE) {
    case 'side-by-side':
      promoContentColumn = themeData.classes.sideBySide.promoContent;
      promoImageColumn = themeData.classes.sideBySide.promoImgSlider;
      break;

    case 'full-width':
      promoContentColumn = themeData.classes.fullWidth.promoContent;
      promoImageColumn = themeData.classes.fullWidth.promoImgSlider;
      break;
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft' && sliderValue > -1) {
      setSliderValue(sliderValue - 1);
    }
    if (e.key === 'ArrowRight' && sliderValue < 100) {
      setSliderValue(sliderValue + 1);
    }
  }

  const renderSlider = (): JSX.Element => {
    return (
      <div className={styles.sliderWrapper}>
        {LAYOUT_STYLE === 'full-width' && (
          <Headline
            {...props}
            classes={classNames(themeData.classes.fullWidth.headline, 'mb-xxs md:mb-s')}
          />
        )}

        <div
          tabIndex={currentScreenWidth < getBreakpoint('md') ? -1 : 0}
          onKeyDown={handleKeyDown}
          className={classNames(themeName, 'relative -mx-m md:mx-0')}
        >
          {/* If rendered within generic modal, force rerender on modal open as it does not get initialised on first load */}
          <ReactBeforeSliderComponent
            key={
              props.isGenericModal || props.forceUpdate
                ? `forceRerender-${forceUpdateToggle}`
                : 'react-before-after-slider'
            }
            currentPercentPosition={sliderValue}
            onChangePercentPosition={(position) => {
              // returning false to prevent thumb slide in mobile
              if (currentScreenWidth < getBreakpoint('md')) {
                return false;
              } else {
                setSliderValue(position);
                return true;
              }
            }}
            firstImage={FIRST_IMAGE}
            secondImage={SECOND_IMAGE}
            feelsOnlyTheDelimiter={true}
            delimiterIconStyles={delimiterIconStyles}
            delimiterColor="white"
          />
          <div
            className={classNames(
              themeData.classes.rangewrapper,
              currentScreenWidth < getBreakpoint('md') ? 'min-h-[48px]' : ''
            )}
          >
            <Text
              field={props.fields?.rightImageLabel}
              tag="span"
              className={classNames(themeData.classes.imageLabels, 'left-[30px] flex-1 grow')}
            />
            {currentScreenWidth < getBreakpoint('md') && (
              <input
                aria-label="before-after range input"
                className="before-after-slider-range mx-xxs flex-1 grow"
                onChange={(e) => setSliderValue(parseFloat(e.target.value))}
                type="range"
                min={-1}
                max={99.9}
                value={sliderValue}
              />
            )}
            <Text
              field={props.fields?.leftImageLabel}
              tag="span"
              className={classNames(themeData.classes.imageLabels, 'right-[30px] flex-1 grow')}
            />
          </div>
        </div>
      </div>
    );
  };

  const expandDetailsButton = () => {
    const COLLAPSED_LABEL =
      themeName === 'aw' ? { value: 'SHOW DETAILS' } : { value: 'View Details' };
    const EXPANDED_LABEL =
      themeName === 'aw' ? { value: 'CLOSE DETAILS' } : { value: 'Hide Details' };
    return (
      <button className={themeData.classes.expandButton.wrapper}>
        <SvgIcon
          icon={showDetails ? 'close' : 'plus'}
          size={themeName === 'aw' ? 'sm' : 'md'}
          className={themeData.classes.expandButton.icon}
        />
        <Text
          tag="span"
          field={showDetails ? EXPANDED_LABEL : COLLAPSED_LABEL}
          className={themeData.classes.expandButton.text}
        />
      </button>
    );
  };

  const renderAdditionalDetails = () => {
    if (LAYOUT_STYLE === 'full-width') {
      return (
        <div className="grid grid-cols-12 ">
          <div className="col-span-12 md:col-span-10">
            <Caption
              caption={props.fields?.imageCaption}
              italic={false}
              isImageCaption={false}
              classes={themeData.classes.caption}
            />
          </div>

          <div
            className="col-span-12 md:col-span-2 md:justify-self-end "
            onClick={() => setShowDetails(!showDetails)}
          >
            {expandDetailsButton()}
          </div>

          {showDetails && (
            <BodyCopy
              fields={{ body: props.fields?.description ?? { value: '' } }}
              classes={themeData.classes.bodyCopy}
            />
          )}
        </div>
      );
    } else {
      return (
        <>
          <div className="order-last md:order-0">
            <Headline
              {...props}
              classes={classNames(themeData.classes.sideBySide.headline, 'mb-xxs md:mb-s ')}
            />
            <BodyCopy
              fields={{ body: props.fields?.description ?? { value: '' } }}
              classes={themeData.classes.bodyCopy}
            />
          </div>

          <Caption
            caption={props.fields?.imageCaption}
            italic={false}
            classes={classNames(themeData.classes.caption, themeName === 'rba' && 'md:mb-0')}
          />
        </>
      );
    }
  };
  if (!FIRST_IMAGE?.imageUrl || !SECOND_IMAGE?.imageUrl) {
    return (
      <Component
        variant="lg"
        dataComponent="promo/promoimagewithslider"
        {...props}
        sectionWrapperClasses="hidden"
      ></Component>
    );
  }

  return (
    <Component variant="lg" dataComponent="promo/promoimagewithslider" {...props}>
      <div className={promoContentColumn}>{renderAdditionalDetails()}</div>
      <div ref={sliderRef} className={promoImageColumn}>
        {renderSlider()}
      </div>
    </Component>
  );
}

export const Default = withDatasourceCheck(PromoImageWithSlider_Default);
