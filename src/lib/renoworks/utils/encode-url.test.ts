import { describe, expect, it } from 'vitest';

import { encodeUrl } from './encode-url';

describe('lib > renoworks > utils > encode-url', () => {
  it('encodes a url correctly', () => {
    const url = 'param-name=param value&another=value"';
    const encodedUrl = encodeUrl(url);
    expect(encodedUrl).toBe('param-name%3Dparam+value%26another%3Dvalue%22');
  });
});
