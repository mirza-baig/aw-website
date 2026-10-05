import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';

import { safeJsonParse } from './safe-json-parse';

describe('lib > utils > string-utils > safe-json-parse', () => {
  it('returns undefined invalid values', () => {
    expect(safeJsonParse('not json')).toBe(undefined);
  });

  it('returns parsed json string', () => {
    const value = {
      bird: faker.animal.bird(),
      cat: faker.animal.cat(),
    };
    expect(safeJsonParse(JSON.stringify(value))).toEqual(value);
  });
});
