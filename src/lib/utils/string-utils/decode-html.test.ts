import { describe, expect, it } from 'vitest';

import { decodeHtml } from './decode-html';

describe('lib > utils > string-utils > decode-html', () => {
  it('returns text without encoded characters unchanged', () => {
    expect(decodeHtml('plain text')).toBe('plain text');
  });

  it.each([
    ['&amp;', '&'],
    ['&lt;strong&gt;text&lt;/strong&gt;', '<strong>text</strong>'],
    ['&#39;', "'"],
  ])('decodes %s to %s', (input, expected) => {
    expect(decodeHtml(input)).toBe(expected);
  });

  it('preserves markup as text', () => {
    expect(decodeHtml('<strong>text</strong>')).toBe('<strong>text</strong>');
  });
});
