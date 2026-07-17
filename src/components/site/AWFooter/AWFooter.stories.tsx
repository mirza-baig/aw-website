import { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FeatureFlags } from 'lib/feature-flags/feature-flags';
import { FlagValues } from 'lib/feature-flags/types';
import { defaultValues as featureToggleDefaults } from 'lib/feature-toggles/feature-toggles';
import { WebsiteDynamicState, WebsiteStaticState } from 'lib/website/website-state';
import { WebsiteContextProvider } from 'lib/website/WebsiteContext';
import { FC } from 'react';

import { Default as AWFooter } from './AWFooter';

/**
 * AWFooter is a Sitecore-connected component. For Storybook we feed it mock
 * "integrated GraphQL" rendering data (the same shape `getComponentServerProps`
 * expects) and wrap it in the providers its leaf components require
 * (WebsiteContextProvider drives LinkWrapper / ImageWrapper / useTheme).
 *
 * The redesigned layout is gated behind the `releaseFooterExpandedLayout`
 * feature flag, which the footer reads from the FeatureFlags singleton (in the
 * real app it's primed by <SetFeatureFlags> in Layout). `renderFooter` primes
 * it here before rendering.
 */
const AWFooterComponent = AWFooter as unknown as FC<{ rendering: ComponentRendering }>;

const GROUP_TITLES = [
  'About Andersen',
  'Renewal by Andersen',
  'Explore Products',
  'Get Started',
  'Find Help',
  'Resources',
  'For Professionals',
  'Why Andersen',
];

const SAMPLE_LINKS = [
  'Overview',
  'Our Story',
  'Innovation',
  'Quality',
  'Community',
  'Sustainability',
];

type FieldResult = { name: string; jsonValue: unknown };

const textField = (name: string, value: string): FieldResult => ({ name, jsonValue: { value } });

const linkItem = (text: string, href = '#') => ({
  fields: [
    { name: 'navItemLink', jsonValue: { value: { href, text, target: '', linktype: 'internal' } } },
  ],
});

const navGroup = (title: string, linkCount = 5) => ({
  fields: [textField('navGroupTitle', title)],
  children: { results: SAMPLE_LINKS.slice(0, linkCount).map((label) => linkItem(label)) },
});

const menu = (menuTitle: string, results: unknown[]) => ({
  fields: [textField('menuTitle', menuTitle)],
  children: { results },
});

/** Build a footer rendering with `groupCount` authored nav groups. */
function buildRendering(groupCount: number): ComponentRendering {
  const footerGroups = Array.from({ length: groupCount }, (_, i) =>
    navGroup(GROUP_TITLES[i] ?? `Group ${i + 1}`)
  );

  const privacyLinks = [
    linkItem('Terms', '/terms'),
    linkItem('Privacy Policy', '/privacy'),
    linkItem('Privacy Notice for CA Residents', '/ca-privacy'),
    linkItem('EEO Policy', '/eeo'),
  ];

  return {
    componentName: 'AWFooter',
    dataSource: '{mock-footer-datasource}',
    fields: {
      data: {
        item: {
          fields: [
            textField('tagLine', 'Trust your home to Andersen'),
            textField('copyright', '©{currentYear} Andersen Corporation. All rights reserved.'),
            // Empty logo/logoCTA so ImageWrapper renders nothing (no CDN lookup).
            { name: 'logo', jsonValue: { value: {} } },
            { name: 'logoCTA', jsonValue: { value: { href: '' } } },
            textField(
              'privacyCaption',
              'Andersen collects certain categories of personal information. See links for more information.'
            ),
          ],
          children: {
            results: [
              menu('socialMenu', []),
              menu('footerMenu', footerGroups),
              menu('privacyMenu', privacyLinks),
            ],
          },
        },
      },
    },
  } as unknown as ComponentRendering;
}

const makeFeatureFlags = (expandedLayout: boolean): FlagValues =>
  ({
    releaseExampleFeature: false,
    releaseFooterExpandedLayout: expandedLayout,
    releaseRaqWebToLeadFetchMethod: false,
  }) as FlagValues;

const makeStaticState = (expandedLayout: boolean): WebsiteStaticState => ({
  theme: 'aw',
  featureToggles: featureToggleDefaults,
  featureFlags: makeFeatureFlags(expandedLayout),
});

const mockDynamicState: WebsiteDynamicState = {
  favoriteProducts: [],
  favoriteDesigns: [],
  selectedModalId: '',
  isGenericModalOpen: false,
  prevFocusedElementRef: null,
  bannerList: { mobileBannerList: [], desktopBannerList: [] },
};

function renderFooter(groupCount: number, expandedLayout: boolean) {
  // Prime the flag singleton the footer reads from before it renders.
  FeatureFlags.setValues(makeFeatureFlags(expandedLayout));

  return (
    <WebsiteContextProvider
      staticState={makeStaticState(expandedLayout)}
      initialDynamicState={mockDynamicState}
    >
      <AWFooterComponent rendering={buildRendering(groupCount)} />
    </WebsiteContextProvider>
  );
}

const meta: Meta = {
  title: 'Site/AW Footer',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Redesigned footer (feature flag `releaseFooterExpandedLayout`). Desktop (≥1008px) columns lay out by nav-group count; tablet (800–1007px) wraps to 3 columns; phone (<800px) uses accordions. Resize the canvas or use the viewport toolbar to test breakpoints.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

export const FiveGroups_OneRow: Story = {
  name: '≤5 groups — single row',
  render: () => renderFooter(5, true),
};

export const SixGroups_ThreeByTwo: Story = {
  name: '6 groups — 3 × 2',
  render: () => renderFooter(6, true),
};

export const SevenGroups_FourPlusThree: Story = {
  name: '7 groups — 4 + 3',
  render: () => renderFooter(7, true),
};

export const EightGroups_FourByTwo: Story = {
  name: '8 groups — 4 × 2',
  render: () => renderFooter(8, true),
};

export const LegacyLayout_FlagOff: Story = {
  name: 'Legacy layout (flag off)',
  render: () => renderFooter(5, false),
};

export const Playground: Story = {
  name: 'Playground (adjust count + flag)',
  args: { groupCount: 8, expandedLayout: true },
  argTypes: {
    groupCount: { control: { type: 'range', min: 1, max: 8, step: 1 } },
    expandedLayout: { control: 'boolean' },
  },
  render: (args) => renderFooter(args.groupCount as number, args.expandedLayout as boolean),
};
