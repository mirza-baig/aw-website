import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('startup/environment', () => ({
  environment: {
    isPreview: vi.fn(),
    isProduction: vi.fn(),
  },
}));

vi.mock('lib/sitecore-client', () => ({
  default: {
    getSiteInfoByHost: vi.fn(),
  },
}));

import sitecoreClient from 'lib/sitecore-client';
import { environment } from 'startup/environment';

import { checkHostNameInMediaURL } from './utils';

describe('checkHostNameInMediaURL', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rewrites dev xmc hosts to the site media host when in preview environment', () => {
    vi.mocked(environment.isPreview).mockReturnValue(true);
    vi.mocked(environment.isProduction).mockReturnValue(false);
    vi.mocked(sitecoreClient.getSiteInfoByHost).mockReturnValue({
      mediaHostName: 'xmc-preview-example.sitecorecloud.io',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const url = 'https://www.dev.xmc.andersenwindows.com/-/media/test.jpg';

    expect(checkHostNameInMediaURL(url)).toBe(
      'https://xmc-preview-example.sitecorecloud.io/-/media/test.jpg'
    );
  });

  it('rewrites uat xmc hosts to the site media host when in preview environment', () => {
    vi.mocked(environment.isPreview).mockReturnValue(true);
    vi.mocked(environment.isProduction).mockReturnValue(false);
    vi.mocked(sitecoreClient.getSiteInfoByHost).mockReturnValue({
      mediaHostName: 'xmc-uat-example.sitecorecloud.io',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const url = 'https://www.uat.xmc.andersenwindows.com/-/media/test.jpg';

    expect(checkHostNameInMediaURL(url)).toBe(
      'https://xmc-uat-example.sitecorecloud.io/-/media/test.jpg'
    );
  });

  it('rewrites production hosts to the site media host when in preview environment', () => {
    vi.mocked(environment.isPreview).mockReturnValue(true);
    vi.mocked(environment.isProduction).mockReturnValue(true);
    vi.mocked(sitecoreClient.getSiteInfoByHost).mockReturnValue({
      mediaHostName: 'xmc-prod-example.sitecorecloud.io',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    expect(checkHostNameInMediaURL('https://www.andersenwindows.com/-/media/test.jpg')).toBe(
      'https://xmc-prod-example.sitecorecloud.io/-/media/test.jpg'
    );
  });

  it('leaves the URL unchanged when not in preview environment', () => {
    vi.mocked(environment.isPreview).mockReturnValue(false);
    vi.mocked(environment.isProduction).mockReturnValue(false);

    const url = 'https://www.dev.xmc.andersenwindows.com/-/media/test.jpg';

    expect(checkHostNameInMediaURL(url)).toBe(url);
  });

  it('leaves edge.sitecorecloud.io URLs unchanged when no media host exists', () => {
    vi.mocked(environment.isPreview).mockReturnValue(true);
    vi.mocked(environment.isProduction).mockReturnValue(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(sitecoreClient.getSiteInfoByHost).mockReturnValue({} as any);

    const url = 'https://edge.sitecorecloud.io/andersencorporation-dev/-/media/test.jpg';

    expect(checkHostNameInMediaURL(url)).toBe(url);
  });
});
