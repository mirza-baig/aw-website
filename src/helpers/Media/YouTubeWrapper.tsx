'use client';
import { ImageField } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import { normalizeSitecoreDateStringFormattedWithTime } from 'lib/utils/string-utils/normalize-sitecore-date-string-formatted-with-time';
import Script from 'next/script';
import { CSSProperties, JSX, useEffect, useRef, useState } from 'react';

import Image from './Image';
import { VideoStaticProps } from './types';
import { Sitecore } from '.sitecore/AndersenWindows.model';

const container: CSSProperties = {
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
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

export type YouTubeProps = Sitecore.Elements.Media.YouTubeVideo & {
  videoThumbnailImage?: ImageField;
  includeSEOSchemaForVimeoYouTube?: boolean;
  shortsRatio?: boolean;
};

const YoutubeWrapper = (videoItem: YouTubeProps): JSX.Element => {
  const [showThumbnail, setShowThumbnail] = useState(
    Boolean(videoItem?.videoThumbnailImage?.value?.src)
  );
  const { currentScreenWidth } = useCurrentScreenType();

  const {
    videoHeight,
    videoWidth,
    videoId,
    // videoLazyLoad, // @TODO: implement this
    youTubeAutoLoop,
    youTubeShowControls,
    youTubeAutoPlay,
    youTubeDisableKeyboard,
    youTubeModestBranding,
    youTubeMute,
    // youTubeCaptions,
  } = videoItem.fields;

  const youtubeUrl = `https://www.youtube.com/embed/${videoId.value}?&loop=${
    youTubeAutoLoop.value ? 1 : 0
  }&controls=${youTubeShowControls.value ? 1 : 0}&autoplay=${
    youTubeAutoPlay.value ? 1 : 0
  }&disablekb=${youTubeDisableKeyboard.value ? 1 : 0}&modestbranding=${
    youTubeModestBranding.value ? 1 : 0
  }&mute=${youTubeAutoPlay.value ? 1 : youTubeMute.value}&playlist=${
    videoId.value
  }&enablejsapi=1&rel=0`;

  const [load, setLoad] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const currentVideoRef = videoRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setLoad(true);
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );

    if (currentVideoRef) {
      observer.observe(currentVideoRef);
    }

    return () => {
      if (currentVideoRef) {
        observer.unobserve(currentVideoRef);
      }
    };
  }, []);

  const jsonLD = getJsonLD(videoItem, videoItem.videoThumbnailImage);

  // If the video has no value, return nothing - not sure if videoId is the best way to check this currently
  if (!videoItem.fields?.videoId) {
    return <></>;
  }

  function hideThumbnailAndPlayVideo() {
    playStopVideo(videoItem, 'playVideo');
    setShowThumbnail(false);
  }

  return (
    <>
      {videoItem.includeSEOSchemaForVimeoYouTube && (
        <Script
          id=""
          strategy="beforeInteractive"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }}
        />
      )}
      <div className="relative">
        {showThumbnail && !youTubeAutoPlay.value && (
          <div className="relative z-10 bg-white">
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
          ref={videoRef}
          style={{
            ...container,
          }}
          className={classNames(
            showThumbnail && !youTubeAutoPlay.value ? 'absolute! top-0 left-0 right-0 p-0!' : '',
            videoItem.shortsRatio
              ? ''
              : videoItem?.fields?.youTubeRemoveTopBlackBorder?.value
                ? 'pt-[30.65%]'
                : 'pt-[56.25%]'
          )}
        >
          {load && (
            <iframe
              id={videoId.value}
              style={!videoItem.shortsRatio ? iframestyle : {}}
              className={videoItem.shortsRatio ? 'mx-auto aspect-9/16' : ''}
              name="ytwrapper"
              width={videoWidth.value}
              height={videoHeight.value}
              src={youtubeUrl}
              title={'Youtube Video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </div>
      </div>
    </>
  );
};

export const getJsonLD = (
  video: Sitecore.Elements.Media.YouTubeVideo,
  thumbnail?: ImageField,
  _staticProps?: VideoStaticProps
): Record<string, unknown> => {
  const formattedDate =
    video.fields?.lastUpdated?.value &&
    video.fields?.lastUpdated?.value != '0001-01-01T00:00:00Z' &&
    normalizeSitecoreDateStringFormattedWithTime(video.fields?.lastUpdated?.value);

  const result = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    contentURL: video.fields?.videoId
      ? `https://www.youtube.com/watch?v=${video.fields?.videoId.value}`
      : '',
    description: video.fields?.videoDescription?.value ?? '',
    embedUrl: video.fields?.videoId
      ? `https://www.youtube.com/embed/${video.fields?.videoId?.value}`
      : '',
    name: video.fields?.videoName?.value ?? '',
    thumbnailUrl:
      thumbnail?.value?.src ??
      `https://i.ytimg.com/vi/${video.fields?.videoId.value}/sddefault.jpg`,
    uploadDate: formattedDate || '',
  };
  return result;
};

export const playStopVideo = (
  video: Sitecore.Elements.Media.YouTubeVideo,
  action: 'playVideo' | 'stopVideo' | 'pauseVideo'
): void => {
  const videoId = video.fields.videoId.value;
  const videoIframe = document.getElementById(videoId) as HTMLIFrameElement;

  if (!videoIframe) {
    setTimeout(() => playStopVideo(video, action), 1000);
  } else {
    videoIframe.contentWindow?.postMessage(
      `{"event":"command", "func":"${action}", "args":""}`,
      '*'
    );
  }
};

export default YoutubeWrapper;
