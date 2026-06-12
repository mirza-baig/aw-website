import { Image as JSSImage, ImageField } from '@sitecore-content-sdk/nextjs';
import { useTheme } from 'lib/context/ThemeContext';
import { getMediaUrl, MediaUrlType } from 'lib/utils/url-utils/get-media-url';
import { isSvgUrl } from 'lib/utils/url-utils/is-svg-url';
import useExperienceEditor from 'lib/utils/use-experience-editor';
import useNormalMode from 'lib/utils/use-normal-mode';
import { useWebsiteContext } from 'lib/website/WebsiteContext';
import NextImage from 'next/image';
import Script from 'next/script';
import { JSX } from 'react';
import { environment } from 'startup/environment';

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
  generateSchemaMarkup?: boolean;
};

const layoutToStyle: Record<Exclude<LayoutValue, undefined>, Record<string, string> | null> = {
  intrinsic: { maxWidth: '100%', height: 'auto' },
  responsive: { width: '100%', height: 'auto' },
  fill: null,
};

const Image = ({
  image,
  layout = 'responsive',
  focus = 'center',
  generateSchemaMarkup = true,
}: ImageProps): JSX.Element => {
  const { themeName } = useTheme();
  const isEE = useExperienceEditor();
  const isNormalMode = useNormalMode();
  const { siteInfo } = useWebsiteContext();
  // If we're in EE, we still want to render the image for editing, even when it's empty.
  if (!image?.value?.src && !isEE) {
    return <></>;
  }
  const imageValue = image?.value;
  const isSvg = !!imageValue && !!imageValue.src && isSvgUrl(imageValue.src);
  const contentUrl = getMediaUrl(imageValue, MediaUrlType.Canonical, siteInfo!, environment);

  const ldJsonScriptImage = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl,
    creator: 'Andersen Windows',
  };

  const width =
    typeof imageValue?.width === 'string'
      ? Number.parseInt(imageValue.width, 10)
      : imageValue?.width;

  const height =
    typeof imageValue?.height === 'string'
      ? Number.parseInt(imageValue.height, 10)
      : imageValue?.height;

  return (
    <>
      {generateSchemaMarkup &&
        themeName === 'aw' && ( // Include the generateSchemaMarkup check
          <Script
            id=""
            strategy="beforeInteractive"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJsonScriptImage) }}
          />
        )}
      {isNormalMode ? (
        <NextImage
          src={getMediaUrl(imageValue, MediaUrlType.Cdn, siteInfo!, environment)}
          alt={`${imageValue?.alt}`}
          width={width ?? 0}
          height={height ?? 0}
          fill={layout === 'fill'}
          style={{
            ...layoutToStyle[layout],
            objectFit: 'cover',
            objectPosition: focus,
          }}
          unoptimized={isSvg}
          overrideSrc={getMediaUrl(imageValue, MediaUrlType.Relative, siteInfo!, environment)}
        />
      ) : (
        <JSSImage
          field={image}
          style={{
            ...layoutToStyle[layout],
            objectFit: 'cover',
            objectPosition: focus,
          }}
        />
      )}
    </>
  );
};

export default Image;
