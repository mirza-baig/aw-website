'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from 'classnames';
import Button from 'helpers/Button/Button';
import Disclaimer from 'helpers/DisclaimerText/DisclaimerText';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { ComponentProps } from 'lib/component-props';
import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import { hashCode } from 'lib/utils/string-utils/hash-code';
import { getMediaUrl, MediaUrlType } from 'lib/utils/url-utils/get-media-url';
import { isSvgUrl } from 'lib/utils/url-utils/is-svg-url';
import { useWebsiteContext } from 'lib/website/WebsiteContext';
import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';
import { environment } from 'startup/environment';

import { ComparisonSeriesChartFields, WithinSeriesChartFields } from './ComparisonTable.Types';
import { ProductCell, SwatchOverflowHandler } from './WithinSeriesChart.cells';
import {
  DEFAULT_SELECTED_TEXT,
  DEFAULT_TOGGLE_LABEL,
  SeriesSelectionCard,
  SeriesSelectionRow,
  WindowsDoorsToggle,
} from './WithinSeriesChart.controls';
import {
  BUCKET_KEYS,
  BucketKey,
  buildLegendRows,
  describeProductLinkDestinations,
  getAvailableBuckets,
  getBucketProducts,
  getInteriorColorsComment,
  getProductTitle,
  getSeriesImage,
  getSeriesLabel,
  makeTcText,
  seriesHasProducts,
  slugify,
  TableConfigFields,
} from './WithinSeriesChart.helper';
import {
  buildProductCTAs,
  useCenteredCardIndex,
  useDestinationDiagnostics,
  useDismissOnOutsideClick,
  useGrabScroll,
  useHashSelection,
  useResolvedSwatchCollections,
} from './WithinSeriesChart.hooks';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type ComparisonSeriesTableSitecore =
  Sitecore.Components.Product.ComparisonTable.ComparisonSeriesTable;

export type WithinSeriesChartProps = ComponentProps &
  Omit<ComparisonSeriesTableSitecore, 'fields'> & {
    fields?: NonNullable<ComparisonSeriesTableSitecore['fields']> &
      ComparisonSeriesChartFields &
      WithinSeriesChartFields;
  };

type CTATier = 'primary' | 'secondary' | 'tertiary';

type SwatchPopover = {
  swatches: Array<{ src?: string; alt?: string }>;
  top: number;
  left: number;
};

const ctaTierClasses = (tier: CTATier): string => {
  const base =
    'w-full whitespace-normal rounded-lg border-4 px-m py-[9px] font-sans text-button font-heavy';
  if (tier === 'primary') {
    return `${base} border-theme-btn-border bg-theme-btn-bg text-theme-btn-text hover:border-theme-btn-border-hover hover:bg-theme-btn-bg-hover hover:text-theme-btn-text-hover`;
  }
  if (tier === 'secondary') {
    return `${base} theme-btn-secondary-border border-black bg-theme-btn-secondary-bg text-theme-btn-secondary-text hover:border-theme-btn-secondary-border-hover hover:bg-theme-btn-secondary-bg-hover hover:text-theme-btn-secondary-text-hover`;
  }
  return `${base} border-gray hover:border-black hover:bg-black hover:text-white`;
};

export const WithinSeriesChart = (props: WithinSeriesChartProps) => {
  const { siteInfo } = useWebsiteContext();
  const { currentScreenWidth } = useCurrentScreenType();
  const isMobile = currentScreenWidth <= getBreakpoint('ml');

  const scrollableSectionRef = useRef<HTMLDivElement>(null);
  const swatchPopoverRef = useRef<HTMLDivElement | null>(null);

  const [selectedBucket, setSelectedBucket] = useState<BucketKey>('windows');
  const [selectedSeriesIndex, setSelectedSeriesIndex] = useState(0);
  const [swatchPopover, setSwatchPopover] = useState<SwatchPopover | null>(null);

  const seriesList = ((props.fields as any)?.seriesToCompare ?? []) as any[];

  const resolvedSwatchCollections = useResolvedSwatchCollections(
    seriesList,
    props?.rendering?.dataSource
  );

  const dismissSwatchPopover = useCallback(() => setSwatchPopover(null), []);
  useDismissOnOutsideClick(!!swatchPopover, swatchPopoverRef, dismissSwatchPopover);

  useGrabScroll(scrollableSectionRef);
  const [activeCardIndex, setActiveCardIndex] = useCenteredCardIndex(
    scrollableSectionRef,
    isMobile
  );

  const availableBuckets = getAvailableBuckets(seriesList);
  const activeBucket: BucketKey = availableBuckets.includes(selectedBucket)
    ? selectedBucket
    : (availableBuckets[0] ?? 'windows');

  // A series only appears in the row when it has products in the active half of
  // the catalogue, so toggling to Doors hides windows-only series.
  const visibleSeries = seriesList
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => seriesHasProducts(item, activeBucket));

  // ── URL hash (#100-series-windows) → initial selection ──
  useHashSelection(seriesList, availableBuckets, (bucket, index) => {
    setSelectedBucket(bucket);
    setSelectedSeriesIndex(index);
  });

  const activeEntry =
    visibleSeries.find((entry) => entry.index === selectedSeriesIndex) ?? visibleSeries[0];
  const activeSeries = activeEntry?.item;
  const activeSeriesLabel = activeSeries ? getSeriesLabel(activeSeries, activeBucket) : '';
  const products = activeSeries ? getBucketProducts(activeSeries, activeBucket) : [];

  const tableConfigFields = ((props.fields as any)?.tableConfiguration?.fields ??
    {}) as TableConfigFields;
  const tcText = makeTcText(tableConfigFields);
  const legendRows = buildLegendRows(
    ((props.fields as any)?.tableStructure ?? []) as any[],
    tableConfigFields
  );
  const destinationReport = describeProductLinkDestinations(props.fields);
  const productLinkDestinations = destinationReport.rendered;

  // A card silently missing a button is hard to diagnose from content alone, so
  // the hook logs the three ways a destination disappears: it matched no known
  // destination, it fell past the three-button cap, or the product carries no
  // link for it.
  useDestinationDiagnostics(destinationReport, products, activeSeries, activeSeriesLabel, [
    props?.rendering?.dataSource,
    activeBucket,
    activeSeries?.id,
  ]);

  const writeHash = (series: any, bucket: BucketKey) => {
    const slug = slugify(getSeriesLabel(series, bucket));
    if (slug) {
      globalThis.history?.replaceState(null, '', `#${slug}`);
    }
  };

  const handleSelectSeries = (index: number) => {
    setSelectedSeriesIndex(index);
    setActiveCardIndex(0);
    writeHash(seriesList[index], activeBucket);
  };

  const handleSelectBucket = (bucket: BucketKey) => {
    setSelectedBucket(bucket);
    setActiveCardIndex(0);
    // Keep the current series when it exists in the new bucket, otherwise fall
    // back to the first series that does.
    const keepsSelection = seriesHasProducts(seriesList[selectedSeriesIndex], bucket);
    const nextIndex = keepsSelection
      ? selectedSeriesIndex
      : seriesList.findIndex((item) => seriesHasProducts(item, bucket));
    if (nextIndex !== -1) {
      setSelectedSeriesIndex(nextIndex);
      writeHash(seriesList[nextIndex], bucket);
    }
  };

  const handleSwatchOverflow: SwatchOverflowHandler = (swatches, origin) =>
    setSwatchPopover({ swatches, top: origin.top, left: origin.left });

  const buildCTAs = (productItem: any) =>
    buildProductCTAs(productItem, productLinkDestinations, activeSeries, activeSeriesLabel, tcText);

  if (!props.fields || seriesList.length === 0) {
    return <></>;
  }

  const chartId = `within-series-chart-${
    (props.fields as any)?.sectionId?.value ?? hashCode(props?.rendering?.dataSource ?? '')
  }`;

  const selectionCards: SeriesSelectionCard[] = visibleSeries.map(({ item, index }) => {
    const label = getSeriesLabel(item, activeBucket);
    return {
      index,
      label,
      buttonText: `Compare ${label}`,
      image: getSeriesImage(item, activeBucket),
    };
  });

  // ── Intro panel (defaults to GPDS values, overridden by authored fields) ──
  const chartEyebrow = props.fields.chartEyebrow?.value;
  const chartTitle = props.fields.chartTitle?.value;
  const chartDescription = props.fields.chartDescription?.value;
  const introCta = props.fields.chartCtaLink;
  const hasIntroCta = !!introCta?.value?.href;

  const desktopHeaderHeightClass = hasIntroCta ? 'h-[272px]' : 'h-[216px]';
  const introHeaderHeightClass = isMobile ? 'h-[150px]' : desktopHeaderHeightClass;
  const sectionHeightClass = isMobile ? 'h-[32px]' : 'h-[44px]';
  const rowHeightClass = isMobile ? 'min-h-[120px]' : 'min-h-[100px]';

  const toggleLabel =
    props.fields.windowsDoorsToggleLabel?.value ||
    tcText('windowsDoorsToggleLabel') ||
    DEFAULT_TOGGLE_LABEL;
  const selectedText =
    props.fields.seriesSelectedText?.value || tcText('seriesSelectedText') || DEFAULT_SELECTED_TEXT;
  const showFinalColumn = !!(
    props.fields.seriesDestinationCta?.value ?? (props.fields as any)?.seriesDestinationCta?.value
  );
  const finalColumnLink =
    (props.fields as any)?.exploreAllSeries?.value ?? props.fields.finalColumnCTA?.value;

  return (
    <>
      <div className="col-span-12">
        <div id={chartId} className="relative shadow-[0px_4px_14px_-3px_rgba(0,0,0,0.06)]">
          {seriesList.length > 0 && (
            <WindowsDoorsToggle
              label={toggleLabel}
              buckets={BUCKET_KEYS}
              enabledBuckets={availableBuckets}
              selectedBucket={activeBucket}
              onSelectBucket={handleSelectBucket}
              bucketLabels={{
                windows: props.fields.windowsToggleLabel?.value || undefined,
                doors: props.fields.doorsToggleLabel?.value || undefined,
              }}
              isMobile={isMobile}
            />
          )}

          {selectionCards.length > 0 && (
            <SeriesSelectionRow
              cards={selectionCards}
              selectedIndex={activeEntry?.index ?? -1}
              onSelect={handleSelectSeries}
              selectedText={selectedText}
              isMobile={isMobile}
            />
          )}

          <div className={`flex ${isMobile ? 'gap-1 p-[10px]' : 'gap-5 py-[15px]'}`}>
            {/* ── Left legend panel ── */}
            <div
              className={`shrink-0 bg-white shadow-[10px_0_14px_-20px_rgb(0,0,0)] ${
                isMobile
                  ? 'min-w-[100px] max-w-[100px] px-2 pt-[13px] pb-[60px]'
                  : 'min-w-[200px] max-w-[310px] px-10 pt-[21px] pb-[120px]'
              }`}
            >
              <div
                className={`flex w-full shrink-0 flex-col justify-start ${
                  isMobile ? 'gap-1 pb-2' : 'gap-2 pb-4'
                } ${introHeaderHeightClass}`}
              >
                <h4
                  className={`font-sans! font-bold uppercase tracking-[0.9px] text-[#F26924] ${
                    isMobile ? 'text-[10px] leading-tight' : 'text-lg'
                  }`}
                >
                  {chartEyebrow || 'COMPARE'}
                </h4>
                <h2
                  className={`line-clamp-3 font-sans! font-bold ${
                    isMobile ? 'text-[13px] leading-tight' : 'text-[28px]'
                  }`}
                >
                  {chartTitle || activeSeriesLabel}
                </h2>
                {chartDescription && (
                  <p
                    className={`!font-sans text-[#333] ${isMobile ? 'hidden text-[8px]' : 'text-sm'}`}
                  >
                    {chartDescription}
                  </p>
                )}
                {hasIntroCta && (
                  <Button
                    field={introCta}
                    variant={props.fields.chartCtaStyle}
                    icon={props.fields.chartCtaIcon}
                    classes={
                      isMobile
                        ? 'mt-1 w-full! justify-center whitespace-normal px-2! py-1! border-2! text-[10px]! leading-tight!'
                        : 'mt-2 w-full! justify-center'
                    }
                  />
                )}
              </div>

              {legendRows.map((row) => {
                let textSizeClass: string;
                if (!isMobile) {
                  textSizeClass = 'text-base';
                } else if (row.kind === 'section') {
                  textSizeClass = 'text-[10px]';
                } else {
                  textSizeClass = 'text-[9px]';
                }
                return (
                  <div
                    key={row.key}
                    className={classNames(
                      'flex flex-col justify-center border-b border-[#CCC] p-[20px] font-sans!',
                      row.kind === 'section' ? sectionHeightClass : rowHeightClass,
                      row.kind === 'row' && row.zebra && 'bg-[#FCFAFA]',
                      textSizeClass
                    )}
                  >
                    <span
                      className={row.kind === 'section' ? 'font-bold uppercase tracking-wide' : ''}
                    >
                      {row.label}
                    </span>
                    {row.cta && (
                      <a
                        href={row.cta.href}
                        target={row.cta.target || undefined}
                        rel={row.cta.target === '_blank' ? 'noopener noreferrer' : undefined}
                        className={`mt-0.5 inline-block font-demi text-[#F26924] underline underline-offset-2 hover:no-underline ${
                          isMobile ? 'text-[8px]' : 'text-xs'
                        }`}
                      >
                        {row.cta.text}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── Product cards for the selected series ── */}
            <div className="relative min-w-0 flex-1">
              {!isMobile && products.length > 2 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      scrollableSectionRef.current?.scrollBy({ left: -292, behavior: 'smooth' })
                    }
                    aria-label="Scroll left"
                    className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E0E0E0] bg-white/90 text-[#000000] shadow-md transition-colors duration-200 hover:bg-[#000000] hover:text-white"
                  >
                    <SvgIcon icon="chevron-left" size="sm" className="fill-current" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      scrollableSectionRef.current?.scrollBy({ left: 292, behavior: 'smooth' })
                    }
                    aria-label="Scroll right"
                    className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E0E0E0] bg-white/90 text-[#000000] shadow-md transition-colors duration-200 hover:bg-[#000000] hover:text-white"
                  >
                    <SvgIcon icon="chevron-right" size="sm" className="fill-current" />
                  </button>
                </>
              )}

              <div
                ref={scrollableSectionRef}
                className={`flex cursor-grab overflow-y-hidden overflow-x-auto scroll-smooth ${
                  isMobile ? 'gap-2 px-2' : 'gap-3 px-6'
                }`}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {products.map((productItem: any, productIdx: number) => {
                  const productImage =
                    productItem?.fields?.productImage?.value ??
                    getSeriesImage(activeSeries, activeBucket);

                  return (
                    <div
                      key={productItem?.id ?? `${activeEntry?.index}-${productIdx}`}
                      className={`flex flex-col items-start rounded border border-[#EAEAEA] bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.04)] ${
                        isMobile
                          ? 'w-[160px] min-w-[160px] px-2 py-3'
                          : 'w-[280px] min-w-[280px] px-2.5 py-5'
                      }`}
                    >
                      <div
                        className={`flex w-full shrink-0 flex-col justify-start ${
                          isMobile ? 'pb-2' : 'pb-4'
                        } ${introHeaderHeightClass}`}
                      >
                        <div
                          className={`flex ${
                            isMobile ? 'h-[90px]' : 'h-[134px]'
                          } w-full items-center justify-center`}
                        >
                          {productImage?.src && (
                            <Image
                              src={getMediaUrl(
                                productImage.src,
                                MediaUrlType.Cdn,
                                siteInfo!,
                                environment
                              )}
                              width={
                                productImage.width
                                  ? Number.parseInt(String(productImage.width), 10)
                                  : 134
                              }
                              height={
                                productImage.height
                                  ? Number.parseInt(String(productImage.height), 10)
                                  : 134
                              }
                              alt={(productImage.alt as string) || activeSeriesLabel}
                              unoptimized={isSvgUrl(productImage.src)}
                              className="h-full w-auto object-contain"
                            />
                          )}
                        </div>
                        <div
                          className={`flex items-center justify-center gap-1 text-center font-sans! font-bold ${
                            isMobile ? 'mt-2 text-xs' : 'mt-4 text-base'
                          }`}
                        >
                          <span className="line-clamp-2">
                            {getProductTitle(productItem, activeSeriesLabel)}
                          </span>
                        </div>
                        <div
                          className={`flex items-center justify-center gap-1 text-center font-sans! ${
                            isMobile ? 'mt-2 text-xs' : 'mt-2 text-base'
                          }`}
                        >
                          <span className="line-clamp-2">
                            {productItem?.fields?.productSubtype?.value}
                          </span>
                        </div>
                      </div>

                      {legendRows.map((row) => {
                        if (row.kind === 'section') {
                          return (
                            <div
                              key={row.key}
                              className={`flex w-full shrink-0 items-center justify-center border-b border-[#CCC] ${sectionHeightClass}`}
                            />
                          );
                        }
                        const comment =
                          row.fieldName === 'standardInteriorColors'
                            ? getInteriorColorsComment(productItem, activeSeries)
                            : undefined;
                        return (
                          <div
                            key={row.key}
                            className={classNames(
                              'flex w-full shrink-0 flex-col items-center justify-center gap-0.5 border-b border-[#CCC] text-center',
                              rowHeightClass,
                              row.zebra && 'bg-[#FCFAFA]',
                              isMobile ? 'text-[10px]' : 'text-base'
                            )}
                          >
                            <ProductCell
                              productItem={productItem}
                              seriesItem={activeSeries}
                              fieldName={row.fieldName}
                              isMobile={isMobile}
                              resolvedSwatchCollections={resolvedSwatchCollections}
                              onSwatchOverflow={handleSwatchOverflow}
                            />
                            {comment && (
                              <span
                                className={`w-full px-1 text-center font-normal italic ${
                                  isMobile
                                    ? 'text-[8px] leading-[10px]'
                                    : 'text-[10px] leading-[12px]'
                                }`}
                              >
                                {comment}
                              </span>
                            )}
                          </div>
                        );
                      })}

                      <div
                        className={`flex w-full flex-col items-stretch justify-center gap-2 ${
                          isMobile ? 'mt-1' : 'mt-4'
                        }`}
                      >
                        {buildCTAs(productItem).map((cta) => (
                          <a
                            key={`${cta.label}-${cta.href}`}
                            href={cta.href}
                            className={`flex items-center justify-center text-center no-underline ${ctaTierClasses(
                              cta.tier
                            )}`}
                          >
                            {cta.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {/* ── Final CTA column ── */}
                {showFinalColumn && finalColumnLink?.href && (
                  <div
                    className={`flex shrink-0 items-stretch justify-center rounded border border-[#EAEAEA] bg-white text-center shadow-[0px_4px_12px_rgba(0,0,0,0.04)] ${
                      isMobile ? 'w-[145px] min-w-[145px]' : 'w-[163px] min-w-[163px]'
                    }`}
                  >
                    <a
                      href={finalColumnLink.href}
                      target={finalColumnLink.target || undefined}
                      rel={finalColumnLink.target === '_blank' ? 'noopener noreferrer' : undefined}
                      className={`flex h-full w-full flex-col items-center justify-center gap-2 px-2 !font-sans font-normal text-black no-underline ${
                        isMobile ? 'text-[10px]' : 'text-sm'
                      }`}
                      style={{ minHeight: isMobile ? 100 : 320 }}
                    >
                      <span className={`text-[#666] ${isMobile ? 'text-[8px]' : 'text-xs'}`}>
                        Explore all
                      </span>
                      <span className={`text-[#666] ${isMobile ? 'text-[8px]' : 'text-xs'}`}>
                        Series
                      </span>
                      <span
                        className={`inline-flex items-center justify-center rounded-full border border-[#E0E0E0] ${
                          isMobile ? 'h-6 w-6' : 'h-9 w-9'
                        }`}
                      >
                        <SvgIcon icon="arrow-right" size="sm" />
                      </span>
                    </a>
                  </div>
                )}
              </div>

              {isMobile && products.length > 1 && (
                <div className="mt-2 flex w-full items-center justify-center">
                  <div className="flex gap-2 rounded-full bg-white px-2 py-1 shadow-sm">
                    {products.map((productItem: any, idx: number) => (
                      <button
                        key={productItem?.id ?? idx}
                        type="button"
                        aria-label={`Go to card ${idx + 1}`}
                        onClick={() => {
                          const container = scrollableSectionRef.current;
                          const child = container?.children[idx] as HTMLElement | undefined;
                          if (container && child) {
                            container.scrollTo({ left: child.offsetLeft, behavior: 'smooth' });
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
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-12 pb-5" />

      {props.fields.disclaimerText && (
        <div className="col-span-12">
          <div className="flex flex-col gap-1.5 pt-1 font-sans! text-[10px] font-normal leading-3.75 text-black">
            <Disclaimer disclaimerClasses="" fields={props.fields} />
          </div>
        </div>
      )}

      {swatchPopover && (
        <div
          ref={swatchPopoverRef}
          aria-label="All swatches"
          style={{
            position: 'fixed',
            top: swatchPopover.top,
            left: swatchPopover.left,
            transform: 'translate(-50%, calc(-100% - 6px))',
            maxWidth: 'min(90vw, 520px)',
          }}
          className="z-50 flex flex-wrap items-center justify-center gap-2 bg-white px-4 py-2 shadow-xl ring-1 ring-black/10"
        >
          {swatchPopover.swatches
            .filter((swatch) => swatch?.src)
            .map((swatch, idx) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${swatch.src}-${idx}`}
                src={swatch.src}
                alt={swatch.alt ?? ''}
                className="h-6.25 w-[25px] rounded-full border border-black/50"
              />
            ))}
          <button
            type="button"
            onClick={() => setSwatchPopover(null)}
            aria-label="Close"
            className="ml-1 text-black hover:opacity-60 focus:outline-none"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M1 1 L13 13 M13 1 L1 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  );
};
