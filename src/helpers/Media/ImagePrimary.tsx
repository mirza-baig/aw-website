import ImageWrapper from './ImageWrapper';
import { LayoutValue, maxhTypes, maxwTypes, RatioTypes } from './types';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export type ImagePrimaryProps = Sitecore.FieldSets.ImagePrimary &
  Sitecore.FieldSets.ImagePrimaryCaption & {
    hideCaption?: boolean;
    imageLayout?: LayoutValue;
    additionalDesktopClasses?: string;
    additionalMobileClasses?: string;
    ratio?: RatioTypes;
    maxH?: maxhTypes;
    maxW?: maxwTypes;
    focusArea?: string;
    priority?: boolean;
    alwaysUseFocusArea?: boolean;
  };

const ImagePrimary = (props: ImagePrimaryProps) => {
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
    alwaysUseFocusArea: props.alwaysUseFocusArea,
  };

  return <ImageWrapper {...params} />;
};

export default ImagePrimary;
