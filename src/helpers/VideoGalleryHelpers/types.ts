import { Field } from '@sitecore-content-sdk/nextjs';
import { ImagePrimaryProps } from 'helpers/Media/ImagePrimary';
import { ImagePrimaryProps as VideoPrimaryProps } from 'helpers/Media/MediaPrimary/MediaPrimary';

type MobileGalleryStyles = 'list' | 'sidescroll';
export type DesktopGalleryStyles =
  | MobileGalleryStyles
  | 'playlist'
  | 'sidescrollwithoutvideo'
  | 'sidescrollwithoutvideoandfield';

export type VideoItemProps = (ImagePrimaryProps | VideoPrimaryProps) & {
  fields: { createdBy: Field<string>; postedDate: Field<string> };
};
