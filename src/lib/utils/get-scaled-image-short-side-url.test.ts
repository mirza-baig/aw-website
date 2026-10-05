import { describe, expect, it } from 'vitest';

import { getScaledImageShortSideUrl } from './get-scaled-image-short-side-url';

describe('lib > utils > get-scaled-image-short-side-url', () => {
  it('returns an empty URL unchanged', () => {
    expect(getScaledImageShortSideUrl('', '300', '100', '200')).toBe('');
  });

  it('scales the short side and removes conflicting image parameters', () => {
    const imageUrl = '/-/media/image.jpg?h=100&w=200&iar=1&hash=abc&foo=bar';

    expect(getScaledImageShortSideUrl(imageUrl, '300', '200', '100')).toBe(
      '/-/jssmedia/image.jpg?foo=bar&mh=300'
    );
  });

  it('uses the width parameter when the height is the short side', () => {
    expect(getScaledImageShortSideUrl('/-/media/image.jpg', '300', '100', '200')).toBe(
      '/-/jssmedia/image.jpg?mw=300'
    );
  });
});
