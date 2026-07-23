import { Item, LinkField } from '@sitecore-content-sdk/nextjs';

/**
 * TEMPORARY MOCK for the chart intro CTA (link + button styling + icon).
 *
 * The `chartIntroCta` (General Link), `chartIntroCtaStyle` (button-variant droplink) and
 * `chartIntroCtaIcon` (icon droplink) fields do not exist on the AW_ProductCompareChart /
 * AW_ComparisonSeriesTable Sitecore templates yet. Until they are authored, both compare
 * charts render the intro CTA from the mock values below so the design can be reviewed.
 *
 * ONE-LINE SWITCH: set `USE_MOCK_INTRO_CTA` to `false` once the real fields exist. Both
 * charts then read the authored `props.fields` values instead, and this file (plus its
 * imports) can be deleted.
 */
export const USE_MOCK_INTRO_CTA: boolean = true;

const MOCK_INTRO_CTA: LinkField = {
  value: { href: '/windows', text: 'Intro CTA', linktype: 'internal' },
};

// Both droplinks are shaped so getEnum() resolves them: fields.Value.value.
//   style → 'primary' | 'secondary' | 'tertiary' | 'link'
//   icon  → any SvgIcon IconTypes value (e.g. 'arrow', 'arrow-right', 'download')
const MOCK_INTRO_CTA_STYLE = { fields: { Value: { value: 'primary' } } } as unknown as Item;
const MOCK_INTRO_CTA_ICON = { fields: { Value: { value: 'arrow' } } } as unknown as Item;

/** Returns the mock intro CTA while mocking is on, otherwise the authored link field. */
export const resolveIntroCta = (real?: LinkField): LinkField | undefined =>
  USE_MOCK_INTRO_CTA ? MOCK_INTRO_CTA : real;

/** Returns the mock button-style droplink while mocking is on, otherwise the authored one. */
export const resolveIntroCtaStyle = (real?: Item): Item | undefined =>
  USE_MOCK_INTRO_CTA ? MOCK_INTRO_CTA_STYLE : real;

/** Returns the mock icon droplink while mocking is on, otherwise the authored one. */
export const resolveIntroCtaIcon = (real?: Item): Item | undefined =>
  USE_MOCK_INTRO_CTA ? MOCK_INTRO_CTA_ICON : real;
