'use client';

import { ImageField, Text } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import { cta1ToButtonProps, cta2ToButtonProps } from 'helpers/Button/Utils';
import ButtonGroup from 'helpers/ButtonGroup/ButtonGroup';
import CallToActionAR from 'helpers/CallToActionAR/CallToActionAR';
import Component from 'helpers/Component/Component';
import DisclaimerText from 'helpers/DisclaimerText/DisclaimerText';
import { Eyebrow } from 'helpers/Eyebrow';
import Headline from 'helpers/Headline/Headline';
import { ImageToggleWrapper } from 'helpers/ImageToggleWrapper/ImageToggleWrapper';
import ImagePrimary from 'helpers/Media/ImagePrimary';
import { RichTextWrapper } from 'helpers/RichTextWrapper';
import SingleButton from 'helpers/SingleButton/SingleButton';
import { Subheadline } from 'helpers/Subheadline';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { useTheme } from 'lib/context/ThemeContext';
import { useBVScript } from 'lib/utils/use-bv-script';
import useExperienceEditor from 'lib/utils/use-experience-editor';
import { useWebsiteContext } from 'lib/website/WebsiteContext';
import Script from 'next/script';
import React, { JSX, useEffect, useMemo, useRef, useState } from 'react';
import { environment } from 'startup/environment';

import { ProductSwatch } from './product-swatch';
import { ProductIntroTheme } from './ProductIntro.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type BazaarvoiceReviewData = {
  ReviewStatistics?: {
    TotalReviewCount?: number;
    AverageOverallRating?: number;
    OverallRatingRange?: number;
  };
};

const DEFAULT_PLACEHOLDER_TEXT = '[No text in field]';
const CONTENT_EDITABLE_SELECTOR = '[contenteditable]';
const PLACEHOLDER_ATTRIBUTE_NAME = 'placeholder';

type ProductIntroProps = Sitecore.Components.Product.ProductIntro.ProductIntro & {
  fields?: {
    children?: ProductSwatch[];
    tabLinkToSelect: Sitecore.FieldSets.ContentAnchor;
  };
  awAggregateRating?: BazaarvoiceReviewData;
};

// Render fragment with Experience Editor wrapper to handle conditional rendering of fields that only display the productItem field if no
// product intro field is set.

const RenderFragmentWithEEWrapper = ({
  ProductIntroField,
  ProductItemField,
  productIntroField,
  props,
  isEE,
}: {
  ProductIntroField: JSX.Element;
  ProductItemField: JSX.Element;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  productIntroField: any;
  props: ProductIntroProps;
  isEE: boolean;
}): JSX.Element => {
  const fields = props.fields;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isEE || !wrapperRef.current) {
      return;
    }
    const observer = new MutationObserver(() => {
      const editInput = wrapperRef.current?.querySelector(CONTENT_EDITABLE_SELECTOR);
      if (!editInput || !fallbackRef.current) {
        return;
      }
      const text = editInput.textContent?.trim() ?? '';
      const placeholder =
        editInput.getAttribute(PLACEHOLDER_ATTRIBUTE_NAME)?.trim() ?? DEFAULT_PLACEHOLDER_TEXT;
      fallbackRef.current.style.display = !!text && text !== placeholder ? 'none' : '';
    });
    observer.observe(wrapperRef.current, { subtree: true, childList: true, characterData: true });
    return () => observer.disconnect();
  }, [isEE]);

  if (!isEE) {
    if (productIntroField?.value) {
      return ProductIntroField;
    }
    if (fields?.productItem) {
      return ProductItemField;
    }
    return <></>;
  }

  return (
    <div ref={wrapperRef}>
      {ProductIntroField}
      {fields?.productItem && (
        <div ref={fallbackRef} style={{ display: productIntroField?.value ? 'none' : '' }}>
          {ProductItemField}
        </div>
      )}
    </div>
  );
};

const RenderEyebrow = ({
  props,
  themeData,
  isEE,
}: {
  props: ProductIntroProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  themeData: any;
  isEE: boolean;
}): JSX.Element => {
  const fields = props.fields;

  return (
    <RenderFragmentWithEEWrapper
      ProductIntroField={<Eyebrow classes={themeData.classes.eyebrow} {...props} />}
      ProductItemField={
        <Text
          tag="h4"
          className={themeData.classes.eyebrow}
          field={{
            value: fields.productItem?.fields?.productSeries?.fields?.productTypeName?.value ?? '',
          }}
        />
      }
      productIntroField={fields?.eyebrowText}
      props={props}
      isEE={isEE}
    />
  );
};

const RenderHeadline = ({
  props,
  themeData,
  isEE,
}: {
  props: ProductIntroProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  themeData: any;
  isEE: boolean;
}): JSX.Element => {
  const fields = props.fields;

  return (
    <RenderFragmentWithEEWrapper
      ProductIntroField={<Headline classes={themeData.classes.headline} {...props} />}
      ProductItemField={
        <Text
          useTag="h4"
          className={themeData.classes.headline}
          field={{ value: fields.productItem?.fields?.productName?.value ?? '' }}
        />
      }
      productIntroField={fields?.headlineText}
      props={props}
      isEE={isEE}
    />
  );
};

const RenderBodyCopy = ({
  props,
  themeData,
  isEE,
}: {
  props: ProductIntroProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  themeData: any;
  isEE: boolean;
}): JSX.Element => {
  const fields = props.fields;

  return (
    <RenderFragmentWithEEWrapper
      ProductIntroField={<BodyCopy classes={themeData.classes.bodyClass} {...props} />}
      ProductItemField={
        <RichTextWrapper
          field={{ value: fields.productItem?.fields?.productDescription?.value ?? '' }}
          classes={themeData.classes.bodyClass}
        />
      }
      productIntroField={fields?.body}
      props={props}
      isEE={isEE}
    />
  );
};

// --- Component ---

export function ProductIntroClient(props: ProductIntroProps): JSX.Element {
  const { fields, awAggregateRating } = props;
  const { themeName, themeData } = useTheme(ProductIntroTheme);
  const favoriteProductsArr = props.favoriteProducts ?? [];
  const showFavorite = fields?.productFavorite?.value;
  const productID = fields?.productItem?.fields?.productId?.value;
  const isFavorited = favoriteProductsArr.includes(productID);
  const [isInterior, setIsInterior] = useState<boolean>(true);
  const [selectedSwatchColor, setSelectedSwatchColor] = useState<number | undefined>();
  const [colorSwatches, setColorSwatches] = useState<ProductSwatch[] | undefined>();
  const isEE = useExperienceEditor();

  const { siteInfo, featureFlags } = useWebsiteContext();
  // Add the bazaarvoice script
  useBVScript({ environment, theme: themeName });

  const bazaarvoiceProductId = fields?.productItem?.fields?.bazaarvoiceProductId?.value;

  function updateToggleState(state: boolean) {
    setIsInterior(state);
  }
  const swatchHeading = isInterior
    ? fields?.interiorSwatchesHeadline
    : fields?.exteriorSwatchesHeadline;

  const interiorColorSwatches = useMemo(() => {
    return fields?.children?.filter((_childItem: ProductSwatch) => {
      return _childItem?.fields?.interior.value;
    });
  }, [fields]);

  const exteriorColorSwatches = useMemo(() => {
    return fields?.children?.filter((_childItem: ProductSwatch) => {
      return !_childItem?.fields?.interior.value;
    });
  }, [fields]);

  const [tabUrl, setTabUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const tabId =
      fields?.tabLinkToSelect?.fields?.contentId?.value ?? props?.fields?.tabLinkToSelect?.id;
    const newUrl = new URL(`${globalThis.location.pathname}#${tabId}`, globalThis.location.href);
    setTabUrl(tabId ? newUrl.href : undefined);
    // we can ignore suggested deps as they are directly coming from layout and can be ommited here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isInterior ? setColorSwatches(interiorColorSwatches) : setColorSwatches(exteriorColorSwatches);
    if (fields?.children?.length) {
      setSelectedSwatchColor(0);
    }
  }, [
    exteriorColorSwatches,
    fields?.children?.length,
    interiorColorSwatches,
    isInterior,
    themeName,
  ]);

  // Always render in edit mode so Sitecore field editors appear
  if (!fields && !isEE) {
    return <></>;
  }

  function renderColorSwatches(): JSX.Element {
    // Always render swatch headline fields in edit mode so Sitecore field editors appear
    if (colorSwatches?.length || isEE) {
      return (
        <>
          <Subheadline
            useTag="div"
            classes={themeData.classes.swatchHeadline}
            fields={{
              subheadlineText: swatchHeading ?? { value: '' },
            }}
          />

          {isEE && !colorSwatches?.length ? (
            // Show placeholder for swatch children in edit mode when no swatches exist
            <div className="mb-m flex gap-m">
              <span className="text-gray-400 italic text-sm">
                No color swatches configured, add child swatch items
              </span>
            </div>
          ) : (
            <ul className="mb-m flex gap-m">
              {colorSwatches?.map((_childItem, index: number) => {
                // Use a unique identifier for the key, fallback to index if not available
                const swatchKey =
                  _childItem?.fields?.productImageSwatch?.fields?.swatchName?.value ??
                  `colorswatch-${index}`;
                return (
                  <li key={swatchKey} className="flex flex-col items-center">
                    <button
                      type="button"
                      aria-pressed={selectedSwatchColor === index}
                      onClick={() => {
                        setSelectedSwatchColor(index);
                      }}
                      className={classNames(
                        'block h-[46px] w-[46px] rounded-full p-[2px]',
                        selectedSwatchColor === index ? 'border-2' : '',
                        'cursor-pointer'
                      )}
                    >
                      <span className="mx-auto block h-[38px] w-[38px] rounded-full  [&_img]:rounded-full">
                        <ImagePrimary
                          imageLayout="responsive"
                          fields={{
                            primaryImage: _childItem?.fields?.productImageSwatch?.fields
                              ?.swatchImage as ImageField,
                            primaryImageMobile: _childItem?.fields?.productImageSwatch?.fields
                              ?.swatchImage as ImageField,
                            primaryImageCaption: {
                              value: '',
                            },
                          }}
                        />
                      </span>
                    </button>

                    <Subheadline
                      useTag="span"
                      fields={{
                        subheadlineText: _childItem?.fields?.productImageSwatch?.fields
                          ?.swatchName ?? {
                          value: '',
                        },
                      }}
                      classes={themeData.classes.swatchTitle}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </>
      );
    } else {
      return <></>;
    }
  }

  const aggregateRating = {
    '@type': 'AggregateRating',
    reviewCount: awAggregateRating?.ReviewStatistics?.TotalReviewCount,
    ratingValue:
      awAggregateRating?.ReviewStatistics?.AverageOverallRating ??
      awAggregateRating?.ReviewStatistics?.OverallRatingRange,
    bestRating: awAggregateRating?.ReviewStatistics?.OverallRatingRange,
  };

  const brandName = 'Andersen Windows';
  const ldJsonScript = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: fields?.productItem?.fields?.productName?.value ?? '',
    description: fields?.productItem?.fields?.productDescription?.value ?? '',
    brand: {
      '@type': 'Brand',
      name: brandName,
    },
    image: fields?.productItem?.fields?.productImage?.value?.src ?? '',
    url: `${siteInfo?.canonicalHostName}${fields?.productItem?.fields?.productDetailPageLink?.value?.href}`,
    ...(aggregateRating && { aggregateRating }),
  };

  return (
    <>
      {!featureFlags.releaseSchemaOrgGraph && (
        <Script
          id=""
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJsonScript) }}
        />
      )}
      <Component variant="lg" dataComponent="product/productintro" {...props}>
        {/* Favourite - Always render in edit mode so Sitecore field editors appear */}
        {(showFavorite || isEE) && (
          <div className="absolute -top-[16px] right-0 max-md:hidden">
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
        <div className={themeData.classes.imageColClasses}>
          <ImageToggleWrapper
            fields={{
              primaryImage: fields.primaryImage,
              secondaryImage: fields.secondaryImage,
              primaryImageMobile: fields?.primaryImageMobile,
              secondaryImageMobile: fields?.secondaryImageMobile,
              primaryImageMobileFocusArea: fields?.primaryImageMobileFocusArea,
              secondaryImageMobileFocusArea: fields?.secondaryImageMobileFocusArea,
            }}
            colorSwatches={{
              interiorColorSwatches: interiorColorSwatches,
              exteriorColorSwatches: exteriorColorSwatches,
            }}
            selectedSwatchIndex={selectedSwatchColor}
            updateToggleState={updateToggleState}
            ratio={'square'}
          />
        </div>
        <div className={themeData.classes.descriptionColClasses}>
          {/* Favourite */}
          {showFavorite && (
            <div className={classNames(themeData.classes.favoriteProductWrapper)}>
              <div
                className={classNames(
                  themeData.classes.favoriteProduct,
                  isFavorited
                    ? 'favorited border-[transparent_#f26924_transparent_transparent]'
                    : ''
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
          <RenderEyebrow props={props} themeData={themeData} isEE={isEE} />
          <RenderHeadline props={props} themeData={themeData} isEE={isEE} />
          <RenderBodyCopy props={props} themeData={themeData} isEE={isEE} />
          {/* Always render claim in edit mode so Sitecore field editor appears */}
          {fields?.claim?.value || isEE ? (
            <RichTextWrapper
              field={isEE ? fields.claim : { value: fields.claim?.value }}
              classes={themeData.classes.claimClass}
            />
          ) : (
            <></>
          )}
          {/* Always render disclaimer in edit mode so Sitecore field editor appears */}
          {fields?.disclaimer?.value || isEE ? (
            <DisclaimerText
              fields={{
                ...fields,
                disclaimerText: isEE ? fields.disclaimer : fields?.disclaimer,
              }}
              disclaimerLayoutClasses="col-span-12 md:col-span-10 md:col-start-2"
              disclaimerClasses="text-dark-gray! mb-s"
            />
          ) : (
            <></>
          )}
          {/* ratings */}
          {isEE && !bazaarvoiceProductId && (
            <div className="italic text-sm text-gray-400">
              [Ratings: configure BazaarVoice Product ID on the linked product item]
            </div>
          )}
          <div className={themeData.classes.ratingsAndPriceWrapper}>
            <div className={themeData.classes.ratingsWrapper}>
              {bazaarvoiceProductId && (
                <div
                  className="review flex-[0_0_auto]"
                  data-bv-show="rating_summary"
                  data-bv-product-id={bazaarvoiceProductId}
                ></div>
              )}
            </div>
          </div>
          <div className="flex-none md:flex md:flex-wrap">
            <ButtonGroup
              cta1={cta1ToButtonProps(props, themeData.classes.buttonGroupClass.cta1Classes)}
              cta2={cta2ToButtonProps(props, themeData.classes.buttonGroupClass.cta2Classes)}
              wrapperClasses={themeData.classes.buttonGroupClass.wrapper}
            />
            {(fields?.AR?.fields || isEE) && (
              <CallToActionAR
                classes={{
                  wrapper: '',
                  buttonClasses:
                    'my-s flex w-fit items-center whitespace-nowrap rounded-lg border-4 border-black px-m py-[9px] font-sans text-button font-heavy hover:bg-black hover:text-white disabled:border-gray disabled:text-gray md:my-0',
                }}
                {...fields?.AR}
              />
            )}
          </div>

          {renderColorSwatches()}
          {/* AW custom cta for tab switch */}
          {tabUrl && (
            <SingleButton
              fields={{
                cta1Icon: {
                  id: 'f8ad4587-51a4-4e66-8eec-b448f78b4cb2',
                  url: '',
                  name: 'Augmented Reality',
                  displayName: 'Augmented Reality',
                  fields: {
                    Value: {
                      value: 'arrow',
                    },
                  },
                },
                cta1Link: {
                  value: {
                    href: tabUrl ?? '#',
                    text: fields?.tabLinkText?.value,
                    anchor: '',
                    linktype: 'internal',
                    class: '',
                    title: '',
                    target: '',
                    querystring: '',
                    id: '{BD66C47E-42B0-4EDD-BAD3-4BC981C05E5D}',
                  },
                },
                cta1Style: {
                  id: '8aedd89c-e161-41d4-b773-6a6097a19372',
                  url: '',
                  name: 'Secondary',
                  displayName: 'Secondary',
                  fields: {
                    Value: {
                      value: 'tertiary',
                    },
                  },
                },
                cta1ModalLinkText: {
                  value: '',
                },
                cta1PersonalizeEventName: {
                  value: '',
                },
                cta1AriaLabel: {
                  value: '',
                },
              }}
            />
          )}
        </div>
      </Component>
    </>
  );
}
