import { ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import LinkWrapper from 'helpers/LinkWrapper/LinkWrapper';
import ImagePrimary from 'helpers/Media/ImagePrimary';
import { useTheme } from 'lib/context/ThemeContext';
import { JSX } from 'react';

import { Eyebrow } from '../Eyebrow';
import Headline from '../Headline/Headline';
import { RichTextWrapper } from '../RichTextWrapper';
import SingleButton from '../SingleButton/SingleButton';
import { MashupTheme } from './Mashup.theme';
import { ItemData, MashupStyle, ResultItem } from './Mashup.Types';
import { getItemData } from './Mashup.Utils';

const CTALinkWrapper: React.FC<{ link?: LinkField; children: React.ReactNode }> = ({
  children,
  link,
}): JSX.Element =>
  link?.value?.href ? (
    <LinkWrapper
      field={link?.value}
      ariaLabel={{ value: link?.value?.text ?? 'CTA Link' }}
      suppressLinkText
    >
      {children}
    </LinkWrapper>
  ) : (
    <>{children}</>
  );

export const FeaturedCard = ({
  resultItem,
  mashupStyle,
  placeholderImage,
  displayEyebrow,
}: {
  resultItem: ResultItem | ItemData;
  mashupStyle: MashupStyle;
  placeholderImage?: ImageField;
  displayEyebrow?: boolean;
}) => {
  const { themeData } = useTheme(MashupTheme);

  // 'fields' in resultItem means its layout item otherwise its coveo item
  const featuredItemData =
    resultItem && 'fields' in resultItem ? getItemData(resultItem, mashupStyle, true) : resultItem;

  if (
    featuredItemData?.image.fields &&
    !featuredItemData?.image.fields.primaryImage?.value?.hasOwnProperty('src')
  ) {
    featuredItemData.image.fields.primaryImage = featuredItemData.image.fields.primaryImageMobile =
      placeholderImage as ImageField;
  }

  switch (mashupStyle) {
    case 'images-for-all':
      return (
        <div className="col-span-12 grid grid-cols-12 gap-s md:gap-s">
          <div className={themeData.classes.featuredCard.wrapper.imagesForAll}>
            <div>
              {(!(resultItem && 'fields' in resultItem) || displayEyebrow) && (
                <Eyebrow
                  useTag="span"
                  fields={{
                    eyebrowText: { value: featuredItemData?.eyebrow },
                  }}
                  classes={themeData.classes.featuredCard.eyebrow.imagesForAll}
                />
              )}
              <Headline
                classes={themeData.classes.featuredCard.headline.imagesForAll}
                useTag="h3"
                fields={{
                  headlineText: {
                    value: featuredItemData?.headline,
                  },
                }}
              />
              <RichTextWrapper
                classes={themeData.classes.featuredCard.body.imagesForAll}
                field={{
                  value: featuredItemData?.description,
                }}
              />

              <SingleButton
                classes={themeData.classes.featuredCard.singleButton}
                {...featuredItemData?.cta}
              />
            </div>
          </div>
          <div className="col-span-full md:col-span-8">
            <CTALinkWrapper link={featuredItemData.cta.fields?.cta1Link}>
              <ImagePrimary
                imageLayout="responsive"
                {...(featuredItemData?.image ?? placeholderImage)}
              />
            </CTALinkWrapper>
          </div>
        </div>
      );
    case 'feature-image-only':
    case 'no-images':
      return (
        <div
          className={classNames(
            mashupStyle != 'feature-image-only'
              ? themeData.classes.featuredCard.wrapper.noImages
              : themeData.classes.featuredCard.wrapper.featuredImage
          )}
        >
          {mashupStyle === 'feature-image-only' && (
            <CTALinkWrapper link={featuredItemData.cta.fields?.cta1Link}>
              <ImagePrimary
                imageLayout="responsive"
                additionalDesktopClasses="mb-s"
                additionalMobileClasses="mb-s"
                {...(featuredItemData.image ?? placeholderImage)}
              />
            </CTALinkWrapper>
          )}
          {displayEyebrow && (
            <Eyebrow
              useTag="span"
              fields={{
                eyebrowText: {
                  value: featuredItemData.eyebrow,
                },
              }}
              classes={classNames(
                mashupStyle === 'feature-image-only'
                  ? themeData.classes.featuredCard.eyebrow.featuredImage
                  : themeData.classes.featuredCard.eyebrow.noImages,
                'mt-s'
              )}
            />
          )}
          <Headline
            classes={classNames(
              mashupStyle === 'feature-image-only'
                ? themeData.classes.featuredCard.headline.featuredImage
                : themeData.classes.featuredCard.headline.noImages
            )}
            useTag="h3"
            fields={{
              headlineText: { value: featuredItemData.headline },
            }}
          />

          <RichTextWrapper
            classes={themeData.classes.featuredCard.body.featuredImage}
            field={{
              value: featuredItemData.description,
            }}
          />

          <SingleButton
            classes={{ wrapper: 'mb-0 md:mb-s', cta1Classes: 'font-bold' }}
            {...featuredItemData.cta}
          />
        </div>
      );
  }
};
