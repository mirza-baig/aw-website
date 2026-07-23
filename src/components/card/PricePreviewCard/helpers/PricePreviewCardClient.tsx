'use client';

import { Text } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import Button from 'helpers/Button/Button';
import LinkWrapper from 'helpers/LinkWrapper/LinkWrapper';
import Image from 'helpers/Media/Image';
import { useTheme } from 'lib/context/ThemeContext';
import useExperienceEditor from 'lib/utils/use-experience-editor';

import { PricePreviewCardTheme } from './PricePreviewCard.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export type PricePreviewCardClientProps = Sitecore.Cards.PricePreviewCard.PricePreviewCard;

export function PricePreviewCardClient(props: PricePreviewCardClientProps) {
  const { fields } = props;
  const { themeData } = useTheme(PricePreviewCardTheme);
  const isEE = useExperienceEditor();

  if (!fields?.productItem && !isEE) {
    return null;
  }

  const productFields = fields.productItem.fields;
  const seriesName = productFields?.productSeries?.fields?.productTypeName?.value;
  const productType = productFields?.productSubtype?.value;
  const productImage = productFields?.productImage?.value;

  return (
    <div
      className={themeData.classes.productPreviewCradWrapper}
      data-component="card/productpreview"
    >
      <div className={themeData.classes.topWrapper}>
        <div className={themeData.classes.imageWrapper}>
          {isEE || !fields?.cta1Link?.value?.href ? (
            <Image layout="intrinsic" image={{ value: productImage }} />
          ) : (
            <LinkWrapper
              field={fields?.cta1Link}
              suppressLinkText
              ariaLabel={{ value: fields?.cta1Link?.value?.text }}
            >
              <Image layout="intrinsic" image={{ value: productImage }} />
            </LinkWrapper>
          )}
        </div>

        <div className={themeData.classes.titleWrapper}>
          <div className={themeData.classes.seriesName}>{seriesName}</div>
          <div className={themeData.classes.productType}>{productType}</div>
        </div>
      </div>

      <div className={themeData.classes.bottomWrapper}>
        <div className={themeData.classes.priceSectionWrapper}>
          {(fields?.priceRangeText?.value || isEE) && (
            <Text field={fields?.priceRangeText} className={themeData.classes.priceLabel} />
          )}
          {(productFields?.priceRange?.value || isEE) && (
            <div className={themeData.classes.priceRange}>{productFields?.priceRange?.value}</div>
          )}
        </div>

        <div className={themeData.classes.buttonWrapper}>
          <Button
            field={fields?.cta1Link}
            variant={fields?.cta1Style}
            icon={fields?.cta1Icon}
            modalId={
              (fields?.cta1Modal as unknown as Sitecore.Components.Modal.GenericModal.GenericModal)
                ?.fields?.modalId?.value
            }
            modalLinkText={fields?.cta1ModalLinkText}
            ctaPersonalizeEventName={fields?.cta1PersonalizeEventName}
            classes={classNames(fields?.cta1Style, themeData.classes.cta1Classes)}
          />
        </div>
      </div>
    </div>
  );
}
