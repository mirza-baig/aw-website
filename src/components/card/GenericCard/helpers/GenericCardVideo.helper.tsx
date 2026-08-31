'use client';
import { ImageField } from '@sitecore-content-sdk/nextjs';
import { DesktopVideoDisplayStyleType } from 'components/listing/XupCardCollection/helpers/XupCardCollection.types';
import Image from 'helpers/Media/Image';
import { ImagePrimaryProps } from 'helpers/Media/ImagePrimary';
import MediaPrimary from 'helpers/Media/MediaPrimary/MediaPrimary';
import { MediaStaticProps } from 'helpers/Media/types';
import { getJsonLD, isVideoItem, playStopVideo } from 'helpers/Media/VideoUtils';
import ModalWrapper from 'helpers/ModalWrapper/ModalWrapper';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { useTheme } from 'lib/context/ThemeContext';
import { FeatureFlags } from 'lib/feature-flags/feature-flags';
import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import Script from 'next/script';
import { useState } from 'react';
import ReactDOM from 'react-dom';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type VideoCardProps = ImagePrimaryProps &
  Sitecore.FieldSets.VideoPrimary & {
    fields?: { videoThumbnailImage?: ImageField };
    desktopVideoDisplayStyle: DesktopVideoDisplayStyleType;
    staticProps?: MediaStaticProps;
  };

const VideoCard = ({ desktopVideoDisplayStyle, ...props }: VideoCardProps) => {
  const { currentScreenWidth } = useCurrentScreenType();

  const { themeName } = useTheme();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModalAndPlayVideo = () => {
    const primaryVideo = props.fields?.primaryVideo;
    if (!isVideoItem(primaryVideo)) {
      return;
    }
    setIsModalOpen(true);
    playStopVideo(primaryVideo, 'playVideo');
  };

  // Video Schema
  const jsonLD = getJsonLD(
    props?.fields?.primaryVideo,
    props.fields?.videoThumbnailImage,
    props.staticProps?.videoStaticProps
  );

  if (desktopVideoDisplayStyle === 'in-line' && currentScreenWidth > getBreakpoint('md')) {
    return (
      <>
        {!FeatureFlags.values.releaseSchemaOrgGraph && jsonLD && (
          <Script
            id=""
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }}
          />
        )}
        <MediaPrimary
          {...props}
          videoThumbnailImage={props?.fields?.videoThumbnailImage}
          staticProps={props.staticProps}
        />
      </>
    );
  }

  if (desktopVideoDisplayStyle === 'in-modal' || currentScreenWidth <= getBreakpoint('md')) {
    return (
      <>
        {!FeatureFlags.values.releaseSchemaOrgGraph && jsonLD && (
          <Script
            id=""
            strategy="beforeInteractive"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }}
          />
        )}
        <div className="relative">
          {props.fields?.videoThumbnailImage?.value?.src && (
            <>
              <span
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.code === 'Enter' || e.code === 'Space') {
                    openModalAndPlayVideo();
                  }
                }}
                onClick={() => openModalAndPlayVideo()}
                className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              >
                <SvgIcon icon="play" size={currentScreenWidth > getBreakpoint('md') ? 80 : 91} />
              </span>
              <Image image={props.fields?.videoThumbnailImage} layout="responsive" />
            </>
          )}
        </div>
        {isModalOpen &&
          ReactDOM.createPortal(
            <ModalWrapper
              size="genericCard"
              isModalOpen={isModalOpen}
              handleClose={() => setIsModalOpen(false)}
            >
              <div className="p-m">
                <MediaPrimary {...props} />
              </div>
            </ModalWrapper>,
            document.querySelector(`.${themeName}`) || document.body
          )}
      </>
    );
  }

  return <></>;
};

export default VideoCard;
