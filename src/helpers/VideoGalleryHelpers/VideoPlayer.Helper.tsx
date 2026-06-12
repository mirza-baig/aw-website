import { MediaPrimary } from 'helpers/Media';
import { ImagePrimaryProps } from 'helpers/Media/ImagePrimary';
import React from 'react';

import { VideoItemProps } from './types';
import VideoDetails from './VideoDetails.Helper';

const PLAYER_REGION_ID = 'video-player-region';

const VideoPlayer = ({
  video,
  videoPlayerClasses,
  playerRegion,
  playerRegionId,
}: {
  video: VideoItemProps;
  videoPlayerClasses: { [key: string]: string };
  playerRegion?: React.RefObject<HTMLDivElement | null>;
  playerRegionId?: string;
}) => {
  return (
    <>
      <div
        id={PLAYER_REGION_ID}
        ref={playerRegion}
        role="region"
        aria-label="Video Player"
        tabIndex={-1}
        className={videoPlayerClasses?.videoWrapper}
      >
        <MediaPrimary {...(video as unknown as ImagePrimaryProps)} />
      </div>
      <VideoDetails
        isVideoPlayerItem={true}
        videoDetailsClasses={videoPlayerClasses}
        videoItem={video}
        playerRegionId={playerRegionId ?? PLAYER_REGION_ID}
      />
    </>
  );
};

export default React.memo(VideoPlayer);

export { PLAYER_REGION_ID };
