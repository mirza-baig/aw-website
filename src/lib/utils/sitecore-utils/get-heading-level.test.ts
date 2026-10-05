import { describe, expect, it } from 'vitest';

import { getHeadingLevel } from './get-heading-level';

describe('lib > utils > sitecore-utils > get-heading-level', () => {
  it.each([undefined, {}, { fields: {} }])('returns the default heading for %s', (level) => {
    expect(getHeadingLevel('h2', level as never)).toBe('h2');
  });

  it('returns the configured heading level', () => {
    const level = {
      fields: {
        Value: {
          value: 'h3',
        },
      },
    };

    expect(getHeadingLevel('h2', level as never)).toBe('h3');
  });

  it('uses the default heading when the configured value is nullish', () => {
    const level = {
      fields: {
        Value: {
          value: undefined,
        },
      },
    };

    expect(getHeadingLevel('h4', level as never)).toBe('h4');
  });
});
