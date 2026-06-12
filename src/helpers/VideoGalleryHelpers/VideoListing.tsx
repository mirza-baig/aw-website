import { Pager as HeadlessPager } from '@coveo/headless';
import { Field } from '@sitecore-content-sdk/nextjs';
import { VideoGalleryProps } from 'components/general/VideoGallery/VideoGallery';
import { getPagerTheme } from 'components/search/Search/helpers/Search.Pager.theme';
import { Pager } from 'helpers/Coveo/Pager/Pager';
import Headline from 'helpers/Headline/Headline';
import { ImagePrimaryProps as VideoPrimaryProps } from 'helpers/Media/MediaPrimary/MediaPrimary';
import { SliderWrapper } from 'helpers/SliderWrapper';
import { SliderRefType, SliderType } from 'helpers/SliderWrapper/SliderWrapper';
import { useModalIdContext } from 'lib/context/GenericModalIDContext';
import { useTheme } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';
import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import { JSX, useEffect, useRef, useState } from 'react';

import Pagination from './Pagination.Helper';
import { DesktopGalleryStyles, VideoItemProps } from './types';
import VideoDetails from './VideoDetails.Helper';
import { VideoListingTheme } from './VideoGallery.theme';
import VideoGalleryItem from './VideoGalleryItem.Helper';
import { useCurrentVideoStore } from './VideoListing.store';
import VideoPlayer from './VideoPlayer.Helper';

export type { DesktopGalleryStyles, VideoItemProps };

const MAX_IFRAME_LOOKUP_COUNT = 5;

const PLAYER_REGION_ID = 'video-player-region';

const VideoListing = (
  props: VideoGalleryProps & { isCoveoDrivenPagination?: boolean; pagerController?: HeadlessPager }
) => {
  const { themeData, themeName } = useTheme(VideoListingTheme);
  const pagerThemeData = getPagerTheme(themeName);

  const { fields, isCoveoDrivenPagination = false, pagerController } = props;

  const { currentScreenWidth } = useCurrentScreenType();
  const { setSelectedModalId } = useModalIdContext();

  const {
    currentPlayingVideo,
    setCurrentPlayingVideo,
    selectedVideoIndex,
    setSelectedVideoIndex,
    tabClicked,
    setTabClicked,
  } = useCurrentVideoStore();

  //#region States
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
  const [coveoPagerState, setCoveoPagerState] = useState<HeadlessPager['state'] | undefined>(
    pagerController?.state
  );
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  //#endregion

  const sliderRef = useRef<SliderType | undefined>(undefined);
  const playerRegion = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedVideoIndex(window.innerWidth < 1008 ? -1 : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => pagerController?.subscribe(() => setCoveoPagerState(pagerController.state)),
    [pagerController]
  );

  useEffect(() => {
    if (tabClicked) {
      setSelectedVideoIndex(-1);
    } else {
      let _videoIndex = selectedVideoIndex;

      if (isCoveoDrivenPagination && coveoPagerState) {
        // Coveo does not have all the videos in the source. Video list have only videos of current page.
        // In order to handle selection of video on different page we gotta perform below calculations.
        const _currentPageIndex = coveoPagerState.currentPage - 1;
        _videoIndex = Math.abs(_currentPageIndex * videosPerPage - selectedVideoIndex);

        setCurrentPageIndex(_currentPageIndex);
      }

      try {
        const newVideo =
          fields?.videos?.length <= 0
            ? undefined
            : (fields?.videos[_videoIndex] as unknown as VideoItemProps);
        if (!currentPlayingVideo || (newVideo && newVideo != currentPlayingVideo)) {
          if (fields?.videos?.length > 0) {
            setCurrentPlayingVideo(fields?.videos[_videoIndex] as unknown as VideoItemProps);
          }
        }
      } catch {}
    }

    // 'coveoPagerState' and 'isCoveoDrivenPagination' are configured for coveo driven state and pagination;
    // 'videosPerPage' is passing layout props which can not change, so we can ignore react-hooks/exhaustive-deps warning for this suggested dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVideoIndex, fields?.videos]);

  // This useEffect handles the video changes for non coveo components as in non coveo components video fields will be init only for the first time
  useEffect(() => {
    if (!currentPlayingVideo) {
      if (!isCoveoDrivenPagination && fields?.videos?.length > 0) {
        setCurrentPlayingVideo(fields?.videos[selectedVideoIndex] as unknown as VideoItemProps);
      }
    }

    // 'isCoveoDrivenPagination' are configured for coveo driven state and pagination;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVideoIndex, fields?.videos]);

  // Handle page change events for coveo pager
  useEffect(() => {
    if (isCoveoDrivenPagination && coveoPagerState) {
      setCurrentPageIndex(coveoPagerState.currentPage - 1);
    }

    // 'coveoPagerState' and 'isCoveoDrivenPagination' are configured for coveo driven state and pagination;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coveoPagerState?.currentPage]);

  if (!fields?.videos) {
    return null;
  }

  // Common settings
  const videosPerPage = coveoPagerState?.currentPages.length ?? 5; //If this is coveo pager then set max items per page as configured in coveo
  const displayStyle =
    getEnum<DesktopGalleryStyles>(
      currentScreenWidth < getBreakpoint('ml')
        ? fields?.mobileDisplayStyle
        : fields?.desktopDisplayStyle
    ) ?? 'list';

  const isMinimalSideScrollVariant =
    displayStyle === 'sidescrollwithoutvideo' || displayStyle === 'sidescrollwithoutvideoandfield';

  const layoutClasses = themeData.classes?.layouts?.[displayStyle] ?? 'list';

  const sliderSettings = {
    // React-slick's responsive functionality does not work properly here that's why we've opt for the conditional slider settings
    infinite: false,
    speed: 500,
    dots:
      currentScreenWidth < getBreakpoint('ml') || displayStyle === 'sidescrollwithoutvideoandfield',
    slidesToShow:
      currentScreenWidth < getBreakpoint('md')
        ? 1
        : currentScreenWidth < getBreakpoint('ml')
          ? 2
          : 4,
    slidesToScroll: 1,
    initialSlide:
      currentScreenWidth < getBreakpoint('ml') && displayStyle === 'sidescroll'
        ? 0
        : selectedVideoIndex,
    enableNumberedPagination:
      currentScreenWidth < getBreakpoint('ml') || displayStyle === 'sidescrollwithoutvideoandfield',
    afterIndexChange: () => currentScreenWidth < getBreakpoint('ml') && setSelectedVideoIndex(-1),
  };
  //

  //#region Logic functions
  const playStopVideo = (
    videoId: string,
    action: 'playVideo' | 'stopVideo',
    iframeLookupTryCount = 3
  ) => {
    try {
      const videoIframe = document.getElementById(videoId) as HTMLIFrameElement;

      // If videoIframe element is not rendered in DOM try to get it again
      if (!videoIframe && iframeLookupTryCount <= MAX_IFRAME_LOOKUP_COUNT) {
        setTimeout(() => playStopVideo(videoId, action, ++iframeLookupTryCount), 1000);
      } else {
        videoIframe.contentWindow?.postMessage(
          `{"event":"command", "func":"${action}", "args":""}`,
          '*'
        );
      }
    } catch (_) {
      console.error("ERROR! Can't find Video iFrame");
    }
  };

  const focusPlayerRegion = (opts?: { smooth?: boolean; center?: boolean }) => {
    const el = playerRegion.current;
    if (!el) {
      return;
    }
    el.focus({ preventScroll: true });
    el.scrollIntoView({
      behavior: opts?.smooth ? 'smooth' : 'auto',
      block: opts?.center ? 'center' : 'nearest',
    });
  };

  const selectVideo = (videoId: string, videoItemIndex: number) => {
    setTabClicked(false);
    setSelectedVideoIndex(videoItemIndex);

    if (currentScreenWidth < getBreakpoint('ml') || isMinimalSideScrollVariant) {
      setIsVideoModalVisible(true);
      setSelectedModalId('VideoItemModal');
    }

    requestAnimationFrame(() => {
      setTimeout(() => {
        focusPlayerRegion({ smooth: true, center: true });
      }, 60);
    });

    playStopVideo(videoId, 'playVideo');
  };

  const closeModal = () => {
    try {
      const videoId = (
        (currentPlayingVideo as unknown as VideoPrimaryProps).fields?.primaryVideo?.fields
          ?.videoId as Field<string>
      )?.value;

      playStopVideo(videoId, 'stopVideo');
      setSelectedModalId('');
      setIsVideoModalVisible(false);
    } catch {
      setIsVideoModalVisible(false);
    }
  };

  //#endregion

  //#region Rendering functions
  const renderVideoCardsList = () => {
    let _videos = fields?.videos;

    if (!isCoveoDrivenPagination && displayStyle === 'list') {
      _videos = _videos.slice(
        currentPageIndex * videosPerPage,
        (currentPageIndex + 1) * videosPerPage
      );
    }

    const renderVideoCards = () => {
      return _videos.map((video: VideoItemProps, index: number) => {
        const videoItemIndex = videosPerPage * currentPageIndex + index;
        return (
          <VideoDetails
            key={index}
            isVideoPlayerItem={false}
            isSelectedVideo={videoItemIndex === selectedVideoIndex}
            videoDetailsClasses={layoutClasses?.videoCardsList}
            videoItem={video}
            videoItemIndex={videoItemIndex}
            selectVideo={selectVideo}
            displayStyle={displayStyle}
            sliderRef={sliderRef as SliderRefType}
            playerRegionId={PLAYER_REGION_ID}
          />
        );
      });
    };

    const renderCards = (): JSX.Element | JSX.Element[] => {
      switch (displayStyle) {
        case 'sidescroll':
        case 'sidescrollwithoutvideo':
        case 'sidescrollwithoutvideoandfield':
          return (
            <SliderWrapper
              sliderRef={sliderRef as SliderRefType}
              sliderSettings={sliderSettings}
              theme={'aw'}
            >
              {renderVideoCards()}
            </SliderWrapper>
          );
        case 'list':
        case 'playlist':
        default:
          return renderVideoCards();
      }
    };

    return (
      <div className={layoutClasses?.videoCardsList?.videoCardsListWrapper}>{renderCards()}</div>
    );
  };
  //#endregion

  return (
    <>
      {isMinimalSideScrollVariant && <div className="col-span-12 h-px bg-gray"></div>}
      {props.fields?.headlineText?.value && (
        <div className="col-span-12">
          <Headline
            classes={layoutClasses.headlineText}
            fields={{ headlineText: props.fields.headlineText }}
          />
        </div>
      )}
      {isVideoModalVisible &&
        ((currentScreenWidth < getBreakpoint('md') && displayStyle !== 'sidescroll') ||
          isMinimalSideScrollVariant) && (
          <VideoGalleryItem
            video={currentPlayingVideo as VideoItemProps}
            isVideoModalVisible={isVideoModalVisible}
            closeModal={closeModal}
            videoGalleryItemClasses={{ ...layoutClasses?.videoPlayer }}
          />
        )}
      {currentScreenWidth >= getBreakpoint('md') && !isMinimalSideScrollVariant && (
        <>
          <div className="col-span-12 h-px bg-gray"></div>
          <VideoPlayer
            video={currentPlayingVideo as VideoItemProps}
            videoPlayerClasses={{ ...layoutClasses?.videoPlayer }}
            playerRegion={playerRegion}
            playerRegionId={PLAYER_REGION_ID}
          />
          {displayStyle !== 'list' && <div className="col-span-12 h-px bg-gray"></div>}
        </>
      )}
      {renderVideoCardsList()}
      {
        // Don't render pagination if display style is not list
        displayStyle === 'list' &&
          (isCoveoDrivenPagination && pagerController ? (
            <div className="col-span-12">
              <Pager pagerClasses={pagerThemeData} controller={pagerController} />
            </div>
          ) : (
            fields.videos.length > 5 && (
              <Pagination
                totalPages={fields.videos.length}
                currentPageIndex={currentPageIndex}
                setCurrentPageIndex={setCurrentPageIndex}
                paginationClasses={layoutClasses?.pagination}
              />
            )
          ))
      }
      {displayStyle === 'sidescrollwithoutvideoandfield' &&
        currentScreenWidth >= getBreakpoint('md') && (
          <div className="col-span-12 h-px bg-gray"></div>
        )}
    </>
  );
};

export default VideoListing;
