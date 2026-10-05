import { Flags } from 'lib/utils/regexp-utils/flags';
import { describe, expect, it } from 'vitest';

import { asterikPatternToRegExp } from './asterik-pattern-to-regexp';

describe('lib > utils > string-utils > asterik-pattern-to-regexp', () => {
  it('matches a wildcard pattern across the entire string', () => {
    const regExp = asterikPatternToRegExp('file-*.txt');

    expect(regExp.test('file-report.txt')).toBe(true);
    expect(regExp.test('archive/file-report.txt')).toBe(false);
  });

  it('escapes regular expression characters in the pattern', () => {
    const regExp = asterikPatternToRegExp('file.*');

    expect(regExp.test('file.txt')).toBe(true);
    expect(regExp.test('filetxt')).toBe(false);
  });

  it('is case-sensitive by default', () => {
    expect(asterikPatternToRegExp('File*').test('file-name')).toBe(false);
  });

  it('accepts string flags', () => {
    expect(asterikPatternToRegExp('File*', 'i').test('file-name')).toBe(true);
  });

  it('accepts Flags enum values', () => {
    expect(asterikPatternToRegExp('File*', Flags.ignoreCase).test('file-name')).toBe(true);
  });
});
