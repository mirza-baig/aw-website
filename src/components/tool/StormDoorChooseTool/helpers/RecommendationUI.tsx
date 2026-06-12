'use client';

import { Text } from '@sitecore-content-sdk/nextjs';
import Image from 'helpers/Media/Image';
import ImagePrimary from 'helpers/Media/ImagePrimary';
import { RichTextWrapper } from 'helpers/RichTextWrapper';
import SingleButton from 'helpers/SingleButton/SingleButton';
import { Spinner } from 'helpers/Spinner';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import React from 'react';

type RecommendationUIProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recommendationDataRes: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recommendationProductsRes: any[];
  recommendationProductsError?: unknown;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  allSelectedAnswerText: any[];
  startOverText?: string;
  summaryHeadline?: string;
  youSelectedHeadline?: string;
  onStartOver: () => void;
  isLoading: boolean;
};

export const RecommendationUI = React.memo(function RecommendationUI({
  recommendationDataRes,
  recommendationProductsRes,
  recommendationProductsError,
  allSelectedAnswerText,
  startOverText,
  summaryHeadline,
  youSelectedHeadline,
  onStartOver,
  isLoading,
}: RecommendationUIProps) {
  return (
    <div className="flex w-full flex-col justify-center">
      {/* ✅ ERROR */}
      {recommendationProductsError ? (
        <div className="mb-s text-center font-sans text-sm-m font-medium md:text-s">
          We&apos;re sorry, we couldn&apos;t process your request at this time.
          <br />
          Please refresh or try again later.
        </div>
      ) : (
        <>
          {/* ✅ START OVER */}
          <button
            type="button"
            onClick={onStartOver}
            className="mb-m mt-xxs flex w-full cursor-pointer items-center justify-center font-sans text-button font-demi text-black"
          >
            <Text field={{ value: startOverText }} />
            <SvgIcon icon="reset" className="ml-xxs" />
          </button>

          {/* ✅ YOU SELECTED */}
          <div className="mb-m flex flex-col items-center justify-center bg-light-gray p-s  text-center ml:mb-l">
            <div className="flex w-full items-center justify-center text-center  text-sm-xs font-heavy text-black ml:text-xs">
              <Text field={{ value: youSelectedHeadline }} />
            </div>

            <ul className="mt-xxs mb-xxs flex w-full flex-wrap items-center justify-center text-center">
              {allSelectedAnswerText.map((ans, i) => (
                <li key={`all-answers-${ans.id}`}>
                  <div className=" font-sans text-sm-xs font-medium text-black ml:text-xs ">
                    <Text field={{ value: ans.answerText.value }} className="underline" />
                    {i < allSelectedAnswerText.length - 1 && <>, </>}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* ✅ SUMMARY */}
          <div className="mb-m flex w-full  items-center font-sans text-sm-s font-heavy text-black md:justify-center ml:text-s">
            <Text field={{ value: summaryHeadline }} />
          </div>
        </>
      )}

      {/* ✅ LOADER */}
      {isLoading && (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size={48} />
        </div>
      )}

      {/* ✅ PRODUCTS */}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {recommendationDataRes?.map((recommendation: any) => {
        const productDetails = recommendationProductsRes.filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (product: any) =>
            product.ItemId === recommendation.productItem.value.replaceAll(/[{}-]/g, '')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) as any;

        if (!productDetails.length) {
          return (
            <div key={`product-${recommendation.productItem.value}`}>
              <div className="flex min-h-50 items-center justify-center">
                <Spinner size={32} />
              </div>
            </div>
          );
        }

        const product = productDetails[0];

        const featuredColors = product.colors?.targetItem?.swatches?.colors || [];

        const colorsSwatchCollectionName =
          product.colors?.targetItem?.swatchCollectionName?.value || '';

        const featuredHandleSetFinishes =
          product.handleSetFinishes?.targetItem?.swatches?.colors || [];

        const handleSetFinishesSwatchCollectionName =
          product.handleSetFinishes?.targetItem?.swatchCollectionName?.value || '';
        return (
          <div key={recommendation.productItem.value}>
            <div
              key={`product-${recommendation.productItem.value}`}
              className="flex min-h-50 w-full flex-col text-left ml:flex-row"
            >
              {/* ✅ IMAGE */}
              <div className="mb-s flex max-h-81.25 items-center border border-solid border-gray p-s ml:max-h-47 ml:w-[25%]">
                <ImagePrimary
                  fields={{
                    primaryImage: { value: product.productImage },
                    primaryImageMobile: { value: product.productImageMobile },
                    primaryImageCaption: { value: '' },
                    primaryImageMobileFocusArea: product.primaryImageMobileFocusArea?.targetItem
                      ?.value?.value
                      ? {
                          id: '',
                          url: '',
                          name: product.primaryImageMobileFocusArea.targetItem.value.value,
                          displayName: product.primaryImageMobileFocusArea.targetItem.value.value,
                          fields: {
                            Value: {
                              value: product.primaryImageMobileFocusArea.targetItem.value.value,
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
                  additionalMobileClasses="max-w-[293px] max-h-[293px] h-[293px]  m-auto overflow-hidden"
                  additionalDesktopClasses="max-w-[156px] max-h-[156px] h-[156px] [&_span]:max-h-[156px] m-auto overflow-hidden"
                  imageLayout="responsive"
                />
              </div>

              {/* CONTENT */}
              <div className="flex flex-col ml:w-[75%] ml:pl-s">
                <div className="mb-xxs font-sans text-s font-medium">
                  <Text field={{ value: product.productFullName.value }} />
                </div>

                <RichTextWrapper
                  field={{ value: product.productDescription.value }}
                  classes="text-dark-gray text-small"
                />

                {/* COLORS */}
                {featuredColors.length > 0 && (
                  <div className="mt-m flex">
                    <div className="w-23.5 min-w-23.5 font-sans text-xxs font-heavy uppercase">
                      <Text field={{ value: colorsSwatchCollectionName }} />
                    </div>

                    <div className="flex flex-wrap pl-xxxs">
                      {featuredColors.map(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (color: any, i: number) => {
                          return (
                            <div
                              key={`feature-color-${color.swatchName}-${i}`}
                              className="mr-3.5 mb-3.5 h-7.5 w-7.5 rounded-full [&_img]:rounded-full **:h-7.5 **:w-7.5"
                            >
                              <Image image={{ value: color.swatchImage }} />
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

                {/* FINISHES */}
                {featuredHandleSetFinishes.length > 0 && (
                  <div className="mt-m flex">
                    <div className="w-23.5 min-w-23.5 font-sans text-xxs font-heavy uppercase">
                      <Text field={{ value: handleSetFinishesSwatchCollectionName }} />
                    </div>

                    <div className="flex flex-wrap pl-xxxs">
                      {featuredHandleSetFinishes.map(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (color: any, i: number) => {
                          return (
                            <div
                              key={`feature-handle-set-finish-${color.swatchName}-${i}`}
                              className="mr-3.5 mb-3.5 h-7.5 w-7.5 rounded-full [&_img]:rounded-full **:h-7.5 **:w-7.5"
                            >
                              <Image image={{ value: color.swatchImage }} />
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

                {/* CTAs */}
                <div className="mt-m flex flex-col ml:flex-row">
                  {
                    recommendation.cta1Link?.text && (
                      <SingleButton
                        fields={{
                          cta1Link: {
                            value: {
                              href: recommendation.cta1Link.url,
                              text: recommendation.cta1Link.text,
                              target: recommendation.cta1Link.text,
                              url: recommendation.cta1Link.url,
                              anchor: recommendation.cta1Link.anchor,
                            },
                          },
                          cta1ModalLinkText: {
                            value: '',
                          },
                          cta1AriaLabel: {
                            value: '',
                          },
                          cta1Style: {
                            id: '',
                            url: '',
                            name: recommendation.cta1Style.targetItem.value.value,
                            displayName: recommendation.cta1Style.targetItem?.value.value,
                            fields: {
                              Value: {
                                value: recommendation.cta1Style.targetItem.value.value,
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
                                value: recommendation.cta1Icon.targetItem.value.value,
                              },
                            },
                          },
                        }}
                      />
                    )
                    // <SingleButton fields={{ cta1Link: { value: recommendation.cta1Link } }} />
                  }
                  {recommendation.cta2Link.text && (
                    <SingleButton
                      fields={{
                        cta1Link: {
                          value: {
                            href: recommendation.cta2Link.url,
                            text: recommendation.cta2Link.text,
                            target: recommendation.cta2Link.text,
                            url: recommendation.cta2Link.url,
                            anchor: recommendation.cta2Link.anchor,
                          },
                        },
                        cta1ModalLinkText: {
                          value: '',
                        },
                        cta1AriaLabel: {
                          value: '',
                        },
                        cta1Style: {
                          id: '',
                          url: '',
                          name: recommendation.cta2Style.targetItem.value.value,
                          displayName: recommendation.cta2Style.targetItem.value.value,
                          fields: {
                            Value: {
                              value: recommendation.cta2Style.targetItem.value.value,
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
                              value: recommendation.cta2Icon.targetItem.value.value,
                            },
                          },
                        },
                      }}
                      classes={{ wrapper: 'ml:ml-s' }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* DIVIDER */}
            <hr className="mb-m bg-gray" />
          </div>
        );
      })}
    </div>
  );
});
