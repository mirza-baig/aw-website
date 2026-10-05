import { describe, expect, it } from 'vitest';

import { filterProtocol } from './filter-protocol';

describe('lib > utils > url-utils > filter-protocol', () => {
  const safeUrls = [
    'https://test',
    'ftp://u:p@test',
    'file:///test',
    'mailto:test@example.com',
    'tel:8675309',
    '/',
    './',
    '../',
  ];
  const unsafeUrls = ['javascript:console.log("bad")', '\\', '.\\', '..\\'];

  it.each(safeUrls)('%s is a safe URL', (url) => {
    expect(filterProtocol(url)).toBe(url);
  });

  it.each(unsafeUrls)('%s is an unsafe URL', (url) => {
    expect(filterProtocol(url)).toBe('');
  });
});
