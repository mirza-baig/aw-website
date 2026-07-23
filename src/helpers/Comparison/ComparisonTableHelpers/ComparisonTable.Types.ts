import {
  Field,
  ImageFieldValue,
  Item,
  LinkField,
  LinkFieldValue,
} from '@sitecore-content-sdk/nextjs';

/**
 * New-design series chart fields (chartEyebrow, chartTitle, chartDescription,
 * chartIntroCta, chartIntroCtaStyle, finalColumnCTA, finalRowCTAOptions,
 * enableRedesignedLayout). Local augmentation until these are added to the
 * AW_ComparisonSeriesTable Sitecore template and `.sitecore/AndersenWindows.model.ts`
 * regenerates with real typed fields.
 */
export type ComparisonSeriesChartFields = {
  chartEyebrow?: Field<string>;
  chartTitle?: Field<string>;
  chartDescription?: Field<string>;
  /** Optional chart intro CTA shown under the description. */
  chartIntroCta?: LinkField;
  /** Button-variant droplink for the intro CTA (primary/secondary/tertiary/link). */
  chartIntroCtaStyle?: Item;
  /** Optional icon droplink for the intro CTA (SvgIcon IconTypes value). */
  chartIntroCtaIcon?: Item;
  finalColumnCTA?: LinkField;
  finalRowCTAOptions?: Item[];
  enableRedesignedLayout?: Field<boolean>;
  /** Show/hide the "Series Landing Page CTA" button rendered on every series card. Defaults to hidden until checked. */
  seriesDestinationCta?: Field<boolean>;
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
