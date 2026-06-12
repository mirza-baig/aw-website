'use client';

import { Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import Component from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import Image from 'helpers/Media/Image';
import ImagePrimary from 'helpers/Media/ImagePrimary';
import { RichTextWrapper } from 'helpers/RichTextWrapper';
import SingleButton from 'helpers/SingleButton/SingleButton';
import { Spinner } from 'helpers/Spinner';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { useBVScript } from 'lib/utils/use-bv-script';
import { ToggleFavoriteAction } from 'lib/website/favorite-products/actions';
import { useFavoriteProducts } from 'lib/website/favorite-products/use-favorite-products';
import Link from 'next/link';
import { JSX, MouseEvent, useEffect, useState } from 'react';
import { environment } from 'startup/environment';

import { FavoriteProductsTheme } from './helpers/FavoriteProducts.theme';
import { NoResults } from './helpers/NoResults.helper';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type priceLevel = 1 | 2 | 3 | 4 | 5;

type FavoriteProductsProps = ComponentProps &
  Sitecore.Components.Listing.Favorites.FavoriteProducts;

// As of now, we don't have any type or interface defined for favoriteProductDetailsArray or favProduct
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ColorAndActions({ themeData, favProduct }: any): JSX.Element {
  const colorSwatchesAll = favProduct.standardInteriorColors?.targetItem?.swatches?.colors;
  const colorSwatchesTotal = colorSwatchesAll?.length;

  let featuredInteriorColors = favProduct.featuredInteriorColors.colors ?? [];

  let colorSwatchesCount = 0;

  if (colorSwatchesTotal && featuredInteriorColors?.length > 0) {
    featuredInteriorColors = featuredInteriorColors.slice(0, 3);
    colorSwatchesCount = colorSwatchesTotal - featuredInteriorColors.length;
  }

  return (
    <>
      {featuredInteriorColors?.length > 0 && (
        <div className={themeData.classes.colorSwatchesWrapper}>
          <Text tag={'h4'} field={{ value: 'Colors' }} className={themeData.classes.colorLabel} />
          <Link href={favProduct.productDetailPageLink.url ?? ''}>
            <div className={themeData.classes.swatches}>
              {featuredInteriorColors?.map(
                // As of now, we don't have any type or interface defined for favoriteProductDetail item and its properties (featuredInteriorColors items in this case)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (color: any, index: number) => {
                  return (
                    <div key={index} className={themeData.classes.colorSwatches}>
                      <Image image={{ value: color.swatchImage }} layout="intrinsic" />
                    </div>
                  );
                }
              )}
              {colorSwatchesCount > 0 && <div>+{colorSwatchesCount}</div>}
            </div>
          </Link>
        </div>
      )}
      {!!favProduct.productDetailPageLink.text && (
        <div className={themeData.classes.actions}>
          <SingleButton
            classes={
              (themeData.classes.buttonGroupClass,
              { wrapper: 'mb-0 md:mb-0', cta1Classes: 'font-bold' })
            }
            fields={{
              cta1Link: {
                value: {
                  href: favProduct.productDetailPageLink.url,
                  text: favProduct.productDetailPageLink.text,
                  anchor: favProduct.productDetailPageLink.anchor,
                  target: favProduct.productDetailPageLink.target,
                },
              },
              cta1AriaLabel: {
                value: '',
              },
              cta1ModalLinkText: {
                value: '',
              },
              cta1Style: {
                id: '',
                url: '',
                name: 'Primary',
                displayName: 'Primary',
                fields: {
                  Value: {
                    value: 'primary',
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
        </div>
      )}
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function priceRange(themeData: any, priceLevel: priceLevel) {
  switch (priceLevel) {
    case 1:
      return (
        <>
          <Text tag="span" className={themeData.classes.priceLevel} field={{ value: '$' }} />
          <Text tag="span" className={themeData.classes.priceLevel} field={{ value: '$$$$' }} />
        </>
      );
    case 2:
      return (
        <>
          <Text tag="span" className={themeData.classes.priceLevel} field={{ value: '$$' }} />
          <Text ttag="span" className={themeData.classes.priceLevel} field={{ value: '$$$' }} />
        </>
      );
    case 3:
      return (
        <>
          <Text tag="span" className={themeData.classes.priceLevel} field={{ value: '$$$' }} />
          <Text tag="span" className={themeData.classes.priceLevel} field={{ value: '$$' }} />
        </>
      );
    case 4:
      return (
        <>
          <Text tag="span" className={themeData.classes.priceLevel} field={{ value: '$$$$' }} />
          <Text ttag="span" className={themeData.classes.priceLevel} field={{ value: '$' }} />
        </>
      );
    case 5:
      return (
        <Text tag="span" className={themeData.classes.priceLevel} field={{ value: '$$$$$' }} />
      );
    default:
      return null;
  }
}

function FavoriteProducts_Default(props: FavoriteProductsProps): JSX.Element {
  const { fields } = props;

  const { page: currentPage } = useSitecore();
  const language = currentPage.layout.sitecore.context.language ?? 'en';

  const { themeName, themeData } = useTheme(FavoriteProductsTheme);
  const [favoriteProductDetailsArray, setFavoriteProductDetailsArray] = useState([]);

  // fetcher function for SWR
  const fetcher = async (url: string, favoriteProducts: string[], language: string) => {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ favoriteProducts, language }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  };

  const [productData] = useState([]);
  const [error, setError] = useState(null);

  const { favoriteProducts, toggleFavorite } = useFavoriteProducts();

  const hasFavoriteProduct = favoriteProducts.length > 0;

  useEffect(() => {
    if (favoriteProducts.length > 0) {
      fetcher('/api/aw/favorite-products', favoriteProducts, language)
        .then((data) => {
          setFavoriteProductDetailsArray(data.productData);
        })
        .catch((err) => setError(err));
    } else {
      setFavoriteProductDetailsArray([]);
    }
    // "language" is comig from sitecore context which is not going to change without page refreshing.
    // We can ignore the warning for this useEffect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favoriteProducts]);

  // Add the bazaarvoice script
  useBVScript({ environment, theme: themeName });

  const handlePrint = () => {
    const printStyles = `
    @media print {
      header,
      footer,
      .react-tabs__tab-list,
      .no-print,
      section[data-component="hero/herotwocolumn"],
      section[data-component="hero/tabsgeneralcontent"] h2 {
        display: none;
      }

      .printSection {
        display: inherit !important;
      }
      .printOnly {
        display: block !important;
      }
    }
  `;

    const style = document.createElement('style');
    style.innerHTML = printStyles;

    document.head.appendChild(style);
    window.print();
    document.head.removeChild(style);
  };

  const handleFavoriteProductClick = (event: MouseEvent) => {
    const target = event.target as Element;
    const link = target?.closest('.favorite-product-item');
    if (!link) {
      return;
    }

    const productId = link.getAttribute('data-product-id');

    if (productId == null) {
      return;
    }

    const action = toggleFavorite(productId);

    if (action == ToggleFavoriteAction.removed) {
      link.classList.remove('favorited', 'border-[transparent_#f26924_transparent_transparent]');
    } else {
      link.classList.add('favorited', 'border-[transparent_#f26924_transparent_transparent]');
    }
  };

  return (
    <Component variant="lg" dataComponent="listing/favoriteproducts" {...props}>
      <div className="printSection col-span-12 flex justify-between">
        <Headline useTag="h4" classes={themeData.classes.mainheadline} {...props} />
        {productData?.length > 0 && hasFavoriteProduct && !error && (
          <div
            onClick={handlePrint}
            className="no-print flex cursor-pointer items-center text-body text-primary max-md:hidden"
          >
            <SvgIcon icon="pdf-aw" className="mr-xxs" />
            Print
          </div>
        )}
      </div>
      <div className="col-span-12">
        {hasFavoriteProduct ? (
          // Favorite Products
          <>
            {!productData && !error && (
              <div className="loader flex min-h-[40vh] w-full items-center justify-center">
                <Spinner size={48} />
              </div>
            )}
            {error && (
              <div className="font-sans text-sm-m font-medium md:text-m">
                {
                  "We're sorry, we couldn't process your request at this time. Please refresh or try again later."
                }
              </div>
            )}
            <div className="printSection grid grid-cols-1 gap-4 ml:grid-cols-3">
              {!error &&
                favoriteProductDetailsArray.length > 0 &&
                favoriteProductDetailsArray.map(
                  // As of now, we don't have any type or interface defined for favoriteProductDetailsArray or its items
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (favProduct: any, index: number) => {
                    const productID = favProduct.productId.value;
                    const isFavorited = favoriteProducts.includes(productID);
                    const priceLevel =
                      favProduct.priceLevel?.targetItem?.priceLevelText?.value &&
                      (+favProduct.priceLevel.targetItem.priceLevelText.value as priceLevel | null);
                    const bazaarvoiceProductId = favProduct?.bazaarvoiceProductId?.value;

                    return (
                      <div key={index} className="mb-m">
                        <div className={themeData.classes.productPreviewCradWrapper}>
                          {/* Favourite */}
                          <div className="absolute top-0 right-0">
                            <div
                              className={classNames(
                                themeData.classes.favoriteProduct,
                                isFavorited
                                  ? ' favorite-product-item favorited border-[transparent_#f26924_transparent_transparent]'
                                  : ''
                              )}
                              data-product-id={favProduct.productId.value}
                              onClick={handleFavoriteProductClick}
                            >
                              <SvgIcon
                                icon="favorite"
                                fillId="white"
                                size="xl"
                                className={themeData.classes.favoriteIcon}
                              />
                            </div>
                          </div>

                          <div className={themeData.classes.headerWrapper}>
                            <Text
                              tag="h4"
                              className={themeData.classes.eyebrow}
                              field={{
                                value: favProduct.productSeries?.targetItem?.productTypeName?.value,
                              }}
                            />
                            <Link
                              href={favProduct.productDetailPageLink.url ?? ''}
                              className={themeData.classes.headlineWrapper}
                            >
                              <Text
                                useTag="h4"
                                className={themeData.classes.headline}
                                field={{ value: favProduct.productName.value }}
                              />
                            </Link>

                            {/* This is a placeholder for the ratings/price API to be configured */}
                            <div className={themeData.classes.ratingsAndPriceWrapper}>
                              {bazaarvoiceProductId && (
                                <div
                                  className="review flex-[0_0_auto]"
                                  data-bv-show="inline_rating"
                                  data-bv-product-id={bazaarvoiceProductId}
                                  data-bv-seo="false"
                                ></div>
                              )}

                              {/* Price Range */}
                              {priceLevel && priceLevel > 0 && (
                                <div
                                  className={
                                    bazaarvoiceProductId ? themeData.classes.priceLevelWrapper : ''
                                  }
                                >
                                  <div className={themeData.classes.priceText}>
                                    {priceRange(themeData, priceLevel)}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="order-2 my-xxs self-stretch">
                            <div className="printOnly hidden">
                              <img
                                src={favProduct.productImage?.src}
                                alt={favProduct.productImage?.alt}
                                className="mx-auto h-[350px]"
                              />
                            </div>
                            <Link
                              href={favProduct.productDetailPageLink.url ?? ''}
                              className="no-print"
                            >
                              <ImagePrimary
                                imageLayout={'intrinsic'}
                                fields={{
                                  primaryImageCaption: {
                                    value: '',
                                  },
                                  primaryImage: { value: favProduct.productImage },
                                  primaryImageMobile: { value: favProduct.productImageMobile },
                                  primaryImageMobileFocusArea: favProduct
                                    ?.primaryImageMobileFocusArea?.targetItem?.value?.value
                                    ? {
                                        id: '',
                                        url: '',
                                        name: favProduct.primaryImageMobileFocusArea.targetItem
                                          .value.value,
                                        displayName:
                                          favProduct.primaryImageMobileFocusArea.targetItem.value
                                            .value,
                                        fields: {
                                          Value: {
                                            value:
                                              favProduct.primaryImageMobileFocusArea.targetItem
                                                .value.value,
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
                            </Link>
                          </div>
                          <RichTextWrapper
                            field={{ value: favProduct.productDescription.value }}
                            classes={themeData.classes.body}
                          />
                          <div className={themeData.classes.awColorsandCTA}>
                            <ColorAndActions themeData={themeData} favProduct={favProduct} />
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
            </div>
          </>
        ) : (
          // No Favorite Product
          <NoResults fields={fields} />
        )}
      </div>
    </Component>
  );
}

export const Default = withDatasourceCheck(FavoriteProducts_Default);
