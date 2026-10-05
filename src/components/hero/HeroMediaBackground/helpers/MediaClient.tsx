'use client';

import classNames from 'classnames';
import { ComponentMargin, ComponentPadding } from 'helpers/Component/Component';
import MediaPrimary from 'helpers/Media/MediaPrimary/MediaPrimary';
import { Item } from 'lib/types/item';
import { useCurrentScreenType } from 'lib/utils/get-screen-type';
import { EnumField } from 'lib/utils/sitecore-utils/enum-field';
import { getEnum } from 'lib/utils/sitecore-utils/get-enum';
import { getTheme } from 'lib/website/theme';
import { JSX, useEffect, useState } from 'react';
import SvgIcon from 'src/helpers/SvgIcon/SvgIcon';

import { HeroMediaBackgroundTheme } from './HeroMediaBackground.theme';
import { HeroMediaBackgroundProps } from './types';
import { asEnumField, getSpacingClass } from './utils';
import { Sitecore } from '.sitecore/AndersenWindows.sitecore';

function getHasPaddingInValue(field?: EnumField<ComponentPadding>) {
  return getEnum<ComponentPadding>(field)?.toLowerCase().includes('padding');
}

export function MediaClient(props: HeroMediaBackgroundProps): JSX.Element | null {
  const themeData = getTheme(props.page.customProps.theme, HeroMediaBackgroundTheme);
  const { screenType } = useCurrentScreenType();
  const [isVideoPaused, setIsVideoPaused] = useState(true);

  function togglePlayPause() {
    const videoId = (props.fields?.primaryVideo as Item<Sitecore.Elements.Media.YouTubeVideo>)
      ?.fields.videoId.value;

    const iframeContentWindow = (document.getElementById(videoId) as HTMLIFrameElement)
      ?.contentWindow;

    if (iframeContentWindow) {
      //SQ-NOSCAN-START - Justification: This is a safe use of postMessage to control the YouTube iframe player. The message is sent to the iframe's content window, which is a trusted source (the YouTube player). The message format follows the YouTube Player API specification, and the target origin is set to '*' to allow communication with the iframe. This is necessary for controlling playback (play/pause) of the video.
      iframeContentWindow.postMessage(
        `{"event":"command","func":"${isVideoPaused ? 'playVideo' : 'pauseVideo'}","args":""}`,
        '*'
      );
      //SQ-NOSCAN-END
      setIsVideoPaused(!isVideoPaused);
    }
  }

  useEffect(() => {
    const autoPlayField = props.fields?.primaryVideo?.fields?.youTubeAutoPlay;
    const isAutoPlay = autoPlayField && 'value' in autoPlayField ? autoPlayField.value : false;

    setIsVideoPaused(!isAutoPlay);
  }, [props.fields?.primaryVideo?.fields?.youTubeAutoPlay]);

  const paddingField = asEnumField<ComponentPadding>(props.fields?.componentPadding);
  const marginField = asEnumField<ComponentMargin>(props.fields?.componentMargin);
  const componentPadding = getSpacingClass(
    undefined,
    getHasPaddingInValue(paddingField) ? paddingField : undefined,
    marginField
  );

  const isDesktop = screenType !== 'sm';
  let hasOverlay = !!getEnum(props.fields?.overlay);
  if (props.page.customProps.theme === 'rba' && props.fields?.overlay === null) {
    hasOverlay = true;
  }

  return (
    <>
      <div className={themeData.classes.mediaContainer}>
        <MediaPrimary imageLayout="responsive" ratio="auto" priority {...props} />

        {props.fields?.primaryVideo && (
          <button
            className={classNames(
              'absolute right-0 bottom-0 z-10 cursor-pointer rounded-full bg-black',
              themeData.classes.iconWrapper
            )}
            onClick={togglePlayPause}
            aria-label={isVideoPaused ? 'Play video' : 'Pause video'}
            type="button"
          >
            {isVideoPaused ? <SvgIcon icon="play" size="40" /> : <SvgIcon icon="pause" size="40" />}
          </button>
        )}
      </div>

      {hasOverlay && isDesktop && (
        <div
          className={classNames(
            themeData.classes.overlay,
            props.page.customProps.theme === 'aw' ? componentPadding : ''
          )}
        ></div>
      )}
    </>
  );
}
