'use client';
import { Field, Image as JSSImage, ImageField, Item } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import { useTheme } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';
import { getBreakpoint } from 'lib/utils/get-screen-type';
import { getMediaUrl, MediaUrlType } from 'lib/utils/url-utils/get-media-url';
import { isSvgUrl } from 'lib/utils/url-utils/is-svg-url';
import useExperienceEditor from 'lib/utils/use-experience-editor';
import useNormalMode from 'lib/utils/use-normal-mode';
import { useWebsiteContext } from 'lib/website/WebsiteContext';
import NextImage from 'next/image';
import Script from 'next/script';
import { JSX, useEffect, useState } from 'react';
import { environment } from 'startup/environment';

import { Caption } from '../Caption';
import { LayoutValue, maxhTypes, maxwTypes, RatioTypes } from './types';

export type ImageWrapperProps = {
  image?: ImageField;
  mobileImage?: ImageField;
  mobileFocusArea?: Item;
  caption?: Field<string>;
  hideCaption?: boolean;
  imageLayout?: LayoutValue;
  additionalDesktopClasses?: string;
  additionalMobileClasses?: string;
  ratio?: RatioTypes;
  maxH?: maxhTypes;
  maxW?: maxwTypes;
  focusArea?: string;
  priority?: boolean;
  generateSchemaMarkup?: boolean;
  alwaysUseFocusArea?: boolean;
};

function convertToPixels(value: unknown, src?: string, fallback?: number): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim().replace(/px$/i, '');
    if (/^\d+$/.test(trimmed)) {
      const n = Number.parseInt(trimmed, 10);
      if (Number.isFinite(n)) {
        return n;
      }
    }
  }

  if (src) {
    try {
      const u = new URL(src);
      const w = Number.parseInt(u.searchParams.get('w') ?? '', 10);
      if (Number.isFinite(w)) {
        return w;
      }
    } catch {
      // ignore invalid URL
    }
  }

  return typeof fallback === 'number' && Number.isFinite(fallback) ? fallback : undefined;
}

const layoutToStyle: Record<Exclude<LayoutValue, undefined>, Record<string, string> | null> = {
  intrinsic: { maxWidth: '100%', height: 'auto' },
  responsive: { width: '100%', height: 'auto' },
  fill: null,
};

const normalizeLayout = (
  imageLayout: LayoutValue,
  maxH: maxhTypes,
  maxW: maxwTypes
): Exclude<LayoutValue, undefined> => {
  if ((maxH || maxW) && !imageLayout) {
    return 'responsive';
  }
  return imageLayout ?? 'responsive';
};

const getDesktopClasses = (additionalDesktopClasses?: string): string =>
  additionalDesktopClasses?.trim()
    ? additionalDesktopClasses
        .trim()
        .split(' ')
        .map((cls) => `md:${cls}`)
        .join(' ')
    : '';

// Hook to determine if viewport is mobile. Returns null on server and until it determines the viewport on client.
function useIsMobile(initial: boolean | null = null) {
  const [isMobile, setIsMobile] = useState<boolean | null>(initial);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const bp = getBreakpoint('md');
    const mql = window.matchMedia(`(max-width: ${bp}px)`);
    const update = () => setIsMobile(mql.matches);
    update(); // set correct value at mount
    mql.addEventListener?.('change', update);
    return () => mql.removeEventListener?.('change', update);
  }, []);

  return isMobile;
}

type Variant = 'placeholder' | 'desktop-only' | 'mobile' | 'desktop' | 'ee';

// Decide which image variant to render based on mode, asset availability and viewport (if available).
function decideVariant(params: {
  isNormalMode: boolean;
  mobileImageExists: boolean;
  isMobile: boolean | null;
}): Variant {
  const { isNormalMode, mobileImageExists, isMobile } = params;
  if (!isNormalMode) {
    return 'ee';
  }
  if (mobileImageExists && isMobile === null) {
    return 'placeholder';
  }
  if (!mobileImageExists) {
    return 'desktop-only';
  }
  return isMobile ? 'mobile' : 'desktop';
}

const getObjectFitDesktop = (
  layout: Exclude<LayoutValue, undefined>,
  ratio: RatioTypes,
  alwaysUseFocusArea: boolean
): 'contain' | 'cover' | 'none' | undefined => {
  if (layout === 'fill') {
    return ratio === 'portrait' ? 'contain' : 'cover';
  }
  if (alwaysUseFocusArea) {
    return 'none';
  }
  return undefined;
};

const getBaseStyle = (layout: Exclude<LayoutValue, undefined>) =>
  layout === 'fill' ? {} : layoutToStyle[layout];

function computePlaceholderAspect(args: {
  isMobile: boolean | null;
  mobileImageExists: boolean;
  w?: number;
  h?: number;
  mw?: number;
  mh?: number;
}) {
  const { isMobile, mobileImageExists, w, h, mw, mh } = args;
  if (isMobile === null) {
    return `${w ?? mw ?? 16} / ${h ?? mh ?? 9}`;
  }
  if (isMobile && mobileImageExists) {
    return `${mw ?? w ?? 16} / ${mh ?? h ?? 9}`;
  }
  return `${w ?? mw ?? 16} / ${h ?? mh ?? 9}`;
}

const ImageWrapper = ({
  image,
  mobileImage,
  mobileFocusArea,
  caption,
  hideCaption = false,
  imageLayout = 'responsive',
  additionalDesktopClasses,
  additionalMobileClasses,
  ratio = 'picture',
  maxH = '',
  maxW = '',
  focusArea = 'center',
  priority,
  generateSchemaMarkup = true,
  alwaysUseFocusArea = false,
}: ImageWrapperProps): JSX.Element => {
  const isMobile = useIsMobile(null);

  const { themeName } = useTheme();
  const isEE = useExperienceEditor();
  const isNormalMode = useNormalMode();
  const { siteInfo } = useWebsiteContext();

  if (!image?.value?.src && !isEE) {
    return <></>;
  }

  const layout = normalizeLayout(imageLayout, maxH, maxW);

  const imageValue = image?.value;
  const imageMobileValue = mobileImage?.value;
  const mobileImageExists = !!imageMobileValue?.src?.trim();

  const isSvg = !!imageValue?.src && isSvgUrl(imageValue.src);
  const isMobileSvg = !!imageMobileValue?.src && isSvgUrl(imageMobileValue.src);

  const mobileObjectPosition =
    focusArea !== '' ? focusArea : (getEnum<string>(mobileFocusArea) ?? '');
  const objectFitDesktop = getObjectFitDesktop(layout, ratio, alwaysUseFocusArea);

  const imageCss = layout !== 'intrinsic' ? `aspect-${ratio} ${maxH} ${maxW}` : '';
  const desktopClasses = getDesktopClasses(additionalDesktopClasses);

  const w = convertToPixels(imageValue?.width, imageValue?.src);
  const h = convertToPixels(imageValue?.height, imageValue?.src);
  const mw = convertToPixels(imageMobileValue?.width, imageMobileValue?.src);
  const mh = convertToPixels(imageMobileValue?.height, imageMobileValue?.src);

  const imageSrc = getMediaUrl(imageValue, MediaUrlType.Cdn, siteInfo!, environment);
  const imageMobileSrc = getMediaUrl(imageMobileValue, MediaUrlType.Cdn, siteInfo!, environment);
  const overrideSrc = getMediaUrl(imageValue, MediaUrlType.Relative, siteInfo!, environment);
  const overrideSrcMobile = getMediaUrl(
    imageMobileValue,
    MediaUrlType.Relative,
    siteInfo!,
    environment
  );

  const commonImageProps = {
    fill: layout === 'fill' ? true : undefined,
    priority,
    styleBase: getBaseStyle(layout),
    objectPosition: alwaysUseFocusArea ? (mobileObjectPosition ?? 'center') : undefined,
  };

  const variant = decideVariant({ isNormalMode, mobileImageExists, isMobile });

  const ldJsonScriptImage = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: getMediaUrl(imageValue, MediaUrlType.Canonical, siteInfo!, environment),
    creator: 'Andersen Windows',
  };

  // Placeholder for CLS: only when both assets exist and we don't know viewport yet.
  if (variant === 'placeholder') {
    return (
      <div
        id="image-wrapper-placeholder"
        className={classNames('relative')}
        style={{
          aspectRatio: computePlaceholderAspect({ isMobile, mobileImageExists, w, h, mw, mh }),
          width: '100%',
          height: 'auto',
          display: 'inline-block',
        }}
        aria-hidden="true"
      />
    );
  }

  const renderDesktopImage = () => (
    <NextImage
      src={imageSrc}
      alt={`${imageValue?.alt}`}
      fill={commonImageProps.fill}
      width={layout === 'fill' ? undefined : w}
      height={layout === 'fill' ? undefined : h}
      priority={commonImageProps.priority}
      unoptimized={isSvg}
      style={{
        ...commonImageProps.styleBase,
        objectFit: objectFitDesktop,
        objectPosition: commonImageProps.objectPosition,
      }}
      overrideSrc={overrideSrc}
    />
  );

  const renderMobileImage = () => (
    <NextImage
      src={imageMobileSrc}
      alt={`${imageMobileValue?.alt}`}
      fill={commonImageProps.fill}
      width={layout === 'fill' ? undefined : mw}
      height={layout === 'fill' ? undefined : mh}
      priority={commonImageProps.priority}
      unoptimized={isMobileSvg}
      style={{
        ...commonImageProps.styleBase,
        objectFit: layout === 'responsive' ? 'contain' : 'cover',
        objectPosition: commonImageProps.objectPosition,
      }}
      overrideSrc={overrideSrcMobile}
    />
  );

  return (
    <>
      {generateSchemaMarkup && themeName === 'aw' && (
        <Script
          id=""
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJsonScriptImage) }}
        />
      )}

      <div
        className={classNames(
          'relative',
          layout === 'fill' ? 'mx-auto' : '',
          imageCss,
          additionalMobileClasses,
          desktopClasses
        )}
      >
        {variant === 'ee' && <JSSImage field={image} priority={priority} />}
        {(variant === 'desktop-only' || variant === 'desktop') && renderDesktopImage()}
        {variant === 'mobile' && renderMobileImage()}
        {!hideCaption && <Caption caption={caption} />}
      </div>
    </>
  );
};

export default ImageWrapper;
