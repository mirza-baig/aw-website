import { JSX } from 'react';

import ImageWrapper from './ImageWrapper';
import { LayoutValue, maxhTypes, maxwTypes, RatioTypes } from './types';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export type ImagePrimaryProps = Sitecore.FieldSets.ImageSecondary &
  Sitecore.FieldSets.ImageSecondaryCaption & {
    imageLayout?: LayoutValue;
    additionalDesktopClasses?: string;
    additionalMobileClasses?: string;
    ratio?: RatioTypes;
    maxH?: maxhTypes;
    maxW?: maxwTypes;
    focusArea?: string;
  };

const ImagePrimary = (props: ImagePrimaryProps): JSX.Element => {
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

export default ImagePrimary;
