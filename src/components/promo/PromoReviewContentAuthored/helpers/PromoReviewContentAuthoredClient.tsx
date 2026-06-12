'use client';

import Component, { ComponentBackgroundVariants } from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import MediaPrimary from 'helpers/Media/MediaPrimary/MediaPrimary';
import { MediaPrimaryStaticProps } from 'helpers/Media/types';
import { RichTextWrapper } from 'helpers/RichTextWrapper';
import StarRating from 'helpers/StarRating/StarRating';
import { useTheme } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';

import { PromoReviewContentAuthoredTheme } from './PromoReviewContentAuthored.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export type PromoReviewContentAuthoredProps_Default =
  Sitecore.Components.Promo.PromoReviewContentAuthored.PromoReviewContentAuthored &
    MediaPrimaryStaticProps;
const maxStarRating = 5;

export const PromoReviewContentAuthoredClient = (
  props: PromoReviewContentAuthoredProps_Default
) => {
  const hasMedia = !!props.fields?.primaryImage?.value?.src || !!props.fields?.primaryVideo;
  const style = getEnum<ComponentBackgroundVariants>(props.fields?.backgroundColor) ?? 'gray';
  const { themeData } = useTheme(PromoReviewContentAuthoredTheme(hasMedia, style));

  return (
    <Component
      variant="full"
      dataComponent="promo/promoreviewcontentauthored"
      gap="gap-x-0"
      padding={themeData.classes.contentClasses.componentClass}
      backgroundVariant={style}
      {...props}
    >
      <>
        <div className={themeData.classes.contentClasses.copyContainerClass}>
          <Headline classes={themeData.classes.firstHeadline.headlineOutsideContainer} {...props} />
          <StarRating
            reviewStars={props?.fields?.reviewStars?.value}
            maxStars={maxStarRating}
            containerCSSClass={themeData.classes.contentClasses.starContainerClass}
          />
          <RichTextWrapper
            field={props?.fields?.body}
            classes={themeData.classes.contentClasses?.body}
          />
          <div className={themeData.classes.contentClasses.reviewerNameClass}>
            {props?.fields?.reviewerName?.value}
          </div>
          <div className={themeData.classes.contentClasses.additionalInfoClass}>
            {props?.fields?.additionalInfo?.value}
          </div>
        </div>
        {hasMedia && (
          <div className={themeData.classes.contentClasses.imageContainerClass}>
            <MediaPrimary {...props} staticProps={props?.mediaPrimary} />
          </div>
        )}
      </>
    </Component>
  );
};
