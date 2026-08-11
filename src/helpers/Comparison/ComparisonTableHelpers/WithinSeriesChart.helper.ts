/***
 * Data helpers for the "within series" compare chart (WithinSeriesChart.tsx).
 *
 * That chart answers "what products make up this series?", so — unlike the
 * side-by-side series chart — its columns are product items pulled from the
 * selected series' `windowsProductTypes` / `doorsProductTypes` collections.
 * Everything here is pure so the chart component stays presentational.
 *
 * Disabling no-explicit-any for the whole file: series/product items arrive as
 * loosely-typed layout-service payloads whose shape varies per template, the
 * same way the sibling comparison helpers treat them.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Field } from '@sitecore-content-sdk/nextjs';
import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { getEnum } from 'lib/utils/get-enum';
import { normalizeGuid } from 'lib/utils/string-utils/normalize-guid';

/** The two product collections authored on every AW_Series item. */
export enum ProductBucket {
  Windows = 'windowsProductTypes',
  Doors = 'doorsProductTypes',
}

/** Which half of a series the chart is currently showing. */
export type BucketKey = 'windows' | 'doors';

export const BUCKET_KEYS: BucketKey[] = ['windows', 'doors'];

const BUCKET_FIELD: Record<BucketKey, ProductBucket> = {
  windows: ProductBucket.Windows,
  doors: ProductBucket.Doors,
};

/** Noun appended to a series title when the author has not spelled it out. */
const BUCKET_NOUN: Record<BucketKey, string> = { windows: 'Windows', doors: 'Doors' };

/** Matches an existing noun so "200 Series Windows" never becomes "… Windows Windows". */
const BUCKET_NOUN_RE: Record<BucketKey, RegExp> = { windows: /windows?\b/i, doors: /doors?\b/i };

/**
 * Series image is authored per half of the catalogue ("Windows Series" /
 * "Doors Series" image fields), falling back to the shared series image so the
 * chart still renders before those fields are populated.
 */
const SERIES_IMAGE_FIELDS: Record<BucketKey, string[]> = {
  windows: ['windowsSeriesImage', 'windowSeriesImage', 'seriesImage', 'productImage'],
  doors: ['doorsSeriesImage', 'doorSeriesImage', 'seriesImage', 'productImage'],
};

export type TcLink = { text: string; href: string; target?: string };

export type TableConfigFields = Record<string, any>;

export type WithinSeriesLegendRow =
  | { kind: 'section'; key: string; label: string; cta?: TcLink }
  | { kind: 'row'; key: string; label: string; fieldName: string; zebra: boolean; cta?: TcLink };

export type ProductLinkDestinationKey =
  | 'productDetailPage'
  | 'designTool'
  | 'seriesLanding'
  | 'requestAQuote';

/** Authors may pick more, but only the first three get a button treatment. */
export const MAX_PRODUCT_LINK_DESTINATIONS = 3;

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// ── Series → products ──────────────────────────────────────────────────────

export const getBucketProducts = (seriesItem: any, bucket: BucketKey): any[] =>
  ((seriesItem?.fields?.[BUCKET_FIELD[bucket]] as any[] | undefined) ?? []).filter(Boolean);

export const seriesHasProducts = (seriesItem: any, bucket: BucketKey): boolean =>
  getBucketProducts(seriesItem, bucket).length > 0;

/**
 * Buckets worth offering in the Windows/Doors switcher: a half of the catalogue
 * only appears once at least one authored series actually has products in it,
 * so a windows-only chart doesn't show a dead "Doors" tab.
 */
export const getAvailableBuckets = (seriesList: any[]): BucketKey[] =>
  BUCKET_KEYS.filter((bucket) => seriesList.some((series) => seriesHasProducts(series, bucket)));

export const getSeriesTitleText = (seriesItem: any): string =>
  (seriesItem?.fields?.seriesTitle as Field<string> | undefined)?.value ||
  seriesItem?.displayName ||
  seriesItem?.name ||
  '';

/** "100 Series" + windows → "100 Series Windows" (the chart's default title). */
export const getSeriesLabel = (seriesItem: any, bucket: BucketKey): string => {
  const title = getSeriesTitleText(seriesItem).trim();
  if (!title) {
    return BUCKET_NOUN[bucket];
  }
  return BUCKET_NOUN_RE[bucket].test(title) ? title : `${title} ${BUCKET_NOUN[bucket]}`;
};

export const getSeriesImage = (seriesItem: any, bucket: BucketKey): any => {
  for (const fieldName of SERIES_IMAGE_FIELDS[bucket]) {
    const value = seriesItem?.fields?.[fieldName]?.value;
    if (value?.src) {
      return value;
    }
  }
  return undefined;
};

export const getProductTitle = (productItem: any, fallback: string): string =>
  productItem?.fields?.expandedSeriesName?.value ||
  productItem?.fields?.productFullName?.value ||
  productItem?.fields?.productName?.value ||
  fallback;

// ── Table configuration lookups ────────────────────────────────────────────

/**
 * Resolves an enum/droplink/plain-string field down to the tableConfiguration
 * field name it points at.
 */
export const resolveKey = (field: any): string | undefined => {
  if (!field) {
    return undefined;
  }
  return (
    getEnum<string>(field) ??
    (typeof field === 'string' ? field : undefined) ??
    (typeof field?.value === 'string' ? field.value : undefined) ??
    (typeof field?.fields?.Phrase?.value === 'string' ? field.fields.Phrase.value : undefined)
  );
};

export const makeTcText =
  (tc: TableConfigFields) =>
  (key: string | undefined): string => {
    if (!key) {
      return '';
    }
    const raw = (tc?.[key]?.value as string | undefined) ?? '';
    return raw.replace(/\s*:\s*$/u, '').trim();
  };

/** Only a real link when both href and text are authored — same rule as the sibling charts. */
export const makeTcLink =
  (tc: TableConfigFields) =>
  (key: string | undefined): TcLink | undefined => {
    if (!key) {
      return undefined;
    }
    const value = tc?.[key]?.value as TcLink | undefined;
    if (!value?.href || !value?.text) {
      return undefined;
    }
    return { text: value.text, href: value.href, target: value.target };
  };

// ── Legend rows ────────────────────────────────────────────────────────────

const SECTION_TPL_ID = normalizeGuid(
  SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Elements.Product
    .ComparisonSection.Id
);
const SUBSECTION_TPL_ID = normalizeGuid(
  SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Elements.Product
    .ComparisonSubsection.Id
);

/** Used when a datasource has no tableStructure authored yet. */
const FALLBACK_ROWS: Array<{ labelKey: string; fieldName: string }> = [
  { labelKey: 'materials', fieldName: 'productMaterials' },
  { labelKey: 'standardExteriorColors', fieldName: 'featuredExteriorColors' },
  { labelKey: 'standardInteriorColors', fieldName: 'featuredInteriorColors' },
  { labelKey: 'interiorWoodSpecies', fieldName: 'interiorWoodSpecies' },
  { labelKey: 'interiorWoodStainFinishes', fieldName: 'featuredInteriorFinishesOptions' },
  { labelKey: 'productOptionsPriceLevel', fieldName: 'priceLevel' },
];

/**
 * Falls back to a guessed tableConfiguration field when a subsection has no
 * titleFieldName authored: try "<valueKey>SectionTitle" first, then fuzzy-match
 * the value key against every tableConfiguration field name.
 */
const findTcKeyForValue = (
  valueKey: string,
  tc: TableConfigFields,
  tcText: (key?: string) => string
): string | undefined => {
  const sectionTitleKey = `${valueKey}SectionTitle`;
  if (tcText(sectionTitleKey)) {
    return sectionTitleKey;
  }
  const lowerValueKey = valueKey.toLowerCase();
  return Object.keys(tc).find((key) => {
    const lowerKey = key.toLowerCase();
    if (lowerKey === lowerValueKey) {
      return false;
    }
    return (
      lowerKey.endsWith(lowerValueKey) ||
      lowerKey.replace('options', '').endsWith(lowerValueKey) ||
      lowerKey.startsWith(lowerValueKey)
    );
  });
};

const buildSubsectionRow = (
  element: any,
  idx: number,
  zebra: boolean,
  tc: TableConfigFields,
  tcText: (key?: string) => string,
  tcLink: (key?: string) => TcLink | undefined
): WithinSeriesLegendRow | undefined => {
  const titleKey = resolveKey(element?.fields?.titleFieldName);
  const valueKey = resolveKey(element?.fields?.valueFieldName);
  if (!valueKey) {
    return undefined;
  }
  const labelKey = titleKey ?? findTcKeyForValue(valueKey, tc, tcText);

  return {
    kind: 'row',
    key: `row-${idx}-${valueKey}`,
    label: tcText(labelKey),
    fieldName: valueKey,
    zebra,
    cta:
      tcLink(titleKey ? `${titleKey}CTA` : undefined) ??
      tcLink(labelKey ? `${labelKey}CTA` : undefined) ??
      tcLink(
        labelKey?.endsWith('SectionTitle')
          ? `${labelKey.slice(0, -'SectionTitle'.length)}SectionCTA`
          : undefined
      ) ??
      tcLink(`${valueKey}SectionCTA`),
  };
};

/**
 * Turns the authored tableStructure into the chart's left-hand legend: section
 * headings (title + optional section CTA) interleaved with value rows, each row
 * alternating the zebra background within its section.
 */
export const buildLegendRows = (
  tableStructure: any[],
  tc: TableConfigFields
): WithinSeriesLegendRow[] => {
  const tcText = makeTcText(tc);
  const tcLink = makeTcLink(tc);
  const rows: WithinSeriesLegendRow[] = [];
  let zebra = false;

  tableStructure.forEach((element: any, idx: number) => {
    const tplId = normalizeGuid(element?.fields?._AW_TemplateId?.value ?? '');

    if (tplId === SECTION_TPL_ID) {
      const titleKey = resolveKey(element?.fields?.titleFieldName);
      rows.push({
        kind: 'section',
        key: `sec-${idx}-${titleKey ?? ''}`,
        label: tcText(titleKey),
        cta: tcLink(resolveKey(element?.fields?.ctaFieldName)),
      });
      zebra = false;
      return;
    }

    if (tplId === SUBSECTION_TPL_ID) {
      const row = buildSubsectionRow(element, idx, zebra, tc, tcText, tcLink);
      if (row) {
        rows.push(row);
        zebra = !zebra;
      }
    }
  });

  if (!rows.some((row) => row.kind === 'row')) {
    let fallbackZebra = false;
    FALLBACK_ROWS.forEach((row, idx) => {
      rows.push({
        kind: 'row',
        key: `fallback-${idx}-${row.fieldName}`,
        label: tcText(row.labelKey),
        fieldName: row.fieldName,
        zebra: fallbackZebra,
        cta: tcLink(`${row.labelKey}CTA`),
      });
      fallbackZebra = !fallbackZebra;
    });
  }

  return rows;
};

// ── Cell values ────────────────────────────────────────────────────────────

/** tableStructure valueFieldName → the Sitecore field name(s) that actually hold the data. */
const FIELD_ALIASES: Record<string, string[]> = {
  materials: ['materials', 'productMaterials'],
  productMaterials: ['productMaterials', 'materials'],
  standardExteriorColors: ['standardExteriorColors', 'featuredExteriorColors', 'exteriorColors'],
  standardInteriorColors: ['standardInteriorColors', 'featuredInteriorColors', 'interiorColors'],
  standardInteriorSpecies: ['standardInteriorSpecies', 'interiorWoodSpecies', 'woodSpecies'],
  featuredExteriorColors: ['featuredExteriorColors', 'standardExteriorColors', 'exteriorColors'],
  featuredInteriorColors: ['featuredInteriorColors', 'standardInteriorColors', 'interiorColors'],
  interiorWoodSpecies: ['interiorWoodSpecies', 'standardInteriorSpecies', 'woodSpecies'],
  hardwareFinishes: ['hardwareFinishes', 'featuredHardwareFinishes'],
  hardwareStyles: ['hardwareStyles', 'featuredHardwareStyles'],
};

export const isEmptyValue = (value: any): boolean => {
  if (value === undefined || value === null) {
    return true;
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  if (typeof value === 'object') {
    if ('value' in value) {
      return value.value === undefined || value.value === null || value.value === '';
    }
    if ('swatches' in value) {
      return !Array.isArray(value.swatches) || value.swatches.length === 0;
    }
    const innerSwatches = value.fields?.swatches;
    if (innerSwatches !== undefined && !Array.isArray(innerSwatches)) {
      return true;
    }
    return Object.keys(value).length === 0;
  }
  if (typeof value === 'string') {
    return value.trim() === '';
  }
  return false;
};

/**
 * A swatch collection reference the layout service returned unresolved (single
 * hop limit) — the chart re-fetches those over GraphQL and swaps them in here.
 */
const isUnresolvedSwatchCollection = (value: any): boolean =>
  !!value &&
  typeof value === 'object' &&
  typeof value.id === 'string' &&
  value?.fields?.swatches !== undefined &&
  !Array.isArray(value.fields.swatches);

export const collectSwatchCollectionIds = (seriesList: any[]): string[] => {
  const ids = new Set<string>();

  const collectFromItem = (item: any) => {
    const fields = item?.fields;
    if (!fields || typeof fields !== 'object') {
      return;
    }
    for (const key of Object.keys(fields)) {
      if (isUnresolvedSwatchCollection(fields[key])) {
        ids.add(fields[key].id);
      }
    }
  };

  for (const series of seriesList) {
    for (const bucket of BUCKET_KEYS) {
      getBucketProducts(series, bucket).forEach(collectFromItem);
    }
    collectFromItem(series);
  }

  return Array.from(ids);
};

/**
 * First non-empty value for `fieldName` across the given sources (product
 * first, then its series), resolving swatch collections when we have them.
 */
export const pickRaw = (
  fieldName: string,
  sources: any[],
  resolvedSwatchCollections: Record<string, any>
): any => {
  const aliases = FIELD_ALIASES[fieldName] ?? [fieldName];
  for (const source of sources) {
    const fields = source?.fields ?? {};
    for (const alias of aliases) {
      const value = fields[alias];
      if (isUnresolvedSwatchCollection(value) && resolvedSwatchCollections[value.id]) {
        return resolvedSwatchCollections[value.id];
      }
      if (!isEmptyValue(value)) {
        return value;
      }
    }
  }
  return undefined;
};

export const getInteriorColorsComment = (productItem: any, seriesItem: any): string | undefined => {
  const tryFrom = (item: any) => {
    const collection = item?.fields?.standardInteriorColors?.fields;
    return (
      collection?.swatchCollectionDescription?.value ??
      collection?.swatchCollectionComments?.value ??
      undefined
    );
  };
  return tryFrom(productItem) ?? tryFrom(seriesItem);
};

// ── Product link destinations ──────────────────────────────────────────────

/**
 * Maps whatever the author's destination item resolves to — enum value, item
 * name, or display text ("Design Tool", "designToolLink", "Design this
 * product") — onto one of the four destinations. Matching is by substring
 * rather than equality because the Sitecore items spell these several ways, and
 * an unrecognised entry silently costs the card a button.
 *
 * Order matters: design/series/quote are checked before the catch-all
 * "product", so "Design this product" lands on the design tool, not the PDP.
 */
export const normalizeDestinationKey = (
  raw: string | undefined
): ProductLinkDestinationKey | undefined => {
  if (!raw) {
    return undefined;
  }
  const key = raw.toLowerCase().replace(/[\s_-]+/g, '');

  if (key.includes('designtool') || key.includes('design')) {
    return 'designTool';
  }
  if (key.includes('series')) {
    return 'seriesLanding';
  }
  if (key.includes('raq') || key.includes('quote')) {
    return 'requestAQuote';
  }
  if (key.includes('pdp') || key.includes('productdetail') || key.includes('product')) {
    return 'productDetailPage';
  }
  return undefined;
};

export const DESTINATION_DEFAULTS: Record<
  ProductLinkDestinationKey,
  { labelKey: string; defaultLabel: (seriesTitle: string) => string }
> = {
  productDetailPage: {
    labelKey: 'productLinkPDPText',
    defaultLabel: () => 'View this product',
  },
  designTool: {
    labelKey: 'productLinkDesignToolText',
    defaultLabel: () => 'Design this product',
  },
  seriesLanding: {
    labelKey: 'productLinkSeriesLandingText',
    defaultLabel: (seriesTitle) => `Explore ${seriesTitle}`.trim(),
  },
  requestAQuote: {
    labelKey: 'productLinkRequestAQuoteText',
    defaultLabel: () => 'Request a Quote',
  },
};

export const getDestinationHref = (
  destination: ProductLinkDestinationKey,
  productItem: any,
  seriesItem: any
): string | undefined => {
  const pf = productItem?.fields ?? {};
  const sf = seriesItem?.fields ?? {};

  switch (destination) {
    case 'productDetailPage':
      return pf.productDetailPageLink?.value?.href ?? sf.productDetailPageLink?.value?.href;
    case 'designTool': {
      // The Design Tool link lives in the product's CTA section, but the field
      // is named inconsistently across templates — try each spelling on the
      // product before falling back to the series.
      const link =
        pf.designToolLink?.value ??
        pf.designToolCTA?.value ??
        pf.productDesignToolLink?.value ??
        pf.designTool?.value ??
        sf.designToolLink?.value ??
        sf.designToolCTA?.value;
      if (!link?.href) {
        return undefined;
      }
      // The Design Tool deep-links a product through the Sitecore `anchor`
      // field (e.g. "/<guid>/0"), appended as a hash so the SPA opens it.
      const anchor = typeof link.anchor === 'string' ? link.anchor.trim() : '';
      return anchor ? `${link.href}#${anchor.replace(/^#/, '')}` : link.href;
    }
    case 'seriesLanding':
      return (
        sf.seriesLandingPageCTA?.value?.href ??
        sf.seriesLandingPageLink?.value?.href ??
        sf.seriesLink?.value?.href ??
        sf.seriesLandingLink?.value?.href ??
        sf.exploreAllProducts?.value?.href ??
        pf.exploreAllProducts?.value?.href ??
        pf.seriesLink?.value?.href
      );
    case 'requestAQuote': {
      const origin =
        typeof globalThis?.location?.origin === 'string'
          ? globalThis.location.origin.replace(/\/+$/u, '')
          : '';
      return origin ? `${origin}/request-a-quote/` : '/request-a-quote/';
    }
    default:
      return undefined;
  }
};

export type ProductLinkDestinationReport = {
  /** Every entry the author selected, as it resolved to a string. */
  authored: string[];
  /** Recognised destinations that render, in primary → secondary → tertiary order. */
  rendered: ProductLinkDestinationKey[];
  /** Entries that matched no destination — these cost the card a button. */
  unrecognized: string[];
  /** Recognised entries dropped by the three-button cap. */
  overflow: ProductLinkDestinationKey[];
};

/**
 * Splits the authored `productLinkDestinationCTAs` into what renders and what
 * gets dropped, so the chart can say *why* a button is missing instead of
 * leaving an author guessing.
 */
export const describeProductLinkDestinations = (fields: any): ProductLinkDestinationReport => {
  const items = ((fields?.productLinkDestinationCTAs as any[] | undefined) ??
    (fields?.productLinkDestinations as any[] | undefined) ??
    []) as any[];

  const authored: string[] = [];
  const recognized: ProductLinkDestinationKey[] = [];
  const unrecognized: string[] = [];

  for (const item of items) {
    const raw = resolveKey(item) ?? item?.displayName ?? item?.name ?? '';
    authored.push(raw);
    const key = normalizeDestinationKey(raw);
    if (key) {
      recognized.push(key);
    } else {
      unrecognized.push(raw);
    }
  }

  return {
    authored,
    rendered: recognized.slice(0, MAX_PRODUCT_LINK_DESTINATIONS),
    unrecognized,
    overflow: recognized.slice(MAX_PRODUCT_LINK_DESTINATIONS),
  };
};

/** Authored destinations, capped at three and ordered primary → secondary → tertiary. */
export const getProductLinkDestinations = (fields: any): ProductLinkDestinationKey[] =>
  describeProductLinkDestinations(fields).rendered;
