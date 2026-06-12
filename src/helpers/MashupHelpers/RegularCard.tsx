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
export const RegularCard = ({
  resultItem,
  mashupStyle,
  itemIndex,
  placeholderImage,
  displayEyebrow,
}: {
  resultItem: ResultItem | ItemData;
  mashupStyle: MashupStyle;
  itemIndex: number;
  placeholderImage?: ImageField;
  displayEyebrow?: boolean;
}) => {
  const { themeData } = useTheme(MashupTheme);

  // 'fields' in resultItem means its layout item otherwise its coveo item
  const itemData = 'fields' in resultItem ? getItemData(resultItem, mashupStyle) : resultItem;

  if (itemData.image.fields && !itemData.image.fields.primaryImage?.value?.src) {
    itemData.image.fields.primaryImage = itemData.image.fields.primaryImageMobile =
      placeholderImage as ImageField;
  }

  switch (mashupStyle) {
    case 'images-for-all':
      return (
        <div
          key={itemIndex}
          className="relative col-span-12 flex gap-s border-b border-gray pt-xxs last:border-0 md:col-span-4 md:grid-cols-1 md:flex-col md:last:border-b"
        >
          <CTALinkWrapper link={itemData.cta.fields?.cta1Link}>
            <ImagePrimary
              additionalMobileClasses="w-[155px] h-[155px] min-w-[155px] min-h-[155px] mb-xs"
              additionalDesktopClasses="mb-xs"
              imageLayout="intrinsic"
              {...itemData.image}
            />
          </CTALinkWrapper>

          <div className="flex-1 flex-col justify-between md:flex">
            <div className="md:mb-s">
              {(!('fields' in resultItem) || displayEyebrow) && itemData.eyebrow && (
                <Eyebrow
                  useTag="span"
                  fields={{
                    eyebrowText: {
                      value: itemData.eyebrow,
                    },
                  }}
                  classes={themeData.classes.generalCard.eyebrow}
                />
              )}
              {itemData.headline && (
                <Headline
                  classes={classNames(themeData.classes.generalCard.headline)}
                  useTag="h3"
                  fields={{
                    headlineText: {
                      value: itemData.headline,
                    },
                  }}
                />
              )}
              {itemData.description && (
                <RichTextWrapper
                  classes={themeData.classes.generalCard.body}
                  field={{
                    value: itemData.description,
                  }}
                />
              )}
            </div>
            <SingleButton
              classes={{
                wrapper: themeData.classes.generalCard.singleButton.wrapper,
                cta1Classes: themeData.classes.generalCard.singleButton.cta1Classes,
              }}
              {...itemData.cta}
            />
          </div>
        </div>
      );
    case 'feature-image-only':
    case 'no-images':
      return (
        <div key={itemIndex} className="col-span-12 border-b border-gray">
          {(!('fields' in resultItem) || displayEyebrow) && (
            <Eyebrow
              useTag="span"
              fields={{
                eyebrowText: {
                  value: itemData.eyebrow,
                },
              }}
              classes={themeData.classes.generalCard.eyebrow}
            />
          )}
          <Headline
            classes={themeData.classes.generalCard.headline}
            useTag="h3"
            fields={{
              headlineText: {
                value: itemData.headline,
              },
            }}
          />
          <RichTextWrapper
            classes={themeData.classes.generalCard.body}
            field={{
              value: itemData.description,
            }}
          />
          <SingleButton classes={themeData.classes.generalCard.singleButton} {...itemData.cta} />
        </div>
      );
  }
};
