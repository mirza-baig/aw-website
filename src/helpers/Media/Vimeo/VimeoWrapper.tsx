'use client';
import { Field, ImageField } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { FeatureFlags } from 'lib/feature-flags/feature-flags';
import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import { normalizeSitecoreDateStringFormattedWithTime } from 'lib/utils/string-utils/normalize-sitecore-date-string-formatted-with-time';
import Script from 'next/script';
import { CSSProperties, JSX, useState } from 'react';

import Image from '../Image';
import { VideoStaticProps, VimeoVideoStaticProps } from '../types';
import { Sitecore } from '.sitecore/AndersenWindows.model';

const container: CSSProperties = {
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  paddingTop: '56.25%',
};

const iframestyle: CSSProperties = {
  position: 'absolute',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  width: '100%',
  height: '100%',
};

export type VimeoProps = Sitecore.Elements.Media.VimeoVideo & {
  videoThumbnailImage?: ImageField;
  includeSEOSchemaForVimeoYouTube?: boolean;
  staticProps?: VimeoVideoStaticProps;
};

const VimeoWrapper = (videoItem: VimeoProps): JSX.Element => {
  const [showThumbnail, setShowThumbnail] = useState(
    Boolean(videoItem?.videoThumbnailImage?.value?.src)
  );

  const { currentScreenWidth } = useCurrentScreenType();

  // If the video has no value, return nothing - not sure if videoId is the best way to check this currently
  if (!videoItem.fields?.videoId?.value) {
    return <></>;
  }

  const {
    videoHeight = {} as Field<number>,
    videoWidth = {} as Field<number>,
    videoId = {} as Field<string>,
    // videoLazyLoad, // @TODO: implement this
    vimeoAutoPause = {} as Field<boolean>,
    vimeoAutoPlay = {} as Field<boolean>,
    vimeoBackground = {} as Field<boolean>,
    vimeoByline = {} as Field<boolean>,
    vimeoColor = {} as Field<string>,
    // vimeoControls, // this is currently breaking things for some reason
    vimeoDNT = {} as Field<boolean>,
    vimeoKeyboard = {} as Field<boolean>,
    vimeoLoop = {} as Field<boolean>,
    vimeoMuted = {} as Field<boolean>,
    vimeoPictureInPicture = {} as Field<boolean>,
    vimeoPlaysInline = {} as Field<boolean>,
  } = videoItem.fields;

  const videoHashParam = videoItem.fields.vimeoVideoHash?.value
    ? `h=${videoItem.fields.vimeoVideoHash?.value}`
    : '';
  const vimeoUrl = `https://player.vimeo.com/video/${videoId.value}?${videoHashParam}&portrait=0&autopause=${vimeoAutoPause.value}&autoplay=${vimeoAutoPlay.value}&background=${vimeoBackground.value}&byline=${vimeoByline.value}&color=${vimeoColor.value}&dnt=${vimeoDNT.value}&keyboard=${vimeoKeyboard.value}&loop=${vimeoLoop.value}&muted=${vimeoMuted.value}&pip=${vimeoPictureInPicture.value}&playsinline=${vimeoPlaysInline.value}`;

  const jsonLD = getJsonLD(videoItem, videoItem.videoThumbnailImage, {
    vimeoStaticProps: videoItem.staticProps,
  });

  function hideThumbnailAndPlayVideo() {
    playStopVideo(videoItem, 'playVideo');
    setShowThumbnail(false);
  }
  return (
    <>
      {videoItem.includeSEOSchemaForVimeoYouTube && !FeatureFlags.values.releaseSchemaOrgGraph && (
        <Script
          id=""
          strategy="beforeInteractive"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }}
        />
      )}
      <div className="relative">
        {showThumbnail && !vimeoAutoPlay.value && (
          <div className="relative z-10 bg-white ">
            <span
              onKeyDown={(e) => {
                if (e.code === 'Enter' || e.code === 'Space') {
                  hideThumbnailAndPlayVideo();
                }
              }}
              onClick={() => hideThumbnailAndPlayVideo()}
              className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            >
              <SvgIcon icon="play" size={currentScreenWidth > getBreakpoint('md') ? 80 : 91} />
            </span>
            <Image image={videoItem.videoThumbnailImage} layout="responsive" />
          </div>
        )}
        <div
          style={container}
          className={classNames(
            showThumbnail && !vimeoAutoPlay.value ? 'absolute! top-0 left-0 right-0 p-0!' : ''
          )}
        >
          <iframe
            id={videoId.value}
            style={iframestyle}
            src={vimeoUrl}
            width={videoWidth.value || '640'}
            height={videoHeight.value || '360'}
            loading="lazy"
            allow="autoplay; fullscreen; picture-in-picture"
          ></iframe>
        </div>
      </div>
    </>
  );
};

export const getJsonLD = (
  video: Sitecore.Elements.Media.VimeoVideo,
  thumbnail?: ImageField,
  staticProps?: VideoStaticProps
): Record<string, unknown> => {
  const formattedDate =
    video.fields?.lastUpdated?.value &&
    video.fields?.lastUpdated?.value != '0001-01-01T00:00:00Z' &&
    normalizeSitecoreDateStringFormattedWithTime(video.fields?.lastUpdated?.value);

  const result = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    contentURL: `https://vimeo.com/${video.fields.videoId.value}`,
    description: video.fields.videoDescription.value ?? '',
    embedUrl: `https://player.vimeo.com/video/${video.fields.videoId.value}`,
    name: video.fields.videoName.value ?? '',
    thumbnailUrl: thumbnail?.value?.src ?? staticProps?.vimeoStaticProps ?? '',
    uploadDate: formattedDate ?? '',
  };
  return result;
};

export const playStopVideo = (
  video: Sitecore.Elements.Media.VimeoVideo,
  action: 'playVideo' | 'stopVideo' | 'pauseVideo'
): void => {
  const videoId = video.fields.videoId.value;
  const videoIframe = document.getElementById(videoId) as HTMLIFrameElement;
  const actionMap: Record<typeof action, string> = {
    playVideo: 'play',
    stopVideo: 'pause',
    pauseVideo: 'pause',
  };

  if (!videoIframe) {
    setTimeout(() => playStopVideo(video, action), 1000);
  } else {
    videoIframe.contentWindow?.postMessage(`{"method":"${actionMap[action]}"`, '*');
  }
};

export default VimeoWrapper;
