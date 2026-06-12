import { Field } from '@sitecore-content-sdk/nextjs';
import { DesktopGalleryStyles, VideoItemProps } from 'helpers/VideoGalleryHelpers/types';
import { ComponentProps } from 'lib/component-props';
import { EnumField } from 'lib/utils/get-enum';

// Type definition for VideoGallery props used by GlobalVideoGallery and VideoListing
export type VideoGalleryProps = ComponentProps & {
  fields: {
    headlineText?: Field<string>;
    desktopDisplayStyle?: EnumField<DesktopGalleryStyles>;
    mobileDisplayStyle?: EnumField<DesktopGalleryStyles>;
    videos: VideoItemProps[];
  };
  staticProps?: unknown;
};

// // Note: Full VideoGallery component implementation will be added when Sitecore templates are created
// // For now, this file provides the VideoGalleryProps type needed by video search functionality
// const VideoGalleryPlaceholder = {};
// export default VideoGalleryPlaceholder;
