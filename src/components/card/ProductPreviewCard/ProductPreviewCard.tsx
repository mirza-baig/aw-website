'use client';

import { Text } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import Button from 'helpers/Button/Button';
import Eyebrow from 'helpers/Eyebrow/Eyebrow';
import Headline from 'helpers/Headline/Headline';
import Image from 'helpers/Media/Image';
import ImagePrimary from 'helpers/Media/ImagePrimary';
import PriceLevel from 'helpers/PriceLevel/PriceLevel';
import RichTextWrapper from 'helpers/RichTextWrapper/RichTextWrapper';
import SingleButton from 'helpers/SingleButton/SingleButton';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { ComponentProps } from 'lib/component-props';
import { ThemeName, useTheme } from 'lib/context/ThemeContext';
import { EnumField } from 'lib/utils/get-enum';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { useBVScript } from 'lib/utils/use-bv-script';
import { useFavoriteProducts } from 'lib/website/favorite-products/use-favorite-products';
import Link from 'next/link';
import { JSX, useState } from 'react';
import { environment } from 'startup/environment';

import { ProductPreviewCardTheme } from './helpers/ProductPreviewCard.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type priceLevel = 1 | 2 | 3 | 4 | 5;

type ProductItem = Sitecore.Data.Products.EnterpriseProduct & {
  fields?: {
    standardExteriorColors?: Sitecore.Elements.Swatches.SwatchCollection & {
      fields?: {
        swatches: Sitecore.Elements.Swatches.Swatch[];
      };
    };
    priceLevel: EnumField<priceLevel>;
    featuredExteriorColors: Sitecore.Elements.Swatches.Swatch[];
  };
};

type ProductPreviewCardProps = ComponentProps &
  Sitecore.Cards.ProductPreviewCard.ProductPreviewCard & {
    fields?: {
      productItem: ProductItem;
    };
  };

type ColorAndActionsProps = {
  fields: ProductPreviewCardProps['fields'];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  themeData: any;
  featuredExteriorColors: Sitecore.Elements.Swatches.Swatch[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pairedClickables: any[];
  colorSwatchesCount: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedSwatchImage: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSelectedSwatchImage: React.Dispatch<React.SetStateAction<any>>;
};

const ColorAndActions = ({
  fields,
  themeData,
  featuredExteriorColors,
  pairedClickables,
  colorSwatchesCount,
  selectedSwatchImage,
  setSelectedSwatchImage,
}: ColorAndActionsProps): JSX.Element => {
  return (
    <>
      {featuredExteriorColors?.length > 0 && (
        <div className={themeData.classes.colorSwatchesWrapper}>
          <Text
            tag={'h4'}
            field={{ value: fields?.interiorColorLabel?.value }}
            className={themeData.classes.colorLabel}
          />
          <Link
            href={
              fields.cta1Link.value.href ??
              fields.productItem?.fields?.productDetailPageLink?.value?.href ??
              ''
            }
            {...(pairedClickables.length > 0 && {
              onClick: (e) => {
                e.preventDefault();
              },
            })}
          >
            {pairedClickables.length > 0 ? (
              <div className={themeData.classes.swatches}>
                {pairedClickables?.map(
                  (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    color: any,
                    index: number
                  ) => {
                    const swatchImage = color?.clickable.fields?.swatchImage?.value;
                    const clickableSwatch = color?.rendered?.value;
                    const isSelected = clickableSwatch === selectedSwatchImage;
                    const hasValidImage = swatchImage && Object.keys(swatchImage).length > 0;
                    return hasValidImage ? (
                      <div
                        key={index}
                        className={classNames(
                          themeData.classes.colorSwatches,
                          isSelected
                            ? 'rounded-full p-[2px] ring-2 ring-black'
                            : 'opacity-80 hover:opacity-100'
                        )}
                        onClick={() => setSelectedSwatchImage(clickableSwatch)}
                      >
                        <Image image={color?.clickable.fields?.swatchImage} />
                      </div>
                    ) : null;
                  }
                )}
                {colorSwatchesCount > 0 && <div>+{colorSwatchesCount}</div>}
              </div>
            ) : (
              <div className={themeData.classes.swatches}>
                {featuredExteriorColors?.map(
                  (color: Sitecore.Elements.Swatches.Swatch, index: number) => {
                    return (
                      <div key={index} className={themeData.classes.colorSwatches}>
                        <Image image={color.fields?.swatchImage} />
                      </div>
                    );
                  }
                )}
                {colorSwatchesCount > 0 && <div>+{colorSwatchesCount}</div>}
              </div>
            )}
          </Link>
        </div>
      )}
      <div className={themeData.classes.actions}>
        {fields.cta1Link?.value?.href && fields.cta1Link?.value?.text ? (
          <div className={themeData.classes.buttonWrapper}>
            <Button
              field={fields?.cta1Link}
              variant={fields?.cta1Style}
              icon={fields?.cta1Icon}
              modalId={
                (
                  fields?.cta1Modal as unknown as Sitecore.Components.Modal.GenericModal.GenericModal
                )?.fields?.modalId?.value
              }
              modalLinkText={fields?.cta1ModalLinkText}
              ctaPersonalizeEventName={fields?.cta1PersonalizeEventName}
              classes={classNames(
                fields?.cta1Style,
                themeData.classes.buttonGroupClass.cta1Classes
              )}
            ></Button>
            <Button
              field={fields?.cta2Link}
              variant={fields?.cta2Style}
              icon={fields?.cta2Icon}
              modalId={
                (
                  fields?.cta2Modal as unknown as Sitecore.Components.Modal.GenericModal.GenericModal
                )?.fields?.modalId?.value
              }
              modalLinkText={fields?.ctaModal2LinkText}
              ctaPersonalizeEventName={fields?.cta2PersonalizeEventName}
              classes={classNames(
                fields?.cta2Style,
                themeData.classes.buttonGroupClass.cta2Classes
              )}
            ></Button>
          </div>
        ) : (
          fields.productItem?.fields.productDetailPageLink?.value?.text && (
            <SingleButton
              classes={
                (themeData.classes.buttonGroupClass,
                { wrapper: 'mb-0 md:mb-s cursor-pointer', cta1Classes: 'font-bold' })
              }
              fields={{
                cta1Link: {
                  value: {
                    href: fields.productItem.fields.productDetailPageLink.value.href,
                    text: fields.productItem.fields.productDetailPageLink.value.text,
                    anchor: fields.productItem.fields.productDetailPageLink.value.anchor,
                    target: fields.productItem.fields.productDetailPageLink.value.target,
                  },
                },
                cta1AriaLabel: {
                  value: '',
                },
                cta1ModalLinkText: {
                  value: '',
                },
                cta1PersonalizeEventName: {
                  value: '',
                },
                cta1Style: {
                  id: '',
                  url: '',
                  name: 'Primary',
                  displayName: 'Primary',
                  fields: {
                    Value: {
                      value: fields.cta1Style?.fields?.Value?.value ?? 'primary',
                    },
                  },
                },
                cta1Icon: {
                  id: '',
                  url: '',
                  name: 'Arrow',
                  displayName: 'Arrow',
                  fields: {
                    Value: {
                      value: 'arrow',
                    },
                  },
                },
              }}
            />
          )
        )}
      </div>
    </>
  );
};

type RenderLinkImagesProps = Readonly<{
  props: ProductPreviewCardProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedSwatchImage: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  primaryImageVal: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  primaryImageMobileVal: any;
}>;

function RenderLinkImages({
  props,
  selectedSwatchImage,
  primaryImageVal,
  primaryImageMobileVal,
}: RenderLinkImagesProps): JSX.Element {
  const fields = props.fields;

  if (
    fields.primaryImage?.value?.src &&
    fields.primaryImageMobile?.value?.src &&
    Object.keys(selectedSwatchImage ?? {}).length > 0
  ) {
    return (
      <ImagePrimary
        {...{
          ...props,
          ...(Object.keys(selectedSwatchImage ?? {}).length > 0 && {
            fields: {
              ...props.fields,
              primaryImage: { value: selectedSwatchImage },
              primaryImageMobile: { value: selectedSwatchImage },
            },
          }),
        }}
      />
    );
  }

  if (fields.primaryImage?.value?.src && fields.primaryImageMobile?.value?.src) {
    return <ImagePrimary {...props} />;
  }

  if (primaryImageVal || primaryImageMobileVal) {
    return (
      <ImagePrimary
        imageLayout={'intrinsic'}
        fields={{
          primaryImageCaption: {
            value: '',
          },
          primaryImage: { value: primaryImageVal },
          primaryImageMobile: { value: primaryImageMobileVal },
          primaryImageMobileFocusArea: fields.productItem?.fields?.primaryImageMobileFocusArea
            ?.targetItem?.value?.value
            ? {
                id: '',
                url: '',
                name: fields.productItem.fields.primaryImageMobileFocusArea.targetItem.value.value,
                displayName:
                  fields.productItem.fields.primaryImageMobileFocusArea.targetItem.value.value,
                fields: {
                  Value: {
                    value:
                      fields.productItem.fields.primaryImageMobileFocusArea.targetItem.value.value,
                  },
                },
              }
            : {
                id: '',
                url: '',
                name: 'Center',
                displayName: 'Center',
                fields: {
                  Value: {
                    value: 'center',
                  },
                },
              },
        }}
      />
    );
  }

  return <></>;
}

function PairClickablesWithRenderedImages(props: ProductPreviewCardProps) {
  const productFields = props?.fields?.productItem?.fields;

  if (!productFields) {
    return [];
  }

  const {
    clickableSwatch1,
    clickableSwatch2,
    clickableSwatch3,
    renderedImage1,
    renderedImage2,
    renderedImage3,
  } = productFields;

  const clickables = [clickableSwatch1, clickableSwatch2, clickableSwatch3];
  const rendereds = [renderedImage1, renderedImage2, renderedImage3];

  const result = clickables
    .map((clickable, index) => {
      const rendered = rendereds[index];
      if (clickable && rendered) {
        return { clickable, rendered };
      }
      return null;
    })
    .filter(Boolean);

  return result;
}

function ProductPreviewCard_Default(props: ProductPreviewCardProps) {
  const { fields } = props;
  const { themeName, themeData } = useTheme(ProductPreviewCardTheme);
  const { favoriteProducts } = useFavoriteProducts();
  const [selectedSwatchImage, setSelectedSwatchImage] = useState<null | {
    src: string;
    alt?: string;
    width?: string;
    height?: string;
  }>(null);

  // Add the bazaarvoice script
  useBVScript({ environment, theme: themeName });

  if (!fields) {
    return null;
  }

  const bazaarvoiceProductId = fields?.productItem?.fields?.bazaarvoiceProductId?.value;

  const showFavorite = fields?.favorite?.value;
  const productID = fields.productItem?.fields?.productId?.value;
  const isFavorited = favoriteProducts.includes(productID);

  const colorSwatchesAll = fields.productItem?.fields?.standardExteriorColors?.fields?.swatches;
  const colorSwatchesTotal = colorSwatchesAll?.length;

  let featuredExteriorColors = fields?.productItem?.fields?.featuredExteriorColors ?? [];

  let colorSwatchesCount = 0;

  const pairedClickables = PairClickablesWithRenderedImages(props);

  const MAX_FEATURE_EXTERIOR_COLORS: Record<ThemeName, number> = {
    aw: 3,
    rba: 5,
  };

  if (colorSwatchesTotal && featuredExteriorColors?.length > 0) {
    const maxColors = MAX_FEATURE_EXTERIOR_COLORS[themeName];
    featuredExteriorColors = featuredExteriorColors.slice(0, maxColors);
    colorSwatchesCount = colorSwatchesTotal - featuredExteriorColors.length;
  }

  const priceLevel =
    fields?.productItem?.fields?.priceLevel?.fields?.priceLevelText?.value &&
    (+fields?.productItem?.fields?.priceLevel?.fields?.priceLevelText?.value as priceLevel | null);

  let primaryImageVal = {};
  let primaryImageMobileVal = {};

  const primaryImage = fields.primaryImage?.value?.src && fields.primaryImage.value;
  const primaryImageMobile =
    fields.primaryImageMobile?.value?.src && fields.primaryImageMobile?.value;
  const productImage = fields.productItem?.fields?.productImage?.value;
  const productImageMobile = fields.productItem?.fields?.productImageMobile?.value;

  primaryImageVal = primaryImage ?? productImage ?? {};
  primaryImageMobileVal = primaryImageMobile ?? productImageMobile ?? primaryImageVal;
  const cta1Href = fields.cta1Link?.value?.href;
  const productDetailHref = fields.productItem?.fields?.productDetailPageLink?.value?.href;
  // prefer cta1, fall back to productDetail
  const cardLinkHref = cta1Href || productDetailHref; // NOSONAR - need to consider falsy values such as empty string

  return (
    <div
      className={themeData.classes.productPreviewCradWrapper}
      data-component="card/productpreview"
    >
      {/* Favourite */}
      {showFavorite && productID && (
        <div className="absolute top-0 right-0">
          <div
            className={classNames(
              themeData.classes.favoriteProduct,
              isFavorited ? 'favorited border-[transparent_#f26924_transparent_transparent]' : ''
            )}
            data-product-id={productID}
          >
            <SvgIcon
              icon="favorite"
              fillId="white"
              size="xl"
              className={themeData.classes.favoriteIcon}
            />
          </div>
        </div>
      )}

      <div className={themeData.classes.headerWrapper}>
        {fields.eyebrowText?.value ? (
          <Eyebrow classes={themeData.classes.eyebrow} {...props} />
        ) : (
          fields.productItem?.fields?.productSeries?.fields?.productTypeName?.value && (
            <Text
              tag="h4"
              className={themeData.classes.eyebrow}
              field={{
                value: fields.productItem.fields.productSeries.fields.productTypeName.value,
              }}
            />
          )
        )}

        <Link
          href={
            fields.cta1Link.value.href ??
            fields.productItem?.fields?.productDetailPageLink?.value?.href ??
            ''
          }
          className={themeData.classes.headlineWrapper}
        >
          {fields.headlineText?.value ? (
            <Headline useTag="h4" classes={themeData.classes.headline} {...props} />
          ) : (
            fields.productItem?.fields.productName && (
              <Text
                useTag="h4"
                className={themeData.classes.headline}
                field={{ value: fields.productItem.fields.productName.value }}
              />
            )
          )}
        </Link>

        {/* ratings */}
        <div className={themeData.classes.ratingsAndPriceWrapper}>
          {bazaarvoiceProductId && themeName === 'aw' && (
            <div
              className="review flex-[0_0_auto]"
              data-bv-show="inline_rating"
              data-bv-product-id={bazaarvoiceProductId}
              data-bv-seo="false"
            ></div>
          )}
          {priceLevel && priceLevel > 0 && (
            <>
              {/* Price Level AW*/}
              <div className={bazaarvoiceProductId ? themeData.classes.priceLevelWrapper : ''}>
                <PriceLevel
                  priceLevel={priceLevel}
                  priceClasses={themeData.classes.priceTextClasses}
                  priceLevelClasses={themeData.classes.priceLevelClasses}
                />
              </div>
            </>
          )}
        </div>
      </div>
      <div className="order-2 my-xxs self-stretch">
        {cardLinkHref ? (
          <Link href={cardLinkHref}>
            <RenderLinkImages
              props={props}
              selectedSwatchImage={selectedSwatchImage}
              primaryImageVal={primaryImageVal}
              primaryImageMobileVal={primaryImageMobileVal}
            />
          </Link>
        ) : (
          <RenderLinkImages
            props={props}
            selectedSwatchImage={selectedSwatchImage}
            primaryImageVal={primaryImageVal}
            primaryImageMobileVal={primaryImageMobileVal}
          />
        )}
      </div>
      {fields.body?.value ? (
        <BodyCopy classes={themeData.classes.body} {...props} />
      ) : (
        fields.productItem?.fields.productDescription && (
          <RichTextWrapper
            field={{ value: fields.productItem.fields.productDescription.value }}
            classes={themeData.classes.body}
          />
        )
      )}
      <ColorAndActions
        fields={props.fields}
        themeData={themeData}
        featuredExteriorColors={featuredExteriorColors}
        pairedClickables={pairedClickables}
        colorSwatchesCount={colorSwatchesCount}
        selectedSwatchImage={selectedSwatchImage}
        setSelectedSwatchImage={setSelectedSwatchImage}
      />
    </div>
  );
}

export const Default = withDatasourceCheck(ProductPreviewCard_Default);
