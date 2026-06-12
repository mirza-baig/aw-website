import { Pager, ResultList, ResultListState } from '@coveo/headless';
import { VideoGalleryProps } from 'components/general/VideoGallery/VideoGallery';
import { getVideoItemListProps } from 'helpers/VideoGalleryHelpers/VideoItemUtils.Helper';
import VideoListing from 'helpers/VideoGalleryHelpers/VideoListing';
import React, { useEffect, useState } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

export type GlobalVideoGalleryProps = {
  controller: ResultList;
  pagerController: Pager;
  videoResultItems: Sitecore.Elements.Search.VideoResultItem[];
  hasFacets: boolean;
};

export const GlobalVideoGallery = ({
  controller,
  videoResultItems,
  pagerController,
}: GlobalVideoGalleryProps) => {
  const [videoListState, setVideoListState] = useState<ResultListState | undefined>(
    controller?.state
  );

  useEffect(() => controller?.subscribe(() => setVideoListState(controller.state)), [controller]);

  const getVideoListingProps = () => {
    const galleryProps = {
      fields: {
        videos: videoListState && getVideoItemListProps(videoListState, videoResultItems),
        componentSpacing: null,
        sectionId: {
          value: '',
        },
        eventName: {
          value: '',
        },
        eventType: {
          value: '',
        },
        eventZone: {
          value: '',
        },
      },
    };

    return galleryProps;
  };
  return (
    <div className="grid gap-s md:grid-cols-12 md:gap-s" id="globalVideoGallery">
      <VideoListing
        isCoveoDrivenPagination
        pagerController={pagerController}
        {...(getVideoListingProps() as unknown as VideoGalleryProps)}
      />
    </div>
  );
};
