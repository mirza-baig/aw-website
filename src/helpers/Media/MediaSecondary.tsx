import { JSX } from 'react';

import ImageWrapper from './ImageWrapper';
import { LayoutValue, maxhTypes, maxwTypes, MediaStaticProps, RatioTypes } from './types';
import { getStaticPropsFromVideoItem as getVideoStaticProps } from './Video/get-static-props';
import VideoWrapper from './Video/VideoWrapper';
import { isVideoItem } from './VideoUtils';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export type ImagePrimaryProps = Sitecore.FieldSets.ImageSecondary &
  Sitecore.FieldSets.ImageSecondaryCaption &
  Sitecore.FieldSets.VideoSecondary & {
    imageLayout?: LayoutValue;
    additionalDesktopClasses?: string;
    additionalMobileClasses?: string;
    ratio?: RatioTypes;
    shortsRatio?: boolean;
    maxH?: maxhTypes;
    maxW?: maxwTypes;
    focusArea?: string;
    rendering?: {
      componentName?: string;
    };
    staticProps?: MediaStaticProps;
  };

// include SEO Schema For Vimeo and YouTube Videos for - ContentBlockWithMedia HeroHalfMedia PromoFeaturedMedia PromoGeneric PromoReviewContentAuthored
// PromoSwatches. GenericCard, Video Gallery and Video Gallery Dynamic : script added at component level

const MediaSecondary = (props: ImagePrimaryProps): JSX.Element => {
  const componentName = props?.rendering?.componentName as string;
  const includeSEOSchemaForVimeoYouTube = [
    'ContentBlockWithMedia',
    'HeroHalfMedia',
    'PromoFeaturedMedia',
    'PromoGeneric',
    'PromoReviewContentAuthored',
    'PromoSwatches',
  ].includes(componentName);
  if (props.fields?.secondaryVideo && isVideoItem(props.fields?.secondaryVideo)) {
    return (
      <VideoWrapper
        videoItem={props.fields.secondaryVideo}
        includeSEOSchemaForVimeoYouTube={includeSEOSchemaForVimeoYouTube}
        shortsRatio={props.shortsRatio}
      />
    );
  }

  const params = {
    image: props.fields?.secondaryImage,
    mobileImage: props.fields?.secondaryImageMobile,
    mobileFocusArea: props.fields?.secondaryImageMobileFocusArea,
    caption: props.fields?.secondaryImageCaption,
    imageLayout: props.imageLayout,
    additionalDesktopClasses: props.additionalDesktopClasses,
    additionalMobileClasses: props.additionalMobileClasses,
    ratio: props.ratio,
    maxH: props.maxH,
    maxW: props.maxW,
    focusArea: props.focusArea,
  };

  return <ImageWrapper {...params} />;
};

export const getStaticProps = async (props: ImagePrimaryProps): Promise<MediaStaticProps> => {
  const result: MediaStaticProps = {};

  const videoItem = props.fields?.secondaryVideo;
  if (videoItem && isVideoItem(videoItem)) {
    const videoResult = await getVideoStaticProps(videoItem);
    result.videoStaticProps = videoResult.vimeoStaticProps ? videoResult : undefined;
  }

  return result;
};

export default MediaSecondary;
