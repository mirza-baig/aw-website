import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';

import { toBoolean } from './to-boolean';

describe('lib > utils > string-utils > to-boolean', () => {
  const truthy = ['true', '1', 'yes', 't', 'y', 'TRuE', 'yEs', 'T', 'Y'];

  it('returns false for undefined', () => {
    expect(toBoolean(undefined)).toBe(false);
  });

  it('returns false for null', () => {
    expect(toBoolean(null)).toBe(false);
  });

  it('return false for any other string', () => {
    let value = faker.string.alphanumeric(5);
    const lowerTruthy = truthy.map((item) => item.toLowerCase());
    while (lowerTruthy.includes(value.toLowerCase())) {
      value = faker.string.alphanumeric(5);
    }
    expect(toBoolean(value)).toBe(false);
  });

  it.each(truthy)('returns true for %s', (input) => {
    expect(toBoolean(input)).toBe(true);
  });
});
