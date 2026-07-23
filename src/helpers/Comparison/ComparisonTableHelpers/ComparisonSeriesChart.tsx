'use client';

import { Field, Item, LinkField, Text } from '@sitecore-content-sdk/nextjs';
import Disclaimer from 'helpers/DisclaimerText/DisclaimerText';
import LinkWrapper from 'helpers/LinkWrapper/LinkWrapper';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { ComponentProps } from 'lib/component-props';
import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { getEnum } from 'lib/utils/get-enum';
import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import { normalizeGuid } from 'lib/utils/string-utils/normalize-guid';
import { isSvgUrl } from 'lib/utils/url-utils/is-svg-url';
import Image from 'next/image';
import { useRef } from 'react';

import { renderComparisonCellValue } from './CategoryRow';
import { getComparisonObject } from './ComparisonTable.helper';
import { ComparisonSeriesChartFields } from './ComparisonTable.Types';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type ComparisonSeriesTableSitecore =
  Sitecore.Components.Product.ComparisonTable.ComparisonSeriesTable;

export type ComparisonSeriesChartProps = ComponentProps &
  Omit<ComparisonSeriesTableSitecore, 'fields'> & {
    fields?: NonNullable<ComparisonSeriesTableSitecore['fields']> & ComparisonSeriesChartFields;
  };

type LegendRow =
  | { kind: 'section'; key: string; label?: string; cta?: LinkField['value'] }
  | { kind: 'row'; key: string; label?: string; fieldName: string; cta?: LinkField['value'] };

type TableConfigFields = Record<string, { value?: unknown } | undefined>;

const SECTION_TPL_ID = normalizeGuid(
  SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Elements.Product
    .ComparisonSection.Id
);
const SUBSECTION_TPL_ID = normalizeGuid(
  SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Elements.Product
    .ComparisonSubsection.Id
);

/**
 * Falls back to a guessed tableConfiguration field when a ComparisonSubsection
 * item has no titleFieldName authored — same convention ProductCompareChart
 * uses (findTcKeyForValue): try "<valueKey>SectionTitle" first, then fuzzy-match
 * valueKey against every tableConfiguration field name.
 */
const findTableConfigKeyForValue = (
  valueKey: string,
  tableConfigFields: TableConfigFields
): string | undefined => {
  const sectionTitleKey = `${valueKey}SectionTitle`;
  if ((tableConfigFields[sectionTitleKey] as Field<string> | undefined)?.value) {
    return sectionTitleKey;
  }
  const lowerVk = valueKey.toLowerCase();
  return Object.keys(tableConfigFields).find((k) => {
    const lk = k.toLowerCase();
    if (lk === lowerVk) {
      return false;
    }
    return (
      lk.endsWith(lowerVk) || lk.replace('options', '').endsWith(lowerVk) || lk.startsWith(lowerVk)
    );
  });
};

/** Same convention ProductCompareChart's `tcLink` uses: only a real link if both href and text are set. */
const resolveTableConfigLink = (
  key: string | undefined,
  tableConfigFields: TableConfigFields
): LinkField['value'] | undefined => {
  if (!key) {
    return undefined;
  }
  const value = (tableConfigFields[key] as LinkField | undefined)?.value;
  if (!value?.href || !value?.text) {
    return undefined;
  }
  return value;
};

const buildSectionRow = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: Record<string, any> | undefined,
  el: Item,
  idx: number,
  tableConfigFields: TableConfigFields
): LegendRow => {
  const titleKey = getEnum<string>(fields?.titleFieldName);
  const ctaKey = getEnum<string>(fields?.ctaFieldName);
  const titleKeyExists = !!titleKey && titleKey in tableConfigFields;
  const label = titleKey
    ? (tableConfigFields[titleKey] as Field<string> | undefined)?.value
    : undefined;

  if (titleKey && !titleKeyExists) {
    console.warn(
      `[ComparisonSeriesChart:buildLegendRows] titleFieldName "${titleKey}" on section "${el?.displayName ?? el?.name}" ` +
        'does not match any field on tableConfiguration — label will render blank.'
    );
  }

  return {
    kind: 'section',
    key: `sec-${idx}`,
    label,
    cta: ctaKey ? (tableConfigFields[ctaKey] as LinkField | undefined)?.value : undefined,
  };
};

/**
 * Same fallback chain as ProductCompareChart's rowCta: <titleKey>CTA, then
 * <labelKey>CTA, then <labelKey minus "SectionTitle">SectionCTA, then <valueKey>SectionCTA.
 */
const resolveRowCta = (
  titleKey: string | undefined,
  labelKey: string | undefined,
  valueKey: string,
  tableConfigFields: TableConfigFields
): LinkField['value'] | undefined => {
  return (
    resolveTableConfigLink(titleKey ? `${titleKey}CTA` : undefined, tableConfigFields) ??
    resolveTableConfigLink(labelKey ? `${labelKey}CTA` : undefined, tableConfigFields) ??
    resolveTableConfigLink(
      labelKey?.endsWith('SectionTitle')
        ? `${labelKey.slice(0, -'SectionTitle'.length)}SectionCTA`
        : undefined,
      tableConfigFields
    ) ??
    resolveTableConfigLink(`${valueKey}SectionCTA`, tableConfigFields)
  );
};

const buildSubsectionRow = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: Record<string, any> | undefined,
  el: Item,
  idx: number,
  tableConfigFields: TableConfigFields
): LegendRow | undefined => {
  const titleKey = getEnum<string>(fields?.titleFieldName);
  const valueKey = getEnum<string>(fields?.valueFieldName);
  if (!valueKey) {
    console.warn('[ComparisonSeriesChart:buildLegendRows] row skipped: no valueFieldName', {
      idx,
      itemName: el?.displayName ?? el?.name,
      itemId: el?.id,
      valueFieldNameRaw: fields?.valueFieldName,
    });
    return undefined;
  }
  const titleKeyExists = !!titleKey && titleKey in tableConfigFields;
  const labelKey = titleKeyExists
    ? titleKey
    : findTableConfigKeyForValue(valueKey, tableConfigFields);
  const label = labelKey
    ? (tableConfigFields[labelKey] as Field<string> | undefined)?.value
    : undefined;

  if (titleKey && !titleKeyExists) {
    console.warn(
      `[ComparisonSeriesChart:buildLegendRows] titleFieldName "${titleKey}" on row "${el?.displayName ?? el?.name}" ` +
        'does not match any field on tableConfiguration — falling back to fuzzy match.'
    );
  }
  if (!label) {
    console.warn(
      `[ComparisonSeriesChart:buildLegendRows] row "${el?.displayName ?? el?.name}" (valueFieldName "${valueKey}") ` +
        'could not resolve a label from titleFieldName, the "<valueKey>SectionTitle" convention, or a fuzzy ' +
        'match against tableConfiguration fields — label will render blank.'
    );
  }

  return {
    kind: 'row',
    key: `row-${idx}`,
    label,
    fieldName: valueKey,
    cta: resolveRowCta(titleKey, labelKey, valueKey, tableConfigFields),
  };
};

const buildLegendRows = (
  tableStructure: Item[] | undefined,
  tableConfigFields: TableConfigFields
): LegendRow[] => {
  const rows: LegendRow[] = [];

  (tableStructure ?? []).forEach((el, idx) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fields = el?.fields as Record<string, any> | undefined;
    const tplId = normalizeGuid((fields?._AW_TemplateId as Field<string> | undefined)?.value ?? '');

    if (tplId === SECTION_TPL_ID) {
      rows.push(buildSectionRow(fields, el, idx, tableConfigFields));
    } else if (tplId === SUBSECTION_TPL_ID) {
      const row = buildSubsectionRow(fields, el, idx, tableConfigFields);
      if (row) {
        rows.push(row);
      }
    }
  });

  return rows;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const entryCount = (value: any): number => (Array.isArray(value) ? Math.max(value.length, 1) : 1);

/**
 * Fixed (not min-) pixel height per legend row, shared by the legend label and
 * every card's cell for that row so they always line up — same technique
 * ProductCompareChart uses (SECTION_HEIGHT/ROW_HEIGHT constants), except sized
 * per-row from the row's actual tallest value instead of one constant for
 * every row. Cells clip (`overflow-hidden`) rather than grow, so one card's
 * content can never push its own later rows out of alignment with the rest.
 */
const computeRowHeights = (
  legendRows: LegendRow[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  comparisonObject: any,
  seriesCount: number,
  isMobile: boolean
): number[] => {
  const lineHeight = isMobile ? 24 : 30;
  const basePadding = isMobile ? 32 : 70;
  const baseMinHeight = isMobile ? 130 : 64;

  return legendRows.map((row) => {
    if (row.kind === 'section') {
      return isMobile ? 32 : 44;
    }
    let maxEntries = 1;
    for (let seriesIdx = 0; seriesIdx < seriesCount; seriesIdx += 1) {
      const value = comparisonObject?.[row.fieldName]?.[seriesIdx];
      maxEntries = Math.max(maxEntries, entryCount(value));
    }
    return Math.max(baseMinHeight, basePadding + maxEntries * lineHeight);
  });
};

/**
 * Redesigned series compare chart: left legend column + one bordered card per
 * series, matching the ProductCompareChart visual pattern (independent
 * flex-column cards, fixed per-row heights) but without its product-type
 * filter step (this chart always shows every series in `seriesToCompare`).
 * Only rendered when `enableRedesignedLayout` is checked on the datasource —
 * see ComparisonTable.tsx for the gate. Existing datasources are unaffected.
 */
export const ComparisonSeriesChart = (props: ComparisonSeriesChartProps) => {
  const { currentScreenWidth } = useCurrentScreenType();
  const isMobile = currentScreenWidth <= getBreakpoint('ml');
  const scrollableSectionRef = useRef<HTMLDivElement>(null);

  if (!props.fields) {
    return <></>;
  }

  const comparisonObject = getComparisonObject(props.fields, false);
  const seriesToCompare = props.fields.seriesToCompare ?? [];
  const tableConfigFields = (props.fields.tableConfiguration?.fields ?? {}) as TableConfigFields;
  const legendRows = buildLegendRows(props.fields.tableStructure, tableConfigFields);

  if (!comparisonObject) {
    return <></>;
  }

  const rowHeights = computeRowHeights(
    legendRows,
    comparisonObject,
    seriesToCompare.length,
    isMobile
  );

  // Card width + gap, used so the scroll buttons advance by exactly one card.
  const SCROLL_AMOUNT = isMobile ? 168 : 292;
  const handleScrollLeft = () => {
    scrollableSectionRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
  };
  const handleScrollRight = () => {
    scrollableSectionRef.current?.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
  };

  return (
    <>
      <div className="col-span-12">
        <div className="relative">
          <div className={`flex ${isMobile ? 'gap-1 p-[10px]' : 'gap-5 py-[15px]'}`}>
            {/* ── Left legend panel ── */}
            <div
              className={`shrink-0 bg-white shadow-[10px_0_14px_-20px_rgb(0,0,0)] ${
                isMobile
                  ? 'min-w-[100px] max-w-[100px] px-2 pt-[13px] pb-[60px]'
                  : 'min-w-[200px] max-w-[310px] px-10 pt-[4px] pb-[93px]'
              }`}
            >
              <div
                className={`flex w-full shrink-0 flex-col justify-start ${isMobile ? 'gap-1 h-[130px] pb-2' : 'gap-1.5 h-[192px] pb-3'}`}
              >
                {(() => {
                  const chartEyebrow = props.fields?.chartEyebrow;
                  const chartTitle = props.fields?.chartTitle;
                  const chartDescription = props.fields?.chartDescription;
                  return (
                    <>
                      {chartEyebrow?.value && (
                        <span
                          className={`font-bold uppercase tracking-wider text-[#F26924] ${isMobile ? 'text-[11px] leading-tight' : 'text-lg'}`}
                          style={{ fontFamily: 'futura-pt, sans-serif', letterSpacing: '0.9px' }}
                        >
                          <Text field={chartEyebrow} />
                        </span>
                      )}
                      {chartTitle?.value && (
                        <span
                          className={`font-bold line-clamp-3 ${
                            isMobile ? 'text-[13px] leading-tight' : 'text-[28px]'
                          }`}
                          style={{ fontFamily: 'futura-pt, sans-serif' }}
                        >
                          <Text field={chartTitle} />
                        </span>
                      )}
                      {chartDescription?.value && (
                        <span
                          className={`text-[#555] !font-sans leading-snug ${isMobile ? 'text-[11px]' : 'text-sm'}`}
                        >
                          <Text field={chartDescription} />
                        </span>
                      )}
                    </>
                  );
                })()}
              </div>

              {legendRows.map((row, rowIdx) => (
                <div
                  key={row.key}
                  style={{ height: rowHeights[rowIdx] }}
                  className={`flex flex-col justify-center overflow-hidden border-b border-[#CCC] font-sans! py-3 ${isMobile ? 'text-[11px]' : 'text-sm'}`}
                >
                  <span
                    className={row.kind === 'section' ? 'font-bold uppercase tracking-wide' : ''}
                  >
                    {row.label}
                  </span>
                  {row.cta?.href && (
                    <LinkWrapper
                      field={row.cta}
                      ariaLabel={{ value: row.label ?? '' }}
                      className={`mt-0.5 inline-block font-demi text-[#F26924] underline underline-offset-2 hover:no-underline ${isMobile ? 'text-[8px]' : ''}`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* ── Series cards ── */}
            <div className="relative flex-1 min-w-0">
              {!isMobile && (
                <button
                  type="button"
                  onClick={handleScrollLeft}
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

              {!isMobile && (
                <button
                  type="button"
                  onClick={handleScrollRight}
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

              <div
                ref={scrollableSectionRef}
                className={`flex overflow-x-auto overflow-y-hidden scroll-smooth ${isMobile ? 'gap-2 px-2' : 'gap-3 px-6'}`}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {seriesToCompare.map((series: Item, seriesIdx: number) => {
                  const title = comparisonObject.seriesTitles?.[seriesIdx];
                  const image = title?.image;

                  return (
                    <div
                      key={series.id ?? seriesIdx}
                      className={`flex flex-col items-start rounded bg-white border border-[#EAEAEA] shadow-[0px_4px_12px_rgba(0,0,0,0.04)] ${
                        isMobile
                          ? 'min-w-[160px] w-[160px] px-2 py-3'
                          : 'min-w-[280px] w-[280px] px-2.5 py-5'
                      }`}
                    >
                      <div
                        className={`flex w-full shrink-0 flex-col justify-start ${isMobile ? 'gap-1 h-[130px] pb-2' : 'gap-1.5 h-[175px] pb-3'}`}
                      >
                        <div
                          className={`flex ${isMobile ? 'h-[92px]' : 'h-[140px]'} w-full items-center justify-center`}
                        >
                          {image?.src && (
                            <Image
                              src={image.src}
                              width={image.width ? Number.parseInt(String(image.width), 10) : 100}
                              height={
                                image.height ? Number.parseInt(String(image.height), 10) : 100
                              }
                              alt={(image.alt as string | undefined) || title?.title || ''}
                              unoptimized={isSvgUrl(image.src)}
                              className="h-full w-auto object-contain"
                            />
                          )}
                        </div>
                        <div
                          className={`text-center font-sans! font-bold ${isMobile ? 'text-sm' : 'text-base'}`}
                        >
                          <span className="line-clamp-2">{title?.title}</span>
                        </div>
                      </div>

                      {legendRows.map((row, rowIdx) => (
                        <div
                          key={row.key}
                          style={{ height: rowHeights[rowIdx] }}
                          className={`flex w-full shrink-0 flex-col items-center justify-center gap-0.5 overflow-hidden border-b border-[#CCC] py-3 text-center ${isMobile ? 'text-[11px]' : 'text-sm'}`}
                        >
                          {row.kind === 'row' &&
                            renderComparisonCellValue(
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              (comparisonObject as any)[row.fieldName]?.[seriesIdx]
                            )}
                        </div>
                      ))}

                      {props.fields?.seriesDestinationCta?.value && title?.url?.value?.href && (
                        <div
                          className={`flex w-full items-stretch justify-center ${isMobile ? 'mt-1' : 'mt-3'}`}
                        >
                          <LinkWrapper
                            field={title.url}
                            ariaLabel={{ value: title.title ?? '' }}
                            className="flex w-full items-center justify-center gap-1 whitespace-normal rounded-lg border-4 border-theme-btn-border bg-theme-btn-bg px-m py-[9px] text-center font-sans text-button font-heavy text-theme-btn-text no-underline hover:border-theme-btn-border-hover hover:bg-theme-btn-bg-hover hover:text-theme-btn-text-hover"
                          >
                            <SvgIcon icon="arrow" className="ml-xxxs" />
                          </LinkWrapper>
                        </div>
                      )}
                    </div>
                  );
                })}
                {/* ── Final column CTA ── */}
                {props.fields?.exploreAllSeries?.value?.href && (
                  <div
                    className={`flex shrink-0 items-stretch justify-center rounded border border-[#EAEAEA] bg-white text-center shadow-[0px_4px_12px_rgba(0,0,0,0.04)] ${isMobile ? 'min-w-[145px] w-[145px]' : 'min-w-[163px] w-[163px]'}`}
                  >
                    <LinkWrapper
                      field={props.fields.exploreAllSeries}
                      ariaLabel={{ value: 'Explore all series' }}
                      className={`flex flex-col items-center justify-center gap-2 px-2 !font-sans text-[#666] line-clamp-2  ${isMobile ? 'text-[10px]' : 'text-md'}`}
                    >
                      <span
                        className={`inline-flex items-center justify-center rounded-full border border-[#E0E0E0] ${isMobile ? 'h-6 w-6' : 'h-9 w-9'}`}
                      >
                        <SvgIcon icon="arrow-right" size="sm" />
                      </span>{' '}
                    </LinkWrapper>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-12 pb-5" />

      {props.fields.disclaimerText && (
        <div className="col-span-12">
          <Disclaimer disclaimerClasses="" fields={props.fields} />
        </div>
      )}
    </>
  );
};
