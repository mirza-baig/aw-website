'use client';

import classNames from 'classnames';
import { cta1ToButtonProps, cta2ToButtonProps } from 'helpers/Button/Utils';
import ButtonGroup from 'helpers/ButtonGroup/ButtonGroup';
import { Eyebrow } from 'helpers/Eyebrow';
import Headline from 'helpers/Headline/Headline';
import MediaPrimary from 'helpers/Media/MediaPrimary/MediaPrimary';
import { playStopVideo } from 'helpers/Media/VideoUtils';
import RichTextWrapper from 'helpers/RichTextWrapper/RichTextWrapper';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';
import { useCurrentScreenType } from 'lib/utils/get-screen-type';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { useState } from 'react';

import { PromoMediaBackgroundTheme } from './helpers/PromoMediaBackground.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type PromoMediaBackgroundProps = ComponentProps &
  Sitecore.Components.Promo.PromoMediaBackground.PromoMediaBackground;

function PromoMediaBackground_Default(props: PromoMediaBackgroundProps) {
  const { fields } = props;
  const { themeData } = useTheme(PromoMediaBackgroundTheme);
  const { screenType } = useCurrentScreenType();
  const [isVideoPaused, setIsVideoPaused] = useState(false);

  if (!fields) {
    return null;
  }

  const isDesktop = screenType !== 'sm';
  const hasOverlay = !!getEnum(fields.overlay);

  let fontColorClass = '';

  if (hasOverlay) {
    fontColorClass = 'md:text-white';
  } else {
    switch (getEnum(fields.fontColor)) {
      case 'gray':
        fontColorClass = 'md:text-dark-gray';
        break;
      case 'white':
        fontColorClass = 'md:text-white';
        break;
      default:
        fontColorClass = 'md:text-black';
        break;
    }
  }

  function TogglePlayPause() {
    const video = props.fields?.primaryVideo;

    if (video) {
      playStopVideo(video, isVideoPaused ? 'playVideo' : 'pauseVideo');
      setIsVideoPaused(!isVideoPaused);
    }
  }

  return (
    <div data-component="promo/promomediabackground" className="relative m-auto">
      <div className={themeData.classes.mediaContainer}>
        <MediaPrimary
          imageLayout="fill"
          ratio="hero"
          additionalDesktopClasses="h-[280px] md:h-[620px]"
          additionalMobileClasses="h-[280px]"
          {...props}
        />
        {fields.primaryVideo && (
          <div
            className={classNames(
              'absolute right-0 bottom-0 z-10 cursor-pointer rounded-full bg-black',
              themeData.classes.iconWrapper
            )}
            onClick={TogglePlayPause}
          >
            {isVideoPaused ? <SvgIcon icon="play" size="40" /> : <SvgIcon icon="pause" size="40" />}
          </div>
        )}
      </div>
      {hasOverlay && isDesktop && <div className={themeData.classes.overlay}></div>}
      <div className={classNames(themeData.classes.contentWrapper, fontColorClass)}>
        <div className={classNames(themeData.classes.contentContainer, fontColorClass)}>
          <Eyebrow classes={classNames(themeData.classes.eyebrow, fontColorClass)} {...props} />
          <Headline classes={classNames(themeData.classes.headline, fontColorClass)} {...props} />
          <RichTextWrapper
            classes={classNames(themeData.classes.bodyClass, fontColorClass)}
            field={props.fields?.body}
          />
          {fields.cta1Link && (
            <ButtonGroup
              cta1={cta1ToButtonProps(props, themeData.classes.buttonGroupClass.cta1Classes)}
              cta2={cta2ToButtonProps(props, themeData.classes.buttonGroupClass.cta2Classes)}
              wrapperClasses={themeData.classes.buttonGroupClass.wrapper}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export const Default = withDatasourceCheck(PromoMediaBackground_Default);
