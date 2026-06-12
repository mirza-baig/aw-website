import { Image as JSSImage, ImageField } from '@sitecore-content-sdk/nextjs';
import { isSvgUrl } from 'lib/utils/url-utils/is-svg-url';
import { removeCdnHostName } from 'lib/utils/url-utils/remove-cdn-host-name';
import useExperienceEditor from 'lib/utils/use-experience-editor';
import useNormalMode from 'lib/utils/use-normal-mode';
import NextImage from 'next/image';
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

  // If we're in EE, we still want to render the image for editing, even when it's empty.
  if (!image?.value?.src && !isEE) {
    return <></>;
  }

  const imageValue = image?.value;
  const isSvg = !!imageValue && !!imageValue.src && isSvgUrl(imageValue.src);

  return (
    // If not in normal mode, render the Sitecore JSS image.

    isNormalMode ? (
      <NextImage
        src={`${imageValue?.src}`}
        alt={`${imageValue?.alt}`}
        width={80}
        height={80}
        // layout={layout}
        fill={layout === 'fill'}
        style={{ objectPosition: focus }}
        // objectPosition={focus}
        className={className}
        unoptimized={isSvg}
        overrideSrc={`${removeCdnHostName(imageValue?.src)}`}
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
