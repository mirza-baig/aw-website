import {
  Field,
  ImageFieldValue,
  Item,
  LinkField,
  LinkFieldValue,
} from '@sitecore-content-sdk/nextjs';

/**
 * New-design series chart fields (chartEyebrow, chartTitle, chartDescription,
 * chartCtaLink, chartIntroCtaStyle, chartCtaIcon, finalColumnCTA, finalRowCTAOptions,
 * enableRedesignedLayout). Local augmentation until these are added to the
 * AW_ComparisonSeriesTable Sitecore template and `.sitecore/AndersenWindows.model.ts`
 * regenerates with real typed fields.
 */
export type ComparisonSeriesChartFields = {
  chartEyebrow?: Field<string>;
  chartTitle?: Field<string>;
  chartDescription?: Field<string>;
  /** Optional chart intro CTA shown under the description. */
  chartCtaLink?: LinkField;
  /** Button-variant droplink for the intro CTA (primary/secondary/tertiary/link). */
  chartCtaStyle?: Item;
  /** Optional icon droplink for the intro CTA (SvgIcon IconTypes value). */
  chartCtaIcon?: Item;
  finalColumnCTA?: LinkField;
  finalRowCTAOptions?: Item[];
  enableRedesignedLayout?: Field<boolean>;
  /** Show/hide the "Series Landing Page CTA" button rendered on every series card. Defaults to hidden until checked. */
  seriesDestinationCta?: Field<boolean>;
};

export type WithinSeriesChartFields = {
  /** Opts a datasource into the within-series layout. Off leaves today's charts untouched. */
  enableWithinSeriesLayout?: Field<boolean>;
  /** Label beside the switcher. Defaults to "Select Windows or Doors to compare:". */
  windowsDoorsToggleLabel?: Field<string>;
  /** Tab labels, defaulting to "Windows" / "Doors". */
  windowsToggleLabel?: Field<string>;
  doorsToggleLabel?: Field<string>;
  /** Text on the chosen series card. Defaults to "SELECTED: SEE BELOW". */
  seriesSelectedText?: Field<string>;
  /** Show or hide the trailing CTA column. */
  showFinalCTAColumn?: Field<boolean>;
  /** Destinations for the per-product CTAs (PDP, design tool, series, RAQ); first three win. */
  productLinkDestinationCTAs?: Item[];
};

export type CategroyBarProps = {
  title: string | undefined;
  cta: LinkFieldValue | undefined;
};

export type SubCategroyBarProps = {
  subTitle: string | undefined;
};

// we can ignore the below type-warning due to complex nature of datastructure used while creating proxy objects in comparisontables
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CategoryDataItem = string | undefined | any;

export type CategoryDataProps = Array<CategoryDataItem> & Partial<SubCategroyBarProps>;

export type SeriesTitle = {
  seriesIndex: number;
  url: LinkField;
  title: string;
  productTypeTitle?: string;
  description?: string;
  image?: ImageFieldValue;
  imageMobile?: ImageFieldValue;
  productName?: string;
};

export type ComparisonObjectProps = {
  [key: string]: CategroyBarProps;
} & {
  seriesTitles: Array<SeriesTitle | undefined>;
};
