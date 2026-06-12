'use client';

import { useSitecore } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import { cta1ToButtonProps, cta2ToButtonProps } from 'helpers/Button/Utils';
import ButtonGroup from 'helpers/ButtonGroup/ButtonGroup';
import Component from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { ComponentProps } from 'lib/component-props';
import { BANNER_VISIBILITY_SETTING, useStickyBanner } from 'lib/context/StickyBannerContext';
import { useTheme } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';
import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { useEffect, useState } from 'react';

import { StickyBannerTheme } from './helpers/StickyBanner.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type StickyBannerProps = ComponentProps & Sitecore.Components.General.StickyBanner.StickyBanner;

function StickyBanner_Default(props: StickyBannerProps) {
  const { themeData } = useTheme(StickyBannerTheme);

  const bannerContext = useStickyBanner();
  const { page: currentPage } = useSitecore();

  const { addBanner, removeBanner, bannerList } = bannerContext ?? {};

  const [isDismissed, setIsDismissed] = useState(false);

  // Convert scrollDepth to number safely
  const scrollDepth = Number(props.fields?.scrollDepth?.value?.replace(/ /g, '') ?? 0);

  const [scrollDepthReached, setScrollDepthReached] = useState(scrollDepth === 0);

  const { currentScreenWidth } = useCurrentScreenType();
  const [isMobile, setIsMobile] = useState(currentScreenWidth <= getBreakpoint('md'));

  const bannerId = props.rendering.uid ?? '';

  const isDisabledFromDesktopPage = (
    currentPage.layout.sitecore.route?.fields?.hideDesktopConsultationSlider as {
      value?: boolean;
    }
  )?.value;

  const isDisabledFromMobilePage = (
    currentPage.layout.sitecore.route?.fields?.hideMobileConsultationSlider as {
      value?: boolean;
    }
  )?.value;

  const BANNER_VISIBILITY =
    getEnum<BANNER_VISIBILITY_SETTING>(props.fields?.bannerVisibility) ?? 'desktop-mobile';

  useEffect(() => {
    if (!isMobile && isDisabledFromDesktopPage) {
      return;
    }

    if (isMobile && isDisabledFromMobilePage) {
      return;
    }

    // Add banner to context
    addBanner?.({
      bannerId,
      visibilityType: BANNER_VISIBILITY,
    });

    // Remove banner on unmount
    return () =>
      removeBanner?.({
        bannerId,
        visibilityType: BANNER_VISIBILITY,
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  useEffect(() => {
    setIsMobile(currentScreenWidth <= getBreakpoint('md'));
  }, [currentScreenWidth]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= scrollDepth && scrollDepthReached === false) {
        setScrollDepthReached(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isBannerEligibleToRender = () => {
    const list = isMobile ? bannerList?.mobileBannerList : bannerList?.desktopBannerList;
    return list?.[0]?.bannerId === bannerId;
  };

  if (isDismissed || (bannerList && !isBannerEligibleToRender()) || !scrollDepthReached) {
    return <></>;
  }

  return (
    <Component
      variant="full"
      backgroundVariant=""
      sectionWrapperClasses=""
      dataComponent="general/stickybanner"
      {...props}
    >
      <div
        className={classNames(
          'theme-black fixed bottom-0 left-0 right-0 z-20 col-span-12 place-items-center bg-theme-bg'
        )}
      >
        <div className={themeData.classes.bannerWrapper}>
          <div className={themeData.classes.textWrapper}>
            <Headline classes={themeData.classes.headline} {...props} />
            <BodyCopy classes={themeData.classes.bodyClass} {...props} />
          </div>

          <div className="col-span-2 place-content-center ml:col-span-5 ml:place-self-end ml:self-center">
            <ButtonGroup
              cta1={cta1ToButtonProps(props, themeData.classes.buttonGroupClass.cta1Classes)}
              cta2={cta2ToButtonProps(props, themeData.classes.buttonGroupClass.cta2Classes)}
              wrapperClasses={themeData.classes.buttonGroupClass.wrapper}
            />
          </div>

          <button
            className={themeData.classes.iconWrapper}
            onClick={() => {
              setIsDismissed(true);
              removeBanner?.({
                bannerId,
                visibilityType: BANNER_VISIBILITY,
              });
            }}
            title="btn-close"
          >
            <SvgIcon icon="close" size="md" />
          </button>
        </div>
      </div>
    </Component>
  );
}

export const Default = withDatasourceCheck(StickyBanner_Default);
