import { Field } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import { Eyebrow } from 'helpers/Eyebrow';
import Headline from 'helpers/Headline/Headline';
import { ImagePrimaryProps } from 'helpers/Media/ImagePrimary';
import ImageWrapper from 'helpers/Media/ImageWrapper';
import MediaPrimary, {
  ImagePrimaryProps as VideoPrimaryProps,
} from 'helpers/Media/MediaPrimary/MediaPrimary';
import { SliderRefType } from 'helpers/SliderWrapper/SliderWrapper';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import React from 'react';

import { DesktopGalleryStyles, VideoItemProps } from './types';
import { Sitecore } from '.sitecore/AndersenWindows.model';

const VideoDetails = ({
  videoItem,
  videoItemIndex,
  isSelectedVideo,
  isVideoPlayerItem,
  displayStyle,
  videoDetailsClasses,
  selectVideo,
  sliderRef,
  playerRegionId,
}: {
  videoItem: VideoItemProps;
  videoItemIndex?: number;
  isSelectedVideo?: boolean;
  isVideoPlayerItem: boolean;
  displayStyle?: DesktopGalleryStyles;
  videoDetailsClasses: { [key: string]: string };
  selectVideo?: (videoId: string, videoItemIndex: number) => void;
  sliderRef?: SliderRefType;
  playerRegionId: string;
}) => {
  type EyebrowProps = Sitecore.FieldSets.Eyebrow;
  type HeadlineProps = Sitecore.FieldSets.Headline;
  type BodyProps = Sitecore.FieldSets.BodyCopy;

  const { currentScreenWidth } = useCurrentScreenType();

  const isMinimalSideScrollVariant =
    displayStyle === 'sidescrollwithoutvideo' || displayStyle === 'sidescrollwithoutvideoandfield';

  const playVideo = () => {
    if (selectVideo) {
      selectVideo(
        ((videoItem as VideoPrimaryProps).fields?.primaryVideo?.fields?.videoId as Field<string>)
          ?.value,
        videoItemIndex ?? 0
      );
    }
  };

  return (
    <div
      tabIndex={0}
      role="button"
      aria-controls={playerRegionId}
      className={classNames(
        videoDetailsClasses?.videoDetailsWrapper,
        isSelectedVideo && !isMinimalSideScrollVariant && videoDetailsClasses?.selectedVideo
      )}
      onKeyDown={(e) => {
        if (e.code === 'Enter' || e.code === 'Space') {
          playVideo();
        } else if (e.shiftKey && e.keyCode == 9 && sliderRef?.current && videoItemIndex) {
          sliderRef.current.slickPrev();
        } else if (e.keyCode == 9 && sliderRef?.current && videoItemIndex) {
          sliderRef.current.slickNext();
        }
      }}
      onClick={() => playVideo()}
    >
      {!isVideoPlayerItem && (
        <div className="relative">
          {/* Render inline video player if display style is sidescroll in mobile */}
          {currentScreenWidth < getBreakpoint('md') &&
          displayStyle === 'sidescroll' &&
          isSelectedVideo ? (
            <MediaPrimary {...(videoItem as unknown as ImagePrimaryProps)} />
          ) : (
            <>
              <ImageWrapper
                additionalDesktopClasses={videoDetailsClasses?.thumbnail}
                additionalMobileClasses={videoDetailsClasses?.thumbnail}
                imageLayout={
                  displayStyle === 'sidescroll' || isMinimalSideScrollVariant ? 'intrinsic' : 'fill'
                }
                image={
                  (videoItem as unknown as Sitecore.BaseTemplates.BaseGalleryVideo)?.fields
                    ?.videoThumbnail
                }
                mobileImage={
                  (videoItem as unknown as Sitecore.BaseTemplates.BaseGalleryVideo)?.fields
                    ?.videoThumbnailMobile
                }
                mobileFocusArea={
                  (videoItem as unknown as Sitecore.BaseTemplates.BaseGalleryVideo)?.fields
                    ?.videoThumbnailMobileFocusArea
                }
              />
              <div
                className={classNames(
                  'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black'
                )}
              >
                <SvgIcon
                  icon="play"
                  size={
                    currentScreenWidth < getBreakpoint('ml')
                      ? displayStyle === 'sidescroll' || isMinimalSideScrollVariant
                        ? '48'
                        : '32'
                      : displayStyle === 'playlist' && '28'
                  }
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* Don't render the Video Details for 'sidescrollwithoutvideoandfield' variant in desktop view */}
      {!(
        displayStyle === 'sidescrollwithoutvideoandfield' &&
        currentScreenWidth >= getBreakpoint('md')
      ) && (
        <div className={videoDetailsClasses?.videoDescriptionWrapper}>
          {displayStyle !== 'playlist' && (
            <Eyebrow
              classes={videoDetailsClasses?.eyebrow}
              {...(videoItem as unknown as EyebrowProps)}
            />
          )}

          <Headline
            classes={videoDetailsClasses?.headline}
            {...(videoItem as unknown as HeadlineProps)}
          />
          {displayStyle !== 'playlist' && (
            <BodyCopy
              classes={videoDetailsClasses?.body}
              {...(videoItem as unknown as BodyProps)}
            />
          )}
        </div>
      )}
    </div>
  );
};
export default React.memo(VideoDetails);
