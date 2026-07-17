import { vercelAdapter } from '@flags-sdk/vercel';
import { dedupe, flag } from 'flags/next';
import { environment } from 'startup/environment';

/**
 * All aw-website feature flag keys must use this prefix
 * to namespace them in the Vercel Flags dashboard.
 */
const FLAG_KEY_PREFIX = 'aw-website-';

const identify = dedupe(async (): Promise<unknown> => {
  return {
    environment: { name: environment.environmentName, role: environment.roleName },
  };
});

// Release: Example Feature Flag
export const releaseExampleFeature = flag<boolean>({
  key: `${FLAG_KEY_PREFIX}release-example-feature`,
  adapter: vercelAdapter(),
  identify,
  description: 'An example feature flag for demonstration purposes.',
  defaultValue: false,
  options: [
    { value: true, label: 'Released' },
    { value: false, label: 'Pending' },
  ],
});


// Release: Redesigned Series Compare Chart
export const releaseRedesignedSeriesCompareChart = flag<boolean>({
  key: `${FLAG_KEY_PREFIX}release-redesigned-series-compare-chart`,
  adapter: vercelAdapter(),
  identify,
  description:
    'Renders the redesigned card-based series compare chart (ComparisonSeriesChart) instead of the legacy AW_ComparisonSeriesTable layout.',
  defaultValue: false,
  options: [
    { value: true, label: 'Released' },
    { value: false, label: 'Pending' },
  ],
});
