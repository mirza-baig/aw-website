import { describe, expect, it } from 'vitest';

import { isUrlSafeChar } from './is-url-safe-char';

describe('lib > renoworks > utils > is-url-safe-char', () => {
  const safeCharacters = [
    ...'abcdefghijklmnopqrstuvwxyz',
    ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    ...'0123456789',
    ...'-_.!*()',
  ];
  const unsafeCharacters = [...' "#%<>?@[\]^`{|}~\''];

  it.each(safeCharacters)('%s is a safe character', (char) => {
    expect(isUrlSafeChar(char)).toBe(true);
  });

  it.each(unsafeCharacters)('%s is an unsafe character', (char) => {
    expect(isUrlSafeChar(char)).toBe(false);
  });
});
