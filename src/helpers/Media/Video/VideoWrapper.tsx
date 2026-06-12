'use client';
import { ImageField, Item } from '@sitecore-content-sdk/nextjs';
import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { useTheme } from 'lib/context/ThemeContext';
import { itemIsTemplate } from 'lib/utils/sitecore-utils/item-is-template';
import { JSX, useEffect, useRef } from 'react';

import FacebookWrapper from '../FacebookWrapper';
import { VideoStaticProps } from '../types';
import { playStopVideo, VideoItemTypes } from '../VideoUtils';
import VimeoWrapper from '../Vimeo/VimeoWrapper';
import YoutubeWrapper from '../YouTubeWrapper';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export type VideoItemType = Item & VideoItemTypes;

type VideoWrapperProps = {
  videoItem?: VideoItemType;
  videoThumbnailImage?: ImageField;
  includeSEOSchemaForVimeoYouTube?: boolean;
  staticProps?: VideoStaticProps;
  shortsRatio?: boolean;
};

const VideoWrapper = ({
  videoItem,
  videoThumbnailImage,
  includeSEOSchemaForVimeoYouTube,
  staticProps,
  shortsRatio,
}: VideoWrapperProps): JSX.Element => {
  const { themeName } = useTheme();
  const scrollOutRef = useRef<boolean>(false);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentVideoRef = videoRef.current;
    if (videoItem) {
      const pauseVideo = () => {
        playStopVideo(videoItem, 'pauseVideo');
      };

      window.addEventListener('scroll', (e) => {
        const rect = currentVideoRef?.getBoundingClientRect();
        const isVisible = rect && rect.bottom > 0 && rect.top < window.innerHeight;

        //if video is not in view and we are scrolling out of video (to help minimize callbacks)
        if (!isVisible && scrollOutRef.current) {
          e.stopPropagation();
          pauseVideo();
          scrollOutRef.current = false;
        } else if (isVisible) {
          scrollOutRef.current = true;
        }
      });

      document.addEventListener('sliderChange', (e) => {
        const rect = currentVideoRef?.getBoundingClientRect();
        const isXVisible = rect && rect.left < 0 && rect.right < 0;

        if (!isXVisible) {
          e.stopPropagation();
          pauseVideo();
        }
      });
      return () => {
        if (currentVideoRef) {
          window.removeEventListener('scroll', () => {
            pauseVideo();
          });
          document.removeEventListener('sliderChange', () => {
            pauseVideo();
          });
        }
      };
    }
    //needed the empty return since we only want the observer if there's a video

    return () => {};
  }, [videoItem, themeName]);

  if (!videoItem) {
    return <></>;
  }

  if (
    itemIsTemplate<Sitecore.Elements.Media.YouTubeVideo>(
      videoItem,
      SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Elements.Media.YouTubeVideo
        .Id
    )
  ) {
    return (
      <div ref={videoRef}>
        <YoutubeWrapper
          {...videoItem}
          videoThumbnailImage={videoThumbnailImage}
          includeSEOSchemaForVimeoYouTube={includeSEOSchemaForVimeoYouTube}
          shortsRatio={shortsRatio}
        />
      </div>
    );
  }

  if (
    itemIsTemplate<Sitecore.Elements.Media.FacebookVideo>(
      videoItem,
      SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Elements.Media.FacebookVideo
        .Id
    )
  ) {
    return <FacebookWrapper {...(videoItem as Sitecore.Elements.Media.FacebookVideo)} />;
  }

  if (
    itemIsTemplate<Sitecore.Elements.Media.VimeoVideo>(
      videoItem,
      SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Elements.Media.VimeoVideo.Id
    )
  ) {
    return (
      <div ref={videoRef}>
        <VimeoWrapper
          {...(videoItem as Sitecore.Elements.Media.VimeoVideo)}
          videoThumbnailImage={videoThumbnailImage}
          includeSEOSchemaForVimeoYouTube={includeSEOSchemaForVimeoYouTube}
          staticProps={staticProps?.vimeoStaticProps}
        />
      </div>
    );
  }

  return <div>Unrecognized Video Type</div>;
};

export default VideoWrapper;
