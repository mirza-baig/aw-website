import { describe, expect, it } from 'vitest';

import { removeCdnHostName } from './remove-cdn-host-name';

describe('lib > utils > url-utils > remove-cdn-host-name', () => {
  it('handles undefined', () => {
    expect(removeCdnHostName(undefined)).toBe('');
  });

  it('handles the sitecore cdn urls', () => {
    const mediaPath = '/media/test.jpg';
    expect(
      removeCdnHostName(`https://edge.sitecorecloud.io/andersencorporation-prod${mediaPath}`)
    ).toBe(`/-${mediaPath}`);
  });

  it('ignores non sitecore cdn urls', () => {
    const url = 'https://test/-/media/test.jpg';
    expect(removeCdnHostName(url)).toBe(url);
  });
});
