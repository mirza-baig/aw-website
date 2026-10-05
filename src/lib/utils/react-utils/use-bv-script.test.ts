import { Environment } from 'lib/environment/environment';
import { useExternalScript } from 'lib/utils/react-utils/use-external-script';
import { describe, expect, it, vi } from 'vitest';

import { useBVScript } from './use-bv-script';

vi.mock('lib/utils/react-utils/use-external-script', () => ({
  useExternalScript: vi.fn(),
}));

describe('lib > utils > react-utils > use-bv-script', () => {
  const productionEnvironment = new Environment({
    environmentName: 'production',
    applicationName: 'website',
    roleName: 'www',
  });
  const stagingEnvironment = new Environment({
    environmentName: 'development',
    applicationName: 'website',
    roleName: 'preview',
  });

  it('returns the external script state', () => {
    vi.mocked(useExternalScript).mockReturnValue('ready');

    expect(useBVScript({ environment: productionEnvironment, theme: 'aw' })).toBe('ready');
  });

  it('loads the production script for the AW theme in production', () => {
    vi.mocked(useExternalScript).mockReturnValue('loading');

    useBVScript({ environment: productionEnvironment, theme: 'aw' });

    expect(useExternalScript).toHaveBeenCalledWith(
      'https://apps.bazaarvoice.com/deployments/andersenwindows/main_website_dxp/production/en_US/bv.js'
    );
  });

  it('loads the staging script for the AW theme outside production', () => {
    vi.mocked(useExternalScript).mockReturnValue('loading');

    useBVScript({ environment: stagingEnvironment, theme: 'aw' });

    expect(useExternalScript).toHaveBeenCalledWith(
      'https://apps.bazaarvoice.com/deployments/andersenwindows/main_website_dxp/staging/en_US/bv.js'
    );
  });

  it.each(['', 'other', 'AW'])('does not load a script for the %s theme', (theme) => {
    vi.mocked(useExternalScript).mockReturnValue('idle');

    useBVScript({ environment: productionEnvironment, theme });

    expect(useExternalScript).toHaveBeenCalledWith('');
  });
});
