import { Result } from '@coveo/headless';
import classNames from 'classnames';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import { cta1ToButtonProps, cta2ToButtonProps } from 'helpers/Button/Utils';
import ButtonGroup from 'helpers/ButtonGroup/ButtonGroup';
import { Eyebrow } from 'helpers/Eyebrow';
import Headline from 'helpers/Headline/Headline';
import LinkWrapper from 'helpers/LinkWrapper/LinkWrapper';
import PhotoItemWithDetail, {
  PhotoItemWithDetailProps,
} from 'helpers/PhotoItemWithDetail/PhotoItemWithDetail';
import { getPhotoItemProps } from 'helpers/PhotoItemWithDetail/PhotoItemWithDetail.Utils';
import { Subheadline } from 'helpers/Subheadline';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { extractURLParts, getFieldsToInclude, getResultItemIndex } from 'lib/coveo';
import { getEnum } from 'lib/utils/get-enum';
import { isSvgUrl } from 'lib/utils/url-utils/is-svg-url';
import Image from 'next/image';
import { useRef } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type GridStyle = 'photo-gallery' | 'result-with-image' | 'result-without-image';

const GridTemplate = (
  resultItems: Sitecore.Elements.Search.GridResultItem[],
  // we can ignore below typeerror, as templateClasses can have string or nested themeclasses objects as well
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  templateClasses: { [property: string]: any },
  gridStyle: GridStyle
) => {
  const fieldsToInclude = getFieldsToInclude(resultItems, 'grid');

  const getImageAttributes = (imageField: string | undefined) => {
    if (imageField) {
      fieldsToInclude.push(`${imageField}_width`, `${imageField}_height`, `${imageField}_alt`);
    }
  };

  // Get image attributes
  resultItems.forEach((item) => {
    if (item.fields?.thumbnailImageField) {
      getImageAttributes(getEnum<string>(item.fields?.thumbnailImageField));
    }
    if (item.fields?.imageField) {
      getImageAttributes(getEnum<string>(item.fields?.imageField));
    }
  });

  const template = {
    priority: 1,
    conditions: [],
    fields: [
      'sc_templateid',
      'aw_xmc_video_youtubeautoloop',
      'aw_xmc_video_youtubeclosedcaptions',
      'aw_xmc_video_youtubeshowcontrols',
      'aw_xmc_video_youtubemute',
      'aw_xmc_video_facebookshowcaptions',
      'aw_xmc_video_facebookshowtext',
      'aw_xmc_videoid',
      'aw_xmc_videothumbnail_height',
      'aw_xmc_videothumbnail_width',
      'aw_xmc_videothumbnail_alt',
      'aw_xmc_videothumbnailmobile_height',
      'aw_xmc_videothumbnailmobile_width',
      'aw_xmc_videothumbnailmobile_alt',
      'aw_xmc_videotype',

      ...fieldsToInclude,
    ],
    content: (result: Result) => (
      <GridItemTemplateMarkup
        result={result}
        resultItems={resultItems}
        gridStyle={gridStyle}
        templateClasses={templateClasses}
      />
    ),
  };

  if (gridStyle === 'photo-gallery') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (template.content as any).modalTemplate = (result: Result) => {
      const photoObject = getPhotoItemProps(result, true, resultItems) as PhotoItemWithDetailProps;
      return <PhotoItemWithDetail key={result.uniqueId} {...photoObject} />;
    };
  }

  return template;
};

export default GridTemplate;

type GridItemTemplateMarkupProps = {
  resultItems: Sitecore.Elements.Search.GridResultItem[];
  // we can ignore below typeerror, as templateClasses can have string or nested themeclasses objects as well
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  templateClasses: { [property: string]: any };
  gridStyle: GridStyle;
  result: Result;
};

const GridItemTemplateMarkup = ({
  resultItems,
  result,
  gridStyle,
  templateClasses,
}: GridItemTemplateMarkupProps) => {
  const gridItemRef = useRef<HTMLDivElement>(null);

  const getRenderingFields = (
    gridStyle: GridStyle,
    _result: Result,
    _resultItemToConsider: Sitecore.Elements.Search.GridResultItem
  ) => {
    const getImageFields = () => ({
      thumbnailImage:
        _result.raw[getEnum<string>(_resultItemToConsider.fields?.thumbnailImageField) ?? ''],
      thumbnailImageWidth:
        _result.raw[
          `${getEnum<string>(_resultItemToConsider.fields?.thumbnailImageField) ?? ''}_width`
        ],
      thumbnailImageHeight:
        _result.raw[
          `${getEnum<string>(_resultItemToConsider.fields?.thumbnailImageField) ?? ''}_height`
        ],
      thumbnailImageAlt:
        _result.raw[
          `${getEnum<string>(_resultItemToConsider.fields?.thumbnailImageField) ?? ''}_alt`
        ],
    });

    const getResultFields = () => {
      return {
        headline: {
          fields: {
            headlineText: {
              value: _result.raw[getEnum<string>(_resultItemToConsider.fields?.headingField) ?? ''],
            },
          },
        },
        subheadline: {
          fields: {
            subheadlineText: {
              value:
                _result.raw[getEnum<string>(_resultItemToConsider.fields?.subHeadingField) ?? ''],
            },
          },
        },
        description: {
          fields: {
            body: {
              value:
                _result.raw[getEnum<string>(_resultItemToConsider.fields?.descriptionField) ?? ''],
            },
          },
        },
        eyebrow: {
          fields: {
            eyebrowText: {
              value: _result.raw[getEnum<string>(_resultItemToConsider.fields?.eyebrowField) ?? ''],
            },
          },
        },
        cta: {
          fields: {
            cta1Link: {
              value: {
                ...extractURLParts(_result.clickUri),
                title: _resultItemToConsider.fields?.ctaText?.value,
                text: _resultItemToConsider.fields?.ctaText?.value,
              },
            },
            cta1Icon: {
              fields: {
                Value: {
                  value: 'arrow',
                },
              },
            },
            cta1Style: {
              fields: {
                Value: {
                  value: 'link',
                },
              },
            },
          },
        },
      };
    };

    switch (gridStyle) {
      case 'photo-gallery':
        return getImageFields();
      case 'result-with-image':
        return { ...getImageFields(), ...getResultFields() };
      case 'result-without-image':
        return getResultFields();
      default:
        return getImageFields();
    }
  };

  const resultItemIndex = getResultItemIndex(resultItems, result.raw.sc_templateid as string);

  const resultItemToConsider = resultItems[resultItemIndex];

  // we can ignore typings for the template renderingFields data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderingFields: any = resultItemToConsider
    ? getRenderingFields(gridStyle, result, resultItemToConsider)
    : {};

  return (
    <div
      ref={gridItemRef}
      className={classNames(
        'group relative  w-full ',
        gridStyle !== 'photo-gallery' ? templateClasses?.gridItem : 'cursor-pointer'
      )}
    >
      {!result?.raw['aw_xmc_videoid'] &&
        renderingFields.thumbnailImage &&
        renderingFields.cta?.fields?.cta1Link && (
          <LinkWrapper suppressLinkText={true} field={renderingFields.cta?.fields?.cta1Link}>
            <div className={templateClasses?.imageWrapper}>
              <Image
                src={`${renderingFields.thumbnailImage}`}
                width={`${renderingFields.thumbnailImageWidth ?? 300}`}
                height={`${renderingFields.thumbnailImageHeight ?? 300}`}
                alt={`${renderingFields.thumbnailImageAlt}`}
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                unoptimized={isSvgUrl(renderingFields.thumbnailImage)}
              />
              {/* Render icon if gridLayout is photo-gallery */}
              {gridStyle === 'photo-gallery' && (
                <SvgIcon
                  className="-translate-t-3/4 absolute top-1/2 left-1/2 -translate-x-1/2 rounded-full bg-black bg-opacity-[.65] p-l text-white opacity-0 transition-all ease-linear group-hover:-translate-y-1/2 group-hover:opacity-100"
                  icon="zoom-pinch"
                />
              )}
            </div>
          </LinkWrapper>
        )}
      {!result?.raw['aw_xmc_videoid'] &&
        renderingFields.thumbnailImage &&
        !renderingFields.cta?.fields?.cta1Link && (
          <div className={templateClasses?.imageWrapper}>
            <Image
              src={`${renderingFields.thumbnailImage}`}
              width={`${renderingFields.thumbnailImageWidth ?? 300}`}
              height={`${renderingFields.thumbnailImageHeight ?? 300}`}
              alt={`${renderingFields.thumbnailImageAlt}`}
              style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              unoptimized={isSvgUrl(renderingFields.thumbnailImage)}
            />
            {/* Render icon if gridLayout is photo-gallery */}
            {gridStyle === 'photo-gallery' && (
              <SvgIcon
                className="-translate-t-3/4 absolute top-1/2 left-1/2 -translate-x-1/2 rounded-full bg-black bg-opacity-[.65] p-l text-white opacity-0 transition-all ease-linear group-hover:-translate-y-1/2 group-hover:opacity-100"
                icon="zoom-pinch"
              />
            )}
          </div>
        )}
      {gridStyle !== 'photo-gallery' && (
        <>
          <Eyebrow classes={templateClasses?.eyebrow} {...renderingFields.eyebrow} />
          <Headline classes={templateClasses?.headline} {...renderingFields.headline} />
          <Subheadline classes={templateClasses?.subheadline} {...renderingFields.subheadline} />
          <BodyCopy classes={templateClasses?.body} {...renderingFields.description} />

          {!result?.raw['aw_xmc_videoid'] && (
            <ButtonGroup
              cta1={cta1ToButtonProps(
                renderingFields.cta,
                templateClasses?.buttonGroup.cta1Classes
              )}
              cta2={cta2ToButtonProps(
                renderingFields.cta,
                templateClasses?.buttonGroup.cta2Classes
              )}
              wrapperClasses={templateClasses?.buttonGroup.wrapper}
            />
          )}

          {result?.raw['aw_xmc_videoid'] && (
            <button
              aria-label="View More"
              title="View More"
              onClick={() => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                gridItemRef?.current &&
                  (
                    gridItemRef?.current?.querySelector('.videoItemWrapper') as HTMLDivElement
                  )?.click();
              }}
              className={templateClasses?.modalCta?.buttonClasses}
            >
              View More
              <SvgIcon icon={'arrow'} className={templateClasses?.modalCta?.iconClasses} />
            </button>
          )}
        </>
      )}
    </div>
  );
};
