'use client';

import { Text } from '@sitecore-content-sdk/nextjs';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import { cta1ToButtonProps, cta2ToButtonProps } from 'helpers/Button/Utils';
import ButtonGroup from 'helpers/ButtonGroup/ButtonGroup';
import Component, { ComponentBackgroundVariants } from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import MediaPrimary from 'helpers/Media/MediaPrimary/MediaPrimary';
import { MediaPrimaryStaticProps } from 'helpers/Media/types';
import { RichTextWrapper } from 'helpers/RichTextWrapper';
import { Subheadline } from 'helpers/Subheadline';
import { useTheme } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';
import useExperienceEditor from 'lib/utils/use-experience-editor';
import { JSX } from 'react';

import { PromoFeaturedMediaTheme } from './PromoFeaturedMedia.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export type PromoFeaturedMediaProps =
  Sitecore.Components.Promo.PromoFeaturedMedia.PromoFeaturedMedia & MediaPrimaryStaticProps;

export const PromoFeaturedMediaClient = (props: PromoFeaturedMediaProps): JSX.Element => {
  const { themeData } = useTheme(PromoFeaturedMediaTheme);
  const style = getEnum<ComponentBackgroundVariants>(props.fields?.backgroundColor) ?? 'white';
  const isEE = useExperienceEditor();

  const hasValue =
    props.fields?.headlineText?.value ??
    props.fields?.subheadlineText?.value ??
    props.fields?.body?.value ??
    props.fields?.cta1Link?.value?.href ??
    props.fields?.highlightTitle1?.value ??
    props.fields?.highlightDescription1?.value ??
    props.fields?.highlightTitle2?.value ??
    props.fields?.highlightDescription2?.value ??
    props.fields?.highlightTitle3?.value ??
    props.fields?.highlightDescription3?.value ??
    props.fields?.primaryImageCaption?.value;

  const hasHighlights =
    props.fields?.highlightTitle1?.value ??
    props.fields?.highlightDescription1?.value ??
    props.fields?.highlightTitle2?.value ??
    props.fields?.highlightDescription2?.value ??
    props.fields?.highlightTitle3?.value ??
    props.fields?.highlightDescription3?.value;

  return (
    <Component
      variant={props.fields?.primaryVideo ? 'lg' : 'full'}
      gap="gap-x-0"
      padding={'px-0'}
      backgroundVariant={style}
      dataComponent="promo/promofeaturedmedia"
      {...props}
    >
      <div className={themeData.classes.imageDivClass}>
        <MediaPrimary
          imageLayout="responsive"
          ratio="hero"
          hideCaption={true}
          {...props}
          staticProps={props?.mediaPrimary}
        />
      </div>
      {hasValue && (
        <div className={themeData.classes.containerClass}>
          <div
            className={
              hasHighlights
                ? themeData.classes.leftContainerClass
                : themeData.classes.leftContainerClassNoHighlights
            }
          >
            <div className={themeData.classes.subheadlineContainerClass}>
              <Subheadline classes={themeData.classes.subheadlineClass} {...props} />
              <div className={themeData.classes.captionClass}>
                <RichTextWrapper field={props.fields?.primaryImageCaption} />
              </div>
            </div>
            {(isEE || props.fields?.headlineText?.value) && (
              <Headline classes={themeData.classes.headlineClass} {...props} />
            )}
            {(isEE || props.fields?.body?.value) && (
              <BodyCopy classes={themeData.classes.bodyClass} {...props} />
            )}
            {(isEE || props.fields?.cta1Link?.value?.text) && (
              <ButtonGroup
                cta1={cta1ToButtonProps(props, themeData.classes.buttonGroupClass.cta1Classes)}
                cta2={cta2ToButtonProps(props, themeData.classes.buttonGroupClass.cta2Classes)}
                wrapperClasses={themeData.classes.buttonGroupClass.wrapper}
              />
            )}
          </div>
          {hasHighlights && (
            <div className={themeData.classes.rightContainerClass}>
              {(isEE ||
                (props.fields?.headlineText?.value &&
                  props.fields?.body?.value &&
                  props.fields?.cta1Link?.value?.text)) && (
                <div className={themeData.classes.rightPaddingClass} />
              )}
              <div className={themeData.classes.highlightGroupClass}>
                {(isEE ||
                  (props.fields?.highlightTitle1?.value &&
                    props.fields?.highlightDescription1?.value)) && (
                  <div className={themeData.classes.highlightContainerClass}>
                    <div className={themeData.classes.highlightTitleClass}>
                      <Text tag={'h3'} field={props.fields?.highlightTitle1} />
                    </div>
                    <RichTextWrapper
                      field={props.fields?.highlightDescription1}
                      className={themeData.classes.highlightDescriptionClass}
                    />
                  </div>
                )}
                {(isEE ||
                  (props.fields?.highlightTitle2?.value &&
                    props.fields?.highlightDescription2?.value)) && (
                  <div className={themeData.classes.highlightContainerClass}>
                    <div className={themeData.classes.highlightTitleClass}>
                      <Text tag={'h3'} field={props.fields?.highlightTitle2} />
                    </div>
                    <RichTextWrapper
                      field={props.fields?.highlightDescription2}
                      className={themeData.classes.highlightDescriptionClass}
                    />
                  </div>
                )}
                {(isEE ||
                  (props.fields?.highlightTitle3?.value &&
                    props.fields?.highlightDescription3?.value)) && (
                  <div className={themeData.classes.highlightContainerClass}>
                    <div className={themeData.classes.highlightTitleClass}>
                      <Text tag={'h3'} field={props.fields?.highlightTitle3} />
                    </div>
                    <RichTextWrapper
                      field={props.fields?.highlightDescription3}
                      className={themeData.classes.highlightDescriptionClass}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Component>
  );
};
