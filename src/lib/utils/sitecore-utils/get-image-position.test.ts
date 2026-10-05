import { describe, expect, it } from 'vitest';

import { getImagePosition } from './get-image-position';

describe('lib > utils > sitecore-utils > get-image-position', () => {
  it.each([undefined, {}, { fields: {} }])('returns the default position for %s', (imagePos) => {
    expect(getImagePosition('left', imagePos as never)).toBe('left');
  });

  it.each(['left', 'right'])('returns the configured image position: %s', (value) => {
    const imagePos = {
      fields: {
        Value: {
          value,
        },
      },
    };

    expect(getImagePosition('left', imagePos as never)).toBe(value);
  });

  it('uses the default position when the configured value is nullish', () => {
    const imagePos = {
      fields: {
        Value: {
          value: undefined,
        },
      },
    };

    expect(getImagePosition('right', imagePos as never)).toBe('right');
  });
});
