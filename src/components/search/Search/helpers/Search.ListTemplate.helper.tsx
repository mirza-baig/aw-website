// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck: Disable TypeScript checks to suppress unknown type errors
import { Result } from '@coveo/headless';
import { RichText } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import { ResultLink } from 'helpers/Coveo/ResultList/ResultLink';
import { RichTextWrapper } from 'helpers/RichTextWrapper';
import { getFieldsToInclude, getResultItemIndex } from 'lib/coveo';
import { getEnum } from 'lib/utils/get-enum';
import { isSvgUrl } from 'lib/utils/url-utils/is-svg-url';
import Image from 'next/image';
import { useRef } from 'react';
import { twMerge } from 'tailwind-merge';

import { Sitecore } from '.sitecore/AndersenWindows.model';

const ListTemplate = (
  resultItems: Sitecore.Elements.Search.ListResultItem[],
  // we can ignore below typeerror, as templateClasses can have string or nested themeclasses objects as well
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  templateClasses: { [property: string]: any }
) => {
  const fieldsToInclude = getFieldsToInclude(resultItems, 'list');

  return {
    priority: 1,
    conditions: [],
    fields: [
      'sc_templateid',
      'aw_xmc_sitesearchtopic',
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
      <ListTemplateMarkup
        result={result}
        resultItems={resultItems}
        templateClasses={templateClasses}
      />
    ),
  };
};

export default ListTemplate;

type ListTemplateMarkup = {
  resultItems: Sitecore.Elements.Search.ListResultItem[];
  result: Result;
  // we can ignore below typeerror, as templateClasses can have string or nested themeclasses objects as well
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  templateClasses: { [property: string]: any };
};

const ListTemplateMarkup = ({ result, resultItems, templateClasses }: ListTemplateMarkup) => {
  const listItemRef = useRef<HTMLLIElement>(null);

  const resultItemIndex = getResultItemIndex(resultItems, result.raw.sc_templateid as string);

  const resultItemToConsider = resultItems[resultItemIndex];

  const renderingFields = {
    eyebrow:
      result.raw[getEnum<string>(resultItemToConsider.fields?.eyebrowField) ?? ''] ??
      result.raw.aw_xmc_sitesearchtopic,
    headline: result.raw[getEnum<string>(resultItemToConsider.fields?.headingField) ?? ''],
    description: result.raw[getEnum<string>(resultItemToConsider.fields?.descriptionField) ?? ''],
    image: result.raw[getEnum<string>(resultItemToConsider.fields?.imageField) ?? ''],
    icon: resultItemToConsider.fields?.icon?.value?.src ?? '',
  };

  return (
    <li
      ref={listItemRef}
      key={result.uniqueId}
      className={twMerge(
        templateClasses?.resultItem,
        result.rankingModifier === 'FeaturedResult' && templateClasses?.featuredResultItem
      )}
      onClick={(e) => {
        if (
          result.rankingModifier === 'FeaturedResult' ||
          (e.target as HTMLElement).classList.contains('result-image')
        ) {
          // Get link element from featured result item
          e.currentTarget.getElementsByTagName('a')[0].click();
        }
      }}
    >
      <article className="flex items-center justify-between">
        <div className="flex-1">
          {renderingFields.eyebrow && (
            <p className={templateClasses?.resultEyebrow}>{`${renderingFields.eyebrow}`}</p>
          )}
          {renderingFields.headline && (
            <h2
              className={classNames(
                'line-clamp-2 md:line-clamp-none',
                templateClasses?.resultHeading,
                { 'cursor-pointer': result?.raw['aw_xmc_videoid'] },
                result.rankingModifier === 'FeaturedResult' &&
                  'group-hover:font-heavy group-hover:underline'
              )}
              onClick={() => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                result?.raw['aw_xmc_videoid'] &&
                  listItemRef?.current &&
                  (
                    listItemRef?.current?.querySelector('.videoItemWrapper') as HTMLDivElement
                  )?.click();
              }}
            >
              {result?.raw['aw_xmc_videoid'] ? (
                <RichText field={{ value: (renderingFields.headline as string) ?? '' }} tag="" />
              ) : (
                <ResultLink result={result}>
                  <RichText field={{ value: (renderingFields.headline as string) ?? '' }} tag="" />
                </ResultLink>
              )}
            </h2>
          )}
          {renderingFields.description && (
            <RichTextWrapper
              classes={classNames(
                'line-clamp-2 md:line-clamp-3',
                templateClasses?.resultDescription
              )}
              field={{ value: renderingFields.description as string }}
            />
          )}
        </div>
        {!result?.raw['aw_xmc_videoid'] &&
          ((renderingFields.image && renderingFields.image !== 'null') || renderingFields.icon) && (
            <div
              className={twMerge(
                'relative cursor-pointer',
                renderingFields.image
                  ? 'h-[96px] w-[96px] md:h-[140px] md:w-[140px]'
                  : 'h-[50px] w-[50px]'
              )}
            >
              <Image
                src={`${renderingFields.image ?? renderingFields.icon}`}
                fill
                style={{ objectFit: 'cover' }}
                alt={`${renderingFields.headline}`}
                className="result-image"
                unoptimized={isSvgUrl(
                  (renderingFields.image as string | undefined) ??
                    (renderingFields.icon as string | undefined)
                )}
              />
            </div>
          )}
      </article>
    </li>
  );
};
