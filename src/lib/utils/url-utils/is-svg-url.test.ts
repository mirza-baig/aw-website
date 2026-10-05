import { describe, expect, it } from 'vitest';

import { isSvgUrl } from './is-svg-url';

describe('lib > utils > url-utils > is-svg-url', () => {
  it('returns false for undefined', () => {
    expect(isSvgUrl(undefined)).toBe(false);
  });

  it('returns false for a relative non svg url', () => {
    expect(isSvgUrl('test.jpg')).toBe(false);
  });

  it('returns false for an absolute non svg url', () => {
    expect(isSvgUrl('https://server/test.jpg')).toBe(false);
  });

  it('returns false for an invalid url', () => {
    expect(isSvgUrl('https://server/<test.jpg>')).toBe(false);
  });

  it('returns true for a relative svg url', () => {
    expect(isSvgUrl('test.svg')).toBe(true);
  });

  it('returns true for an absolute svg url', () => {
    expect(isSvgUrl('https://server/test.svg')).toBe(true);
  });
});
