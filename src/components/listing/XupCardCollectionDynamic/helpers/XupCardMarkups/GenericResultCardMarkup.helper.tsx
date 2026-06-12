'use client';
import classNames from 'classnames';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import { cta1ToButtonProps, cta2ToButtonProps } from 'helpers/Button/Utils';
import ButtonGroup from 'helpers/ButtonGroup/ButtonGroup';
import { Eyebrow } from 'helpers/Eyebrow';
import Headline from 'helpers/Headline/Headline';
import { LayoutValue } from 'helpers/Media/types';
import { Subheadline } from 'helpers/Subheadline';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { getScaledImageShortSideUrl } from 'lib/utils/photo-item-utils';
import { isSvgUrl } from 'lib/utils/url-utils/is-svg-url';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { DynamicXupCardStyle } from '../XupCardCollectionDynamic.Template.helper';

type GenericResultCardMarkupProps = {
  dynamicXupCardStyle: DynamicXupCardStyle;
  // we can ignore below type error for type Any, as type of value in those object parameters are uncertain
  /* eslint-disable @typescript-eslint/no-explicit-any */
  templateClasses: { [property: string]: any };

  renderingFields: any;
};

const layoutToStyle: Record<Exclude<LayoutValue, undefined>, Record<string, string> | null> = {
  intrinsic: { maxWidth: '100%', height: 'auto' },
  responsive: { width: '100%', height: 'auto' },
  fill: null,
};

const RenderThumbnailElement = ({
  dynamicXupCardStyle,
  templateClasses,
  renderingFields,
}: GenericResultCardMarkupProps) => {
  if (!renderingFields.thumbnailImage) {
    return <></>;
  }

  const maxSizeForThumbnail = '300';
  const imageWidth = renderingFields.thumbnailImageWidth || maxSizeForThumbnail;
  const imageHeight = renderingFields.thumbnailImageHeight || maxSizeForThumbnail;
  const imageContainerWidth = renderingFields?.useThumbnailFocusArea ? undefined : imageWidth;
  const imageContainerHeight = renderingFields?.useThumbnailFocusArea ? undefined : imageHeight;
  const imageLayout = renderingFields?.useThumbnailFocusArea ? 'fill' : 'responsive';
  const squareAspectCss = renderingFields?.useThumbnailFocusArea ? ' relative aspect-square ' : '';
  const objectPosition =
    renderingFields?.useThumbnailFocusArea && renderingFields?.thumbnailFocusArea
      ? renderingFields?.thumbnailFocusArea
      : undefined;

  // If there is no object position set, return the thumbnail image in its original format rather
  // than trying to scale it.
  const newSrc = objectPosition
    ? getScaledImageShortSideUrl(
        renderingFields.thumbnailImage,
        maxSizeForThumbnail,
        imageWidth,
        imageHeight
      )
    : renderingFields.thumbnailImage;

  return (
    <div className={`${templateClasses?.imageWrapper} ${squareAspectCss}`}>
      <Image
        src={newSrc}
        width={imageContainerWidth}
        height={imageContainerHeight}
        alt={`${renderingFields.thumbnailImageAlt}`}
        fill={imageLayout == 'fill'}
        style={{
          ...layoutToStyle[imageLayout],
          objectFit: 'cover',
          objectPosition: objectPosition,
        }}
        unoptimized={isSvgUrl(renderingFields.thumbnailImage)}
      />
      {/* Render icon if gridLayout is photo-gallery */}
      {dynamicXupCardStyle === 'photo-gallery' && (
        <SvgIcon
          className="-translate-t-3/4 absolute top-1/2 left-1/2 -translate-x-1/2 rounded-full bg-black bg-opacity-[.65] p-l text-white opacity-0 transition-all ease-linear group-hover:-translate-y-1/2 group-hover:opacity-100"
          icon="zoom-pinch"
        />
      )}
    </div>
  );
};

const GenericResultCardMarkup = ({
  dynamicXupCardStyle,
  templateClasses,
  renderingFields,
}: GenericResultCardMarkupProps) => {
  // RbA Affiliate Card Award: Read more at the end of the 3rd line of description text
  const [isExpanded, setIsExpanded] = useState(false);
  const [lineCount, setLineCount] = useState(0);
  const textContainerRef = useRef(null);
  const descriptionText = renderingFields.description?.fields?.body?.value;

  useEffect(() => {
    const countLines = () => {
      const textContainer = textContainerRef.current as unknown as HTMLElement;
      if (textContainerRef.current && dynamicXupCardStyle === 'awards') {
        const containerRect = textContainer.getBoundingClientRect();
        const lines = Math.ceil(containerRect.height / 21);
        setLineCount(lines);
      }
    };
    const resizeListener = () => {
      if (window.innerWidth !== previousWidth) {
        countLines();
        previousWidth = window.innerWidth;
      }
    };

    let previousWidth = window.innerWidth;
    setTimeout(countLines, 500);

    if (dynamicXupCardStyle === 'awards') {
      window.addEventListener('resize', resizeListener);
    }

    return () => {
      if (dynamicXupCardStyle === 'awards') {
        window.removeEventListener('resize', resizeListener);
      }
    };
  }, [dynamicXupCardStyle]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={classNames(
        'group relative  w-full ',
        dynamicXupCardStyle !== 'photo-gallery' ? templateClasses?.gridItem : 'cursor-pointer'
      )}
    >
      <RenderThumbnailElement
        dynamicXupCardStyle={dynamicXupCardStyle}
        templateClasses={templateClasses}
        renderingFields={renderingFields}
      ></RenderThumbnailElement>
      {dynamicXupCardStyle !== 'photo-gallery' && (
        <>
          {dynamicXupCardStyle !== 'awards' && (
            <Eyebrow classes={templateClasses?.eyebrow} {...renderingFields.eyebrow} />
          )}
          <Headline classes={templateClasses?.headline} {...renderingFields.headline} />
          {dynamicXupCardStyle !== 'awards' && (
            <Subheadline classes={templateClasses?.subheadline} {...renderingFields.subheadline} />
          )}
          {dynamicXupCardStyle === 'awards' ? (
            <div className="mb-s">
              <div
                ref={textContainerRef}
                className={classNames('mb-0', lineCount > 3 && !isExpanded ? 'line-clamp-3' : '')}
              >
                <BodyCopy
                  fields={{ body: { value: descriptionText } }}
                  classes={(templateClasses?.body, 'mb-0 text-dark-gray')}
                />
              </div>

              {lineCount > 3 && (
                <span
                  className="cursor-pointer text-body text-darkprimary underline"
                  onClick={toggleExpand}
                >
                  {isExpanded ? ' Read less' : ' Read more'}
                </span>
              )}
            </div>
          ) : (
            <BodyCopy classes={templateClasses?.body} {...renderingFields.description} />
          )}

          <ButtonGroup
            cta1={cta1ToButtonProps(renderingFields.cta, templateClasses?.buttonGroup?.cta1Classes)}
            cta2={cta2ToButtonProps(renderingFields.cta, templateClasses?.buttonGroup?.cta2Classes)}
            wrapperClasses={templateClasses?.buttonGroup.wrapper}
          />
        </>
      )}
    </div>
  );
};

export default GenericResultCardMarkup;
