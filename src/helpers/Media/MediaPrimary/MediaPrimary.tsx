import { ImageField } from '@sitecore-content-sdk/nextjs';
import { JSX } from 'react';

import ImageWrapper from '../ImageWrapper';
import { LayoutValue, maxhTypes, maxwTypes, MediaStaticProps, RatioTypes } from '../types';
import VideoWrapper from '../Video/VideoWrapper';
import { isVideoItem } from '../VideoUtils';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export type ImagePrimaryProps = Sitecore.FieldSets.ImagePrimary &
  Sitecore.FieldSets.ImagePrimaryCaption &
  Sitecore.FieldSets.VideoPrimary & {
    videoThumbnailImage?: ImageField;
    hideCaption?: boolean;
    imageLayout?: LayoutValue;
    additionalDesktopClasses?: string;
    additionalMobileClasses?: string;
    ratio?: RatioTypes;
    shortsRatio?: boolean;
    maxH?: maxhTypes;
    maxW?: maxwTypes;
    focusArea?: string;
    priority?: boolean;
    rendering?: {
      componentName?: string;
    };
    staticProps?: MediaStaticProps;
  };

// include SEO Schema For Vimeo and YouTube Videos for - ContentBlockWithMedia HeroHalfMedia PromoFeaturedMedia PromoGeneric PromoReviewContentAuthored
// PromoSwatches. GenericCard, Video Gallery and Video Gallery Dynamic : script added at component level

const MediaPrimary = (props: ImagePrimaryProps): JSX.Element => {
  const componentName = props?.rendering?.componentName as string;
  const includeSEOSchemaForVimeoYouTube = [
    'ContentBlockWithMedia',
    'HeroHalfMedia',
    'PromoFeaturedMedia',
    'PromoGeneric',
    'PromoReviewContentAuthored',
    'PromoSwatches',
  ].includes(componentName);
  if (props.fields?.primaryVideo && isVideoItem(props.fields?.primaryVideo)) {
    return (
      <VideoWrapper
        includeSEOSchemaForVimeoYouTube={includeSEOSchemaForVimeoYouTube}
        videoItem={props.fields.primaryVideo}
        videoThumbnailImage={props?.videoThumbnailImage}
        staticProps={props.staticProps?.videoStaticProps}
        shortsRatio={props.shortsRatio}
      />
    );
  }

  const params = {
    image: props.fields?.primaryImage,
    mobileImage: props.fields?.primaryImageMobile,
    mobileFocusArea: props.fields?.primaryImageMobileFocusArea,
    caption: props.fields?.primaryImageCaption,
    hideCaption: props.hideCaption,
    imageLayout: props.imageLayout,
    additionalDesktopClasses: props.additionalDesktopClasses,
    additionalMobileClasses: props.additionalMobileClasses,
    ratio: props.ratio,
    maxH: props.maxH,
    maxW: props.maxW,
    focusArea: props.focusArea,
    priority: props.priority,
  };

  return <ImageWrapper {...params} />;
};

export default MediaPrimary;
