/* eslint-disable @typescript-eslint/no-explicit-any */
import { Field, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import { hashCode } from 'lib/utils/string-utils/hash-code';
import { isSvgUrl } from 'lib/utils/url-utils/is-svg-url';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Disclaimer from 'src/helpers/DisclaimerText/DisclaimerText';
import ModalWrapper from 'src/helpers/ModalWrapper/ModalWrapper';
import SvgIcon from 'src/helpers/SvgIcon/SvgIcon';

import { getComparisonObject, groupProductStyles } from './CompareChart.helper';
import { ComparisonTitles } from './ComparisonTitles';
import { Selector } from './Selector';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export type ProductCompareChartProps =
  Sitecore.Components.Product.ComparisonTable.ProductCompareChart & ComponentProps;

export const ProductCompareChart = (props: ProductCompareChartProps) => {
  const isProductComparison = props.fields && (() => 'products' in props.fields)();
  const originalGroupedProducts = isProductComparison && groupProductStyles(props.fields);
  const [selectedProductStyleIndex, setSelectedProductStyleIndex] = useState(0);
  const originalComparisonObject = getComparisonObject(
    isProductComparison
      ? {
          products:
            originalGroupedProducts.products[
              originalGroupedProducts.productStyles[selectedProductStyleIndex]?.productTitle
            ],
          tableStructure: props.fields.tableStructure,
        }
      : props.fields,
    isProductComparison
  );
  const [comparisonObject, setComparisonObject] = useState(originalComparisonObject);
  console.log('original comparision object', comparisonObject);

  const [isProductSelectorVisible, setIsProductSelectorVisible] = useState(false);

  const [isSeriesSelectorVisible, setIsSeriesSelectorVisible] = useState(false);
  const [selectedProductTypeIndex, setSelectedProductTypeIndex] = useState(0);

  const { currentScreenWidth } = useCurrentScreenType();

  const scrollableSectionRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const comparisonTableRef = useRef<HTMLDivElement | null>(null);
  const comparisonTableId = `comparison-table-${props?.fields?.sectionId?.value ?? hashCode(props?.rendering?.dataSource ?? '')}`;

  useEffect(() => {
    const container = scrollableSectionRef.current;

    const handleScroll = () => {
      if (container) {
        const scrollLeft = container.scrollLeft;
        const containers = document.querySelectorAll('.no-scrollbar');

        for (const otherContainer of containers) {
          if (otherContainer !== container) {
            otherContainer.scrollLeft = scrollLeft;
          }
        }
        // update active card index for mobile dots
        if (isMobile) {
          const children = Array.from(container.children) as HTMLElement[];
          if (children.length) {
            let active = 0;
            for (let i = 0; i < children.length; i += 1) {
              const child = children[i];
              const childOffset = child.offsetLeft;
              if (childOffset >= scrollLeft - 1) {
                active = i;
                break;
              }
            }
            setActiveCardIndex(active);
          }
        }
      }
    };

    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const isMobile = currentScreenWidth <= getBreakpoint('ml');

  // ── Helper: render price level as $$$$ indicators ──
  const renderPrice = (priceData: any) => {
    const level = Number.parseInt(priceData?.priceLevel ?? '0', 10);
    const maxLevel = 5;
    return (
      <span
        className={`font-bold ${isMobile ? 'text-sm' : 'text-lg'}`}
        style={{ fontFamily: 'futura-pt, sans-serif' }}
      >
        {Array.from({ length: maxLevel }, (_, i) => (
          <span key={i} className={i < level ? 'text-black' : 'text-[#C4BFB6]'}>
            $
          </span>
        ))}
      </span>
    );
  };

  // ── Helper: render swatch circles with overflow count ──
  const renderSwatches = (swatchData: any, maxVisible?: number) => {
    const maxVisibleCount = maxVisible ?? (isMobile ? 2 : 4);
    if (!swatchData) {
      return <span>—</span>;
    }
    const swatches = swatchData?.swatches ?? swatchData;
    if (!Array.isArray(swatches) || swatches.length === 0) {
      return <span>—</span>;
    }
    const visible = swatches.slice(0, maxVisibleCount);
    const overflow = swatches.length - maxVisibleCount;
    return (
      <div className={`flex items-center justify-center ${isMobile ? 'gap-1' : 'gap-1.5'}`}>
        {visible.map((swatch: any, idx: number) =>
          swatch?.src ? (
            <img
              key={idx}
              src={swatch.src}
              alt={swatch.alt ?? ''}
              className={`rounded-full border border-black/50 ${isMobile ? 'h-[18px] w-[18px]' : 'h-[25px] w-[25px]'}`}
            />
          ) : null
        )}
        {overflow > 0 && (
          <span className={`!font-sans font-normal ${isMobile ? 'text-[8px]' : 'text-sm'}`}>
            +{overflow}
          </span>
        )}
      </div>
    );
  };

  // ── Helper: render materials text ──
  const renderMaterials = (materialData: any) => {
    if (!materialData || !Array.isArray(materialData)) {
      return <span>—</span>;
    }
    const lines = materialData
      .filter(Boolean)
      .map((m: any) => {
        if (Array.isArray(m)) {
          return m[1];
        } // [id, text, guid]
        return typeof m === 'string' ? m : '';
      })
      .filter(Boolean);
    return (
      <div className="flex flex-col items-center">
        {lines.map((line: string, idx: number) => (
          <span key={idx}>{line}</span>
        ))}
      </div>
    );
  };

  if (!props.fields) {
    return <></>;
  }

  // ── Extract unique product types from windowsProductTypes data ──
  const co = comparisonObject as any;
  const allProductTypes: string[] = [];
  const productTypeSet = new Set<string>();
  if (co.windowsProductTypes && Array.isArray(co.windowsProductTypes)) {
    co.windowsProductTypes.forEach((seriesTypes: any[]) => {
      if (Array.isArray(seriesTypes)) {
        seriesTypes.forEach((wt: any) => {
          if (wt?.text && !productTypeSet.has(wt.text)) {
            productTypeSet.add(wt.text);
            allProductTypes.push(wt.text);
          }
        });
      }
    });
  }

  // Selected product type name
  const selectedProductTypeName =
    allProductTypes[selectedProductTypeIndex] || allProductTypes[0] || '';

  // Filter series: only show series whose windowsProductTypes includes the selected product type
  const filteredSeriesIndices: number[] = [];
  if (co.windowsProductTypes && Array.isArray(co.windowsProductTypes)) {
    co.windowsProductTypes.forEach((seriesTypes: any[], idx: number) => {
      if (Array.isArray(seriesTypes)) {
        const hasType = seriesTypes.some((wt: any) => wt?.text === selectedProductTypeName);
        if (hasType) {
          filteredSeriesIndices.push(idx);
        }
      }
    });
  }

  // Get the product type name for display
  const currentProductTypeName =
    selectedProductTypeName ||
    (isProductComparison
      ? (originalGroupedProducts?.productStyles?.[selectedProductStyleIndex]?.productTitle ?? '')
      : '');

  // Product type description (from the selected product style)
  const currentProductTypeDescription = isProductComparison
    ? (originalGroupedProducts?.productStyles?.[selectedProductStyleIndex]?.productDescription ??
      '')
    : '';

  // Helper: get image object for a given series index and product type name
  const getImageForSeriesType = (seriesIdx: number, typeName: string) => {
    const seriesTypes = co.windowsProductTypes?.[seriesIdx];
    if (!seriesTypes || !Array.isArray(seriesTypes)) {
      return undefined;
    }
    const match = seriesTypes.find((wt: any) => wt?.text === typeName);
    if (!match) {
      return undefined;
    }
    const img =
      match.productImage ?? match.fields?.productImage?.value ?? match.productImage?.value;
    if (!img) {
      return undefined;
    }
    const src = img.src ?? img.url ?? img.href;
    if (!src) {
      return undefined;
    }
    return {
      src,
      alt: img.alt ?? match.text ?? '',
      width: img.width,
      height: img.height,
    } as any;
  };

  // Helper: get href/link for a given product type name from windowsProductTypes
  const getHrefForProductType = (typeName: string) => {
    if (!co.windowsProductTypes || !Array.isArray(co.windowsProductTypes)) {
      return undefined;
    }
    for (let s = 0; s < co.windowsProductTypes.length; s += 1) {
      const seriesTypes = co.windowsProductTypes[s];
      if (!Array.isArray(seriesTypes)) {
        continue;
      }
      const match = seriesTypes.find((wt: any) => wt?.text === typeName);
      if (match) {
        // common shapes: match.url, match.href, match.fields?.link?.value?.href, match.fields?.productLink?.value?.href
        const href =
          match.href ??
          match.url ??
          match.url?.value?.href ??
          match.fields?.link?.value?.href ??
          match.fields?.productLink?.value?.href ??
          match.fields?.productImage?.value?.href ??
          match.productLink?.href ??
          undefined;
        if (href) {
          return href;
        }
      }
    }
    return undefined;
  };

  // Row labels configuration for the left legend
  const rowLabels = [
    { key: 'price', label: 'Price', heightClass: isMobile ? 'h-[35px]' : 'h-[60px]' },
    { key: 'materials', label: 'Materials', heightClass: isMobile ? 'h-[60px]' : 'h-[95px]' },
    {
      key: 'extColors',
      label: 'Standard Exterior Colors',
      heightClass: isMobile ? 'h-[40px]' : 'h-[60px]',
    },
    {
      key: 'intColors',
      label: 'Standard Interior Colors',
      heightClass: isMobile ? 'h-[60px]' : 'h-[85px]',
    },
    {
      key: 'species',
      label: 'Standard Interior Species',
      heightClass: isMobile ? 'h-[40px]' : 'h-[60px]',
    },
    {
      key: 'finishes',
      label: 'Standard Interior Finishes/Options',
      heightClass: isMobile ? 'h-[40px]' : 'h-[60px]',
    },
  ];

  const visibleCardsCount =
    comparisonObject?.seriesTitles?.filter((_s: any, idx: number) =>
      filteredSeriesIndices.includes(idx)
    ).length ?? 0;

  return (
    <>
      <div className="col-span-12">
        <div className="mx-m ml:-mx-0">
          {isProductComparison && originalGroupedProducts?.productStyles?.length > 1 && (
            <div className="mb-xxs w-full">
              {/* product style modal link*/}
              <div
                onClick={(e) => {
                  e.preventDefault();
                  setIsProductSelectorVisible(true);
                }}
                className="flex cursor-pointer items-center !font-sans text-base font-demi"
              >
                <Text
                  tag="h3"
                  field={{
                    value: (
                      props.fields.tableConfiguration?.fields.changeProductStyleCTAText as Field
                    )?.value as string,
                  }}
                />
                <SvgIcon className="ml-xxs" icon="pencil" />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="col-span-12">
        {/* Product style selector */}
        {originalGroupedProducts?.productStyles?.length > 1 && isProductSelectorVisible && (
          <ModalWrapper
            isModalOpen={
              originalGroupedProducts?.productStyles?.length > 1 && isProductSelectorVisible
            }
            handleClose={() => {
              setIsProductSelectorVisible(false);
            }}
            size={isMobile ? 'extra-large' : 'fluid'}
          >
            <Selector
              productsStylesList={originalGroupedProducts.productStyles}
              selectedProductStyleIndex={selectedProductStyleIndex}
              productStyleIndexSetter={setSelectedProductStyleIndex}
              toggleSelector={setIsProductSelectorVisible}
              tableConfiguration={
                props.fields
                  .tableConfiguration as unknown as Sitecore.Components.Product.ComparisonTable.ComparisonTableConfiguration
              }
              isProductSelector={true}
              isImageVisible={true}
            />
          </ModalWrapper>
        )}
        {/* Series selector */}
        {isSeriesSelectorVisible && comparisonObject && (
          <ModalWrapper
            isModalOpen={comparisonObject && isSeriesSelectorVisible}
            handleClose={() => {
              setIsSeriesSelectorVisible(false);
            }}
            size={isMobile ? 'extra-large' : 'fluid'}
          >
            <Selector
              // @ts-ignore original comparison object may have unexpecte fields
              originalComparisonObject={originalComparisonObject}
              currentSelectedSeries={comparisonObject.seriesTitles ?? []}
              toggleSelector={setIsSeriesSelectorVisible}
              comparisonObjectSetter={setComparisonObject}
              tableConfiguration={
                props.fields
                  .tableConfiguration as unknown as Sitecore.Components.Product.ComparisonTable.ComparisonTableConfiguration
              }
              isImageVisible={isProductComparison}
            />
          </ModalWrapper>
        )}

        {comparisonObject && (
          <div
            id={comparisonTableId}
            ref={comparisonTableRef}
            className="relative shadow-[0px_4px_14px_-3px_rgba(0,0,0,0.06)]"
          >
            {/* ── Product Type Tabs (Card Design) ── */}
            {allProductTypes.length > 0 &&
              (() => {
                const productTypeTitles = allProductTypes.map((pt, idx) => {
                  let foundImage: any = undefined;
                  if (co.windowsProductTypes && Array.isArray(co.windowsProductTypes)) {
                    for (let s = 0; s < co.windowsProductTypes.length; s += 1) {
                      const img = getImageForSeriesType(s, pt);
                      if (img) {
                        foundImage = img;
                        break;
                      }
                    }
                  }
                  return {
                    seriesIndex: idx,
                    url: { value: { href: '#', text: pt } },
                    title: pt,
                    productTypeTitle: pt,
                    image: foundImage,
                  };
                });
                const selectedTitle = productTypeTitles[selectedProductTypeIndex];
                console.log('selected title', selectedTitle);
                return (
                  <ComparisonTitles
                    comparisonTitles={selectedTitle ? [selectedTitle] : []}
                    allSeriesTitles={productTypeTitles}
                    removeSeries={() => {}}
                    totalNumberOfSeries={allProductTypes.length}
                    toggleSeriesSelector={() => {}}
                    onSelectionChange={(indices) => {
                      if (indices.length > 0) {
                        setSelectedProductTypeIndex(indices[0]);
                      }
                    }}
                    isMobile={isMobile}
                    isProductComparison={false}
                    comparisonTableRef={comparisonTableRef}
                    staticHeader={props?.fields?.staticHeader?.value}
                    singleSelect
                  />
                );
              })()}

            {/* ── Comparison Chart (Card-based — Deliverable 15) ── */}
            <div className={`flex ${isMobile ? 'gap-1 p-[10px]' : 'gap-5 py-[15px]'}`}>
              {/* ── Left Legend Panel ── */}
              <div
                className={`shrink-0 bg-white shadow-[10px_0_14px_-20px_rgb(0,0,0)] ${
                  isMobile
                    ? 'min-w-[100px] max-w-[100px] px-2 pt-[13px] pb-[60px]'
                    : 'min-w-[200px] max-w-[310px] px-10 pt-[21px] pb-[120px]'
                }`}
              >
                {/* COMPARE heading area */}
                <div
                  className={`flex w-full shrink-0 flex-col justify-start ${isMobile ? 'gap-1 h-[150px] pb-2' : 'gap-2 h-[216px] pb-4'}`}
                >
                  <span
                    className={`font-bold uppercase tracking-wider text-[#F26924] ${
                      isMobile ? 'text-[10px] leading-tight' : 'text-lg'
                    }`}
                    style={{ fontFamily: 'futura-pt, sans-serif', letterSpacing: '0.9px' }}
                  >
                    COMPARE
                  </span>
                  <span
                    className={`font-bold line-clamp-3 ${
                      isMobile ? 'text-[13px] leading-tight' : 'text-[38px]'
                    }`}
                    style={{ fontFamily: 'futura-pt, sans-serif' }}
                  >
                    {currentProductTypeName}
                  </span>
                  {currentProductTypeDescription && (
                    <span
                      className={`text-[#333] !font-sans ${
                        isMobile ? 'text-[8px] hidden' : 'text-sm'
                      }`}
                    >
                      {currentProductTypeDescription}
                    </span>
                  )}
                </div>

                {/* Row labels */}
                {rowLabels.map((row) => (
                  <div
                    key={row.key}
                    className={`flex flex-col justify-center border-b border-[#CCC] !font-sans font-normal ${row.heightClass}
                      ${isMobile ? 'text-[9px]' : 'text-base'}`}
                  >
                    {row.label}
                  </div>
                ))}
              </div>

              {/* ── Scrollable Product Cards Area with Slider Arrows ── */}
              <div className="relative flex-1 min-w-0">
                {/* Left arrow (desktop only) */}
                {!isMobile && (
                  <button
                    type="button"
                    onClick={() => {
                      const el = scrollableSectionRef.current;
                      if (el) {
                        el.scrollBy({ left: -(isMobile ? 190 : 292), behavior: 'smooth' });
                      }
                    }}
                    className="absolute left-0 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md border border-[#E0E0E0] text-[#000000] hover:bg-[#000000] hover:text-white transition-colors duration-200"
                    aria-label="Scroll left"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                )}

                {/* Right arrow (desktop only) */}
                {!isMobile && (
                  <button
                    type="button"
                    onClick={() => {
                      const el = scrollableSectionRef.current;
                      if (el) {
                        el.scrollBy({ left: isMobile ? 190 : 292, behavior: 'smooth' });
                      }
                    }}
                    className="absolute right-0 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md border border-[#E0E0E0] text-[#000000] hover:bg-[#000000] hover:text-white transition-colors duration-200"
                    aria-label="Scroll right"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 6 15 12 9 18" />
                    </svg>
                  </button>
                )}

                {/* Cards container — no visible scrollbar */}
                <div
                  ref={scrollableSectionRef}
                  className={`flex overflow-x-auto overflow-y-hidden scroll-smooth ${isMobile ? 'gap-2 px-2' : 'gap-3 px-6'}`}
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {comparisonObject.seriesTitles?.map((series, seriesIdx) => {
                    console.log(seriesIdx, series, 'seriesIdx');
                    if (!series) {
                      return null;
                    }
                    // Only show series that offer the selected product type
                    if (!filteredSeriesIndices.includes(seriesIdx)) {
                      return null;
                    }
                    const priceData = co.priceLevel?.[seriesIdx];
                    const materialData = co.materials?.[seriesIdx];
                    const extColors = co.standardExteriorColors?.[seriesIdx];
                    const intColors = co.standardInteriorColors?.[seriesIdx];
                    const speciesData = co.standardInteriorSpecies?.[seriesIdx];
                    const finishesData = co.standardInteriorFinishesOptions?.[seriesIdx];
                    const intColorComment = intColors?.swatchCollectionComments;
                    const exploreUrl = series.url?.value?.href;
                    console.log('seriesdata ', series);
                    // prefer windowsProductTypes image, fallback to series.image
                    const seriesImage =
                      getImageForSeriesType(seriesIdx, selectedProductTypeName) ?? series.image;

                    return (
                      <div
                        key={series.seriesIndex}
                        className={`flex flex-col items-start rounded bg-white border border-[#EAEAEA] shadow-[0px_4px_12px_rgba(0,0,0,0.04)] ${
                          isMobile
                            ? 'min-w-[160px] w-[160px] px-2 py-3'
                            : 'min-w-[280px] w-[280px] px-2.5 py-5'
                        }`}
                      >
                        {/* Product image */}
                        <div
                          className={`flex w-full shrink-0 flex-col justify-start ${isMobile ? 'h-[150px] pb-2' : 'h-[216px] pb-4'}`}
                        >
                          <div
                            className={`flex ${isMobile ? 'h-[90px]' : 'h-[134px]'} w-full items-center justify-center`}
                          >
                            {seriesImage?.src && (
                              <Image
                                src={seriesImage.src}
                                width={
                                  seriesImage?.width ? Number.parseInt(seriesImage.width, 10) : 134
                                }
                                height={
                                  seriesImage?.height
                                    ? Number.parseInt(seriesImage.height, 10)
                                    : 134
                                }
                                alt={(seriesImage?.alt as string) || series.title}
                                unoptimized={isSvgUrl(seriesImage?.src)}
                                className="h-full w-auto object-contain"
                              />
                            )}
                          </div>
                          {/* Series name + info icon */}
                          <div
                            className={`flex items-center justify-center gap-1 text-center !font-sans font-bold ${isMobile ? 'text-xs mt-2' : 'text-base mt-4'}`}
                          >
                            <span className="line-clamp-2">{series.title}</span>
                            <span
                              className={`inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-[#F26924] font-bold text-[#F26924] ${isMobile ? 'h-[14px] w-[14px] text-[8px]' : 'h-[18px] w-[18px] text-[11px]'}`}
                            >
                              i
                            </span>
                          </div>
                          {/* Category label */}
                          <div
                            className={`text-center !font-sans font-normal uppercase ${isMobile ? 'text-[7px] mt-0.5' : 'text-xs mt-1'}`}
                          >
                            {series.productTypeTitle ?? currentProductTypeName ?? 'WINDOW'}
                          </div>
                        </div>

                        {/* Price row */}
                        <div
                          className={`flex w-full shrink-0 flex-col justify-center border-t border-b border-[#CCC] text-center ${isMobile ? 'h-[35px]' : 'h-[60px]'}`}
                        >
                          {renderPrice(priceData)}
                        </div>

                        {/* Materials row */}
                        <div
                          className={`flex w-full shrink-0 flex-col items-center justify-center border-b border-[#CCC] bg-[#FCFAFA] text-center !font-sans font-normal ${
                            isMobile ? 'h-[60px] text-[10px]' : 'h-[95px] text-base'
                          }`}
                        >
                          {renderMaterials(materialData)}
                        </div>

                        {/* Standard Exterior Colors row */}
                        <div
                          className={`flex w-full shrink-0 items-center justify-center gap-1.5 border-b border-[#CCC] ${isMobile ? 'h-[40px]' : 'h-[60px]'}`}
                        >
                          {renderSwatches(extColors)}
                        </div>

                        {/* Standard Interior Colors row */}
                        <div
                          className={`flex w-full shrink-0 flex-col items-center justify-center gap-0.5 border-b border-[#CCC] bg-[#FCFAFA] text-center ${isMobile ? 'h-[60px]' : 'h-[85px]'}`}
                        >
                          <div className="flex items-center justify-center gap-1.5">
                            {renderSwatches(intColors)}
                          </div>
                          {intColorComment && (
                            <span
                              className={`w-full text-center italic font-normal px-1 ${isMobile ? 'text-[8px] leading-[10px]' : 'text-[10px] leading-[12px]'}`}
                            >
                              {intColorComment}
                            </span>
                          )}
                        </div>

                        {/* Standard Interior Species row */}
                        <div
                          className={`flex w-full shrink-0 items-center justify-center gap-1.5 border-b border-[#CCC] ${isMobile ? 'h-[40px]' : 'h-[60px]'}`}
                        >
                          {renderSwatches(speciesData)}
                        </div>

                        {/* Standard Interior Finishes/Options row */}
                        <div
                          className={`flex w-full shrink-0 items-center justify-center gap-1.5 border-b border-[#CCC] bg-[#FCFAFA] ${isMobile ? 'h-[40px]' : 'h-[60px]'}`}
                        >
                          {renderSwatches(finishesData)}
                        </div>

                        {/* Explore CTA */}
                        <div
                          className={`flex w-full flex-col items-center justify-center ${isMobile ? 'mt-1' : 'mt-4'}`}
                        >
                          <a
                            href={exploreUrl}
                            className={`flex w-full items-center justify-center rounded-full bg-white text-center font-semibold text-[#001722] no-underline transition-colors duration-200 hover:bg-[#F26924] hover:text-white ${isMobile ? 'h-7 text-[10px] border-2 border-[#F26924]' : 'h-11 text-base border-4 border-[#F26924]'}`}
                            style={{ fontFamily: 'futura-pt, sans-serif' }}
                          >
                            Explore {series.title}
                          </a>
                        </div>
                      </div>
                    );
                  })}

                  {/* ── Explore All Card ── */}
                  <div
                    className={`flex shrink-0 items-stretch justify-center rounded border border-[#EAEAEA] bg-white text-center shadow-[0px_4px_12px_rgba(0,0,0,0.04)] ${isMobile ? 'min-w-[145px] w-[145px]' : 'min-w-[163px] w-[163px]'}`}
                  >
                    <a
                      href={getHrefForProductType(currentProductTypeName)}
                      className={`flex flex-col items-center justify-center h-full w-full gap-2 px-2 !font-sans font-normal text-black no-underline ${isMobile ? 'text-[10px]' : 'text-sm'}`}
                      style={{ minHeight: isMobile ? 100 : 320 }}
                    >
                      <span className={`text-[#666] ${isMobile ? 'text-[8px]' : 'text-xs'}`}>
                        Explore all
                      </span>
                      <span
                        className={`text-[#666] line-clamp-2 ${isMobile ? 'text-[8px]' : 'text-xs'}`}
                      >
                        {currentProductTypeName} Windows
                      </span>
                      <span
                        className={`inline-flex items-center justify-center rounded-full border border-[#E0E0E0] ${isMobile ? 'h-6 w-6' : 'h-9 w-9'}`}
                      >
                        <SvgIcon icon="arrow-right" size={isMobile ? 'sm' : 'sm'} />
                      </span>
                    </a>
                  </div>
                </div>

                {/* Mobile dots: render directly below the table on mobile; active color black */}
                {isMobile && visibleCardsCount > 0 && (
                  <div className="w-full flex items-center justify-center mt-2">
                    <div className="flex gap-2 bg-white px-2 py-1 rounded-full shadow-sm">
                      {Array.from({ length: visibleCardsCount }).map((_, idx) => (
                        <button
                          key={idx}
                          aria-label={`Go to card ${idx + 1}`}
                          onClick={() => {
                            const el = scrollableSectionRef.current;
                            if (el && el.children[idx]) {
                              const child = el.children[idx] as HTMLElement;
                              el.scrollTo({ left: child.offsetLeft, behavior: 'smooth' });
                              setActiveCardIndex(idx);
                            }
                          }}
                          className={`h-2 w-2 rounded-full transition-colors duration-150 ${
                            activeCardIndex === idx ? 'bg-black' : 'bg-[#E5E7EB]'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {/* end inner scrollable */}
              </div>
              {/* end relative slider wrapper */}
            </div>
          </div>
        )}
      </div>

      {/* Footer links */}
      <div className="col-span-12 pb-5"></div>

      {props.fields.disclaimerText && (
        <div className="col-span-12">
          <div className="flex flex-col gap-1.5 pt-1 !font-sans text-[10px] font-normal leading-[15px] text-black">
            <Disclaimer disclaimerClasses="" fields={props.fields} />
          </div>
        </div>
      )}
    </>
  );
};
