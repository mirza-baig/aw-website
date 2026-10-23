import { Image as JSSImage, ImageField } from '@sitecore-content-sdk/nextjs';
import environment from 'lib/environment';
import { getMediaUrl, MediaUrlType } from 'lib/utils/url-utils/get-media-url';
import { isSvgUrl } from 'lib/utils/url-utils/is-svg-url';
import useExperienceEditor from 'lib/utils/use-experience-editor';
import useNormalMode from 'lib/utils/use-normal-mode';
import { useWebsiteContext } from 'lib/website/WebsiteContext';
import Image from 'next/image';
import { JSX } from 'react';

import { FocusAreaValue, LayoutValue } from './types';

/**
 * JSS does not yet support Next Image in Exprience Editor
 * This component will switch between the two based on environment
 * which allows us to get the various performance benefits from Next Image
 *
 * Note that the images may display slightly differently in
 * Experience Editor as the JSS Image component doesn't have the same layout options
 */

export type ImageProps = {
  image?: ImageField;
  layout?: LayoutValue;
  focus?: FocusAreaValue;
  className?: string;
};

const SvgIcon = ({
  image,
  className,
  layout = 'intrinsic',
  focus = 'left',
}: ImageProps): JSX.Element => {
  const isEE = useExperienceEditor();
  const isNormalMode = useNormalMode();
  const { siteInfo } = useWebsiteContext();

  // If we're in EE, we still want to render the image for editing, even when it's empty.
  if (!image?.value?.src && !isEE) {
    return <></>;
  }

  const imageValue = image?.value;
  const isSvg = !!imageValue && !!imageValue.src && isSvgUrl(imageValue.src);

  return (
    // If not in normal mode, render the Sitecore JSS image.
    isNormalMode ? (
      <Image
        src={getMediaUrl(imageValue?.src, MediaUrlType.Cdn, siteInfo!, environment)}
        alt={`${imageValue?.alt}`}
        width={80}
        height={80}
        fill={layout === 'fill'}
        style={{ objectPosition: focus }}
        className={className}
        unoptimized={isSvg}
        overrideSrc={`${getMediaUrl(imageValue?.src, MediaUrlType.Cdn, siteInfo!, environment)}`}
      />
    ) : (
      <JSSImage
        field={image}
        style={{
          objectPosition: focus,
        }}
      />
    )
  );
};

export default SvgIcon;
