import { LinkField } from '@sitecore-content-sdk/nextjs';
import { cta1ToButtonProps, cta2ToButtonProps, cta3ToButtonProps } from 'helpers/Button/Utils';
import ButtonGroup from 'helpers/ButtonGroup/ButtonGroup';
import Headline from 'helpers/Headline/Headline';
import LinkWrapper from 'helpers/LinkWrapper/LinkWrapper';
import MediaPrimary from 'helpers/Media/MediaPrimary/MediaPrimary';
import MediaSecondary from 'helpers/Media/MediaSecondary';
import RichTextWrapper from 'helpers/RichTextWrapper/RichTextWrapper';
import { useTheme } from 'lib/context/ThemeContext';
import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import useExperienceEditor from 'lib/utils/use-experience-editor';
import { JSX } from 'react';

import { ContentBlockWithMediaTheme } from './ContentBlockWithMedia.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export type ContentBlockWithMediaProps =
  Sitecore.Components.General.ContentBlockWithMedia.ContentBlockWithMedia;

type ExtendedFields = ContentBlockWithMediaProps['fields'] & {
  useYouTubeShortsRatio?: { value?: boolean };
};

type CTALinkWrapperProps = {
  children: React.ReactNode;
  link?: LinkField;
};

const CTALinkWrapper = ({ children, link }: CTALinkWrapperProps): JSX.Element =>
  link?.value?.href ? (
    <LinkWrapper
      field={link.value}
      ariaLabel={{ value: link?.value?.text ?? 'CTA Link' }}
      suppressLinkText
    >
      {children}
    </LinkWrapper>
  ) : (
    <>{children}</>
  );

export function ContentBlockWithMediaAW(props: ContentBlockWithMediaProps): JSX.Element {
  const isEE = useExperienceEditor();
  const { themeData } = useTheme(ContentBlockWithMediaTheme(props, props.fields));
  const { currentScreenWidth } = useCurrentScreenType();
  const fields: ExtendedFields = props.fields;

  if (!props) {
    return <></>;
  }

  const imageLayoutType =
    fields?.primaryImage?.value?.src &&
    !fields?.secondaryImage?.value?.src &&
    currentScreenWidth >= getBreakpoint('md')
      ? 'intrinsic'
      : 'responsive';

  const imageContainerWidth =
    imageLayoutType === 'intrinsic' ? { maxWidth: `${fields?.primaryImage?.value?.width}px` } : {};

  const focusArea = 'top center';

  const hasPrimaryVideo = fields?.primaryVideo;
  const hasSecondaryVideo = fields?.secondaryVideo;

  const hasPrimaryMedia = !!(fields?.primaryImage?.value?.src ?? hasPrimaryVideo);
  const hasSecondaryMedia = !!(fields?.secondaryImage?.value?.src ?? hasSecondaryVideo);

  const showPrimaryCaption = hasPrimaryVideo && !!fields?.primaryImageCaption?.value;
  const showSecondaryCaption = hasSecondaryVideo && !!fields?.secondaryImageCaption?.value;

  const twoImageOneCaptionMode =
    hasPrimaryMedia &&
    !!fields?.primaryImageCaption?.value &&
    hasSecondaryMedia &&
    !fields?.secondaryImageCaption?.value;

  return (
    <div className="col-span-12 grid grid-cols-12 md:gap-x-s">
      <div className={themeData.classes.headingContainer}>
        <Headline useTag="h2" classes={themeData.classes.headlineContainer} {...props} />

        <RichTextWrapper field={fields?.topCopy} className={themeData.classes.topCopyContainer} />
      </div>

      <div className={themeData.classes.bodyContainer}>
        <div className={themeData.classes.imageContainer}>
          <CTALinkWrapper link={fields?.primaryImageLink}>
            {(hasPrimaryMedia || isEE) && (
              <div
                className={
                  hasPrimaryVideo
                    ? themeData.classes.videoOuterContainer
                    : themeData.classes.imageOuterContainer
                }
                style={imageContainerWidth}
              >
                <MediaPrimary
                  {...props}
                  imageLayout={imageLayoutType}
                  focusArea={focusArea}
                  shortsRatio={fields?.useYouTubeShortsRatio?.value}
                  staticProps={props.mediaPrimary}
                  hideCaption={twoImageOneCaptionMode}
                />

                {showPrimaryCaption && !twoImageOneCaptionMode && (
                  <RichTextWrapper
                    classes={`${themeData.classes.captionContainer} ${
                      fields?.useYouTubeShortsRatio?.value ? 'text-center' : ''
                    }`}
                    field={fields?.primaryImageCaption}
                  />
                )}
              </div>
            )}
          </CTALinkWrapper>

          <CTALinkWrapper link={fields?.secondaryImageLink}>
            {(hasSecondaryMedia || isEE) && (
              <div
                className={
                  hasSecondaryVideo
                    ? themeData.classes.videoOuterContainer
                    : themeData.classes.imageOuterContainer
                }
                style={imageContainerWidth}
              >
                <MediaSecondary
                  {...props}
                  imageLayout={imageLayoutType}
                  focusArea={focusArea}
                  staticProps={props.mediaSecondary}
                  shortsRatio={fields?.useYouTubeShortsRatio?.value}
                />

                {showSecondaryCaption && (
                  <RichTextWrapper
                    classes={themeData.classes.captionContainer}
                    field={fields?.secondaryImageCaption}
                  />
                )}
              </div>
            )}
          </CTALinkWrapper>
        </div>

        {twoImageOneCaptionMode && (
          <RichTextWrapper
            classes={`${themeData.classes.captionContainer} ${
              fields?.useYouTubeShortsRatio?.value ? 'text-center' : ''
            }`}
            field={fields?.primaryImageCaption}
          />
        )}

        <RichTextWrapper classes={themeData.classes.bodyContainer} field={fields?.bottomCopy} />
      </div>

      <div className={themeData.classes.contentWrapper}>
        <ButtonGroup
          cta1={cta1ToButtonProps(props, themeData.classes.buttonGroupClass.cta1Classes)}
          cta2={cta2ToButtonProps(props, themeData.classes.buttonGroupClass.cta2Classes)}
          cta3={cta3ToButtonProps(
            props as unknown as Sitecore.FieldSets.Cta3,
            themeData.classes.buttonGroupClass.cta3Classes
          )}
          wrapperClasses={themeData.classes.buttonGroupClass.wrapper}
          ctaAlignment={fields?.ctaAlignment}
        />
      </div>
    </div>
  );
}
