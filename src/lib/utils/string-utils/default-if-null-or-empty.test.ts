import { describe, expect, it } from 'vitest';

import { defaultIfNullOrEmpty } from './default-if-null-or-empty';

describe('lib > utils > string-utils > default-if-null-or-empty', () => {
  it.each([undefined, null, ''])('returns the default value for %s', (value) => {
    expect(defaultIfNullOrEmpty(value, 'default value')).toBe('default value');
  });

  it.each(['value', ' value ', ' '])('returns the original value for %s', (value) => {
    expect(defaultIfNullOrEmpty(value, 'default value')).toBe(value);
  });

  it('returns an empty default value when the input is empty', () => {
    expect(defaultIfNullOrEmpty('', '')).toBe('');
  });
});
