'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Item } from '@sitecore-content-sdk/nextjs';
import Button from 'helpers/Button/Button';
import { cta1ToButtonProps, cta2ToButtonProps } from 'helpers/Button/Utils';
import ButtonGroup from 'helpers/ButtonGroup/ButtonGroup';
import Component from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import ImageWrapper from 'helpers/Media/ImageWrapper';
import MediaPrimary from 'helpers/Media/MediaPrimary/MediaPrimary';
import MediaSecondary from 'helpers/Media/MediaSecondary';
import ModalWrapper from 'helpers/ModalWrapper/ModalWrapper';
import RichTextWrapper from 'helpers/RichTextWrapper/RichTextWrapper';
import { SliderWrapper } from 'helpers/SliderWrapper';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import useExperienceEditor from 'lib/utils/use-experience-editor';
import React, { JSX, useEffect, useState } from 'react';
import TagManager from 'react-gtm-module';

import { ContentBlockWithMediaAndProductTheme } from './helpers/ContentBlockWithMediaAndProduct.theme';
import ModalPortal from './helpers/ModalPortal';
import { Sitecore } from '.sitecore/AndersenWindows.model';

function PrevArrow(props: Readonly<{ onClick?: React.MouseEventHandler<HTMLButtonElement> }>) {
  const { onClick } = props;
  return (
    <button
      className="absolute -bottom-12 left-[34%] z-10 flex h-ml w-ml translate-x-0 -translate-y-1/2 transform items-center justify-center rounded-full border border-secondary bg-transparent"
      onClick={onClick}
      type="button"
      aria-label="Previous slide"
    >
      <SvgIcon className="" size="md" icon="arrow-left" />
    </button>
  );
}

function NextArrow(props: Readonly<{ onClick?: React.MouseEventHandler<HTMLButtonElement> }>) {
  const { onClick } = props;
  return (
    <button
      className="absolute -bottom-12 right-[34%] z-10 flex h-ml w-ml translate-x-0 -translate-y-1/2 transform items-center justify-center rounded-full border border-secondary bg-transparent"
      onClick={onClick}
      type="button"
      aria-label="Next slide"
    >
      <SvgIcon className="" size="md" icon="arrow-right" />
    </button>
  );
}

type ContentBlockWithMediaAndProductProps =
  Sitecore.Components.General.ContentBlockWithMediaAndProduct.ContentBlockWithMediaAndProduct;

function ContentBlockWithMediaAndProduct_Default(
  props: ComponentProps & ContentBlockWithMediaAndProductProps
): JSX.Element {
  const productSeries = props?.fields?.['product Series'];
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);
  const sliderSettings = React.useMemo(
    () => ({
      dots: true,
      slidesToShow: 1,
      pauseOnFocus: true,
      pauseOnHover: true,
      dotsClass: 'slick-dots static',
      adaptiveHeight: true,
      nextArrow: <NextArrow key="next-arrow" />,
      prevArrow: <PrevArrow key="prev-arrow" />,
      beforeChange: (_oldIndex: number, newIndex: number) => {
        const activeSlide = document.querySelector(
          `.slick-slide[data-index="${newIndex}"]`
        ) as HTMLElement;
        if (activeSlide) {
          activeSlide.style.height = 'fit-content';
        }
      },
    }),
    []
  );

  const buttonProps = {
    field: {
      value: {
        href: '#',
        text: 'Learn More',
      },
    },
    variant: {
      id: '',
      url: '',
      name: 'Primary',
      displayName: 'Primary',
      fields: {
        Value: {
          value: 'primary',
        },
      },
      templateId: '',
      templateName: 'Enum',
    },
    icon: {
      name: 'Arrow',
      displayName: 'Arrow',
      id: '',
      url: '',
      fields: {
        Value: {
          value: 'arrow',
        },
      },
      templateId: '',
      templateName: 'Enum',
    },
    classes: 'pointer-events-none',
    suppressLinkText: true,
  };

  //for modal impression tracking
  useEffect(() => {
    if (selectedProductIndex !== null) {
      const selectedProduct = productSeries[selectedProductIndex];
      TagManager.dataLayer({
        dataLayer: {
          event: 'blog_modal_impression',
          modalName: `modal-${selectedProductIndex}`,
          modalTitle: selectedProduct.name, // Using product name as modal title
          pageType: 'blog',
        },
      });
    }
  }, [productSeries, selectedProductIndex]);

  const reqQouteCta = {
    href: '/request-a-quote/',
    text: 'Request a Quote',
    anchor: '',
    linktype: 'internal',
    class: '',
    title: '',
    querystring: '',
    id: '',
  };

  const isEE = useExperienceEditor();
  const { themeData } = useTheme(ContentBlockWithMediaAndProductTheme(props));
  const { currentScreenWidth } = useCurrentScreenType();
  const handleClick = (e: React.MouseEvent<HTMLElement>, index: number) => {
    // Prevents the default action of the event
    e.preventDefault();
    e.stopPropagation();
    // tracking event for learn more products in the blog page
    TagManager.dataLayer({
      dataLayer: {
        event: 'blog_learnMore_click',
        productIndex: index,
        productName:
          productSeries?.[index]?.fields?.productFullName?.value ??
          productSeries?.[index]?.fields?.seriesTitle?.value,
        pageType: 'blog',
      },
    });
    setSelectedProductIndex(index);
    return false;
  };

  const handleCloseModal = () => {
    setSelectedProductIndex(null);
  };
  if (!props) {
    return <></>;
  }
  const imageLayoutType =
    props.fields?.primaryImage?.value?.src &&
    !props.fields?.secondaryImage?.value?.src &&
    currentScreenWidth >= getBreakpoint('md')
      ? 'intrinsic'
      : 'responsive';

  const imageContainerWidth =
    imageLayoutType === 'intrinsic'
      ? { maxWidth: `${props.fields?.primaryImage?.value?.width}px` }
      : {};

  const focusArea = 'top center';

  return (
    <Component variant="lg" dataComponent="general/contentblockwithmediandproduct" {...props}>
      <div className="col-span-12 grid grid-cols-12 md:gap-x-s">
        <div className={themeData.classes.headingContainer}>
          <Headline defaultTag="h2" classes={themeData.classes.headlineContainer} {...props} />
          <RichTextWrapper
            field={props.fields?.topCopy}
            className={themeData.classes.topCopyContainer}
          />
        </div>
        <div className={themeData.classes.bodyContainer}>
          <div className={themeData.classes.imageContainer}>
            {(props.fields?.primaryImage?.value?.src ?? props.fields?.primaryVideo ?? isEE) && (
              <div
                className={
                  props.fields?.secondaryImage?.value?.src
                    ? themeData.classes.imageOuterContainer
                    : themeData.classes.imageOuterContainerSecond
                }
                style={imageContainerWidth}
              >
                <MediaPrimary {...props} imageLayout={imageLayoutType} focusArea={focusArea} />
              </div>
            )}
            {(props.fields?.secondaryImage?.value?.src ?? props.fields?.secondaryVideo ?? isEE) && (
              <div className={themeData.classes.imageOuterContainer} style={imageContainerWidth}>
                <MediaSecondary {...props} imageLayout={imageLayoutType} focusArea={focusArea} />
              </div>
            )}

            {/* SliderWrapper for mobile view */}
            {productSeries ? (
              <div className="mobile block pb-10 md:hidden">
                <RichTextWrapper
                  defaultTag="h2"
                  classes={'text-s md:text-s font-sans text-center font-bold pb-8 '}
                  field={{ value: 'Products Shown' }}
                />
                <SliderWrapper sliderSettings={sliderSettings}>
                  {productSeries?.map((product: any, index: number) => {
                    const productKey = `mobile-product-${product?.fields?.productFullName?.value ?? product?.fields?.seriesTitle?.value ?? index}`;
                    return (
                      <div key={productKey} className="flex h-full flex-col">
                        <ImageWrapper
                          image={product?.fields?.productImage ?? product?.fields?.seriesImage}
                          additionalMobileClasses="w-52 mx-auto pb-s"
                          ratio="square"
                        />
                        <RichTextWrapper
                          field={{
                            value:
                              product?.fields?.productFullName?.value ??
                              product?.fields?.seriesTitle?.value,
                          }}
                          classes={themeData.classes.productDescriptionMobile}
                        />
                        <button
                          className="flex w-full justify-center border-0 p-0 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleClick(e, index);
                          }}
                        >
                          <span className="flex w-fit items-center whitespace-normal rounded-lg border-4 border-theme-btn-border bg-theme-btn-bg px-m py-[9px] font-sans text-button font-heavy text-theme-btn-text hover:border-theme-btn-border-hover hover:bg-theme-btn-bg-hover hover:text-theme-btn-text-hover">
                            Learn More
                            <SvgIcon icon="arrow" className="ml-xxs" />
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </SliderWrapper>
              </div>
            ) : (
              <> </>
            )}
            {/* SliderWrapper for mobile view */}
            {productSeries ? (
              <div className="col-span-2 hidden md:block">
                <RichTextWrapper
                  defaultTag="h2"
                  classes={themeData.classes.headlineContainerProductUsed}
                  field={{ value: 'Products used in this image' }}
                />
                <div>
                  {productSeries?.map((product: any, index: number) => {
                    const productKey = `desktop-product-${product?.fields?.productFullName?.value ?? product?.fields?.seriesTitle?.value ?? index}`;
                    const descriptionButtonProps =
                      product?.fields?.seriesLandingPageCTA ??
                      product?.fields?.productDetailPageLink;
                    const secondCTA = product?.fields?.designToolLink?.value ?? reqQouteCta;
                    return (
                      <div key={productKey} className="flex flex-col items-center">
                        <div className="w-full mb-s md:w-[76%] lg:w-[154px]">
                          <ImageWrapper
                            image={product?.fields?.productImage ?? product?.fields?.seriesImage}
                            ratio="square"
                            imageLayout="fill"
                          />
                        </div>
                        <RichTextWrapper
                          field={{
                            value:
                              product?.fields?.productFullName?.value ??
                              product?.fields?.seriesTitle?.value,
                          }}
                          classes={themeData.classes.productDescription}
                        />
                        <button
                          className="self-center pb-8  border-0 p-0 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleClick(e, index);
                          }}
                        >
                          <Button {...buttonProps} />
                        </button>
                        <ModalPortal>
                          {/* {createPortal( */}
                          <ModalWrapper
                            size="fluid"
                            handleClose={handleCloseModal}
                            isModalOpen={selectedProductIndex === index}
                            customOverlayclass=""
                            customContentWrapperclass="md:w-[93vw] lg:w-[50vw] w-[93vw] bg-white!"
                          >
                            <div className="grid grid-cols-12 pb-10 md:gap-x-s">
                              <div className="col-span-12 md:col-span-3 lg:col-span-3">
                                <div className="ml-3 md:w-52 md:ml-4">
                                  <ImageWrapper
                                    image={
                                      product?.fields?.productImage ?? product?.fields?.seriesImage
                                    }
                                    ratio="square"
                                    imageLayout="fill"
                                  />
                                </div>
                              </div>
                              <div className="col-span-12 md:col-span-9 lg:col-span-9 lg:mr-14">
                                <div className="mr-3 sm:ml-16  lg:mr-0">
                                  <RichTextWrapper
                                    field={{
                                      value:
                                        product?.fields?.productFullName?.value ??
                                        product?.fields?.seriesTitle?.value,
                                    }}
                                    classes={themeData.classes.headlineContainer}
                                  />
                                  <RichTextWrapper
                                    field={{
                                      value:
                                        product?.fields?.seriesSubtitle?.value ??
                                        product?.fields?.productSubtitle?.value,
                                    }}
                                    classes={themeData.classes.topCopySubtitle}
                                  />
                                  <RichTextWrapper
                                    field={
                                      product?.fields?.productDescription ??
                                      product?.fields?.seriesDescription
                                    }
                                    classes={themeData.classes.topCopyContainer}
                                  />
                                  <div className="mt-4 flex space-y-4 md:space-x-4 md:space-y-0 lg:flex-row lg:space-y-0 lg:space-x-4 ">
                                    {descriptionButtonProps && (
                                      <Button
                                        variant={
                                          {
                                            fields: {
                                              Value: {
                                                value: 'primary',
                                              },
                                            },
                                          } as unknown as Item
                                        }
                                        field={descriptionButtonProps}
                                        classes="w-full! md:w-fit! justify-center"
                                      />
                                    )}
                                    {secondCTA && (
                                      <Button
                                        variant={
                                          {
                                            fields: {
                                              Value: {
                                                value: 'secondary',
                                              },
                                            },
                                          } as unknown as Item
                                        }
                                        field={secondCTA}
                                        classes="w-full! md:w-fit! justify-center"
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </ModalWrapper>
                        </ModalPortal>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <> </>
            )}
          </div>
          <RichTextWrapper
            classes={themeData.classes.bodyContainer}
            field={props.fields?.bottomCopy}
          />
        </div>
        <div className={themeData.classes.contentWrapper}>
          <div
            className={
              props.fields.ctaAlignment?.displayName === 'Stack'
                ? 'flex flex-col items-start justify-evenly md:space-y-4'
                : 'flex flex-col items-start md:flex-row'
            }
          >
            <ButtonGroup
              cta1={cta1ToButtonProps(props, themeData.classes.buttonGroupClass.cta1Classes)}
              cta2={cta2ToButtonProps(props, themeData.classes.buttonGroupClass.cta2Classes)}
              wrapperClasses={themeData.classes.buttonGroupClass.wrapper}
            />
          </div>
        </div>
        <div className="col-span-12">
          {/* ModalWrapper placed separately outside the SliderWrapper for mobile */}
          {productSeries?.map((product: any, index: number) => {
            const productKey = `mobile-modal-${product?.fields?.productFullName?.value ?? product?.fields?.seriesTitle?.value ?? index}`;
            const descriptionButtonProps =
              product?.fields?.seriesLandingPageCTA ?? product?.fields?.productDetailPageLink;
            const secondCTA = product?.fields?.designToolLink?.value ?? reqQouteCta;
            return (
              <ModalPortal key={productKey}>
                <div key={`${productKey}-wrapper`} className="mobile-modal block md:hidden">
                  <ModalWrapper
                    key={`${productKey}-modal`}
                    size="extra-large"
                    handleClose={handleCloseModal}
                    isModalOpen={selectedProductIndex === index}
                    customOverlayclass=""
                    customContentWrapperclass="size-full! pb-m"
                  >
                    <div className="mt-16 grid grid-cols-12 pb-10  md:gap-x-s">
                      <div className="col-span-12 lg:col-span-5">
                        <div className="ml-3 mr-3 lg:ml-0">
                          <ImageWrapper
                            image={product?.fields?.productImage ?? product?.fields?.seriesImage}
                            additionalMobileClasses="w-40 mx-auto pb-s"
                            ratio="square"
                            imageLayout="intrinsic"
                          />
                        </div>
                      </div>
                      <div className="col-span-12 lg:col-span-7">
                        <div className="mr-3 sm:ml-3 sm:mr-3 lg:mr-0">
                          <RichTextWrapper
                            field={{
                              value:
                                product?.fields?.productFullName?.value ??
                                product?.fields?.seriesTitle?.value,
                            }}
                            classes={themeData.classes.headlineContainerMobile}
                          />
                          <RichTextWrapper
                            field={{
                              value:
                                product?.fields?.seriesSubtitle?.value ??
                                product?.fields?.productSubtitle?.value,
                            }}
                            classes={themeData.classes.topCopySubtitle}
                          />
                          <RichTextWrapper
                            field={
                              product?.fields?.productDescription ??
                              product?.fields?.seriesDescription
                            }
                            classes={themeData.classes.topCopyContainer}
                          />

                          <div className="mt-4 flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
                            {descriptionButtonProps && (
                              <Button
                                variant={
                                  {
                                    fields: {
                                      Value: {
                                        value: 'primary',
                                      },
                                    },
                                  } as unknown as Item
                                }
                                field={descriptionButtonProps}
                                classes=" md:w-fit! justify-center w-[200px]"
                              />
                            )}
                            {secondCTA && (
                              <Button
                                variant={
                                  {
                                    fields: {
                                      Value: {
                                        value: 'secondary',
                                      },
                                    },
                                  } as unknown as Item
                                }
                                field={secondCTA}
                                classes=" md:w-fit! justify-center w-[200px]"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </ModalWrapper>
                </div>
              </ModalPortal>
            );
          })}
        </div>
      </div>
    </Component>
  );
}

export const Default = withDatasourceCheck(ContentBlockWithMediaAndProduct_Default);
