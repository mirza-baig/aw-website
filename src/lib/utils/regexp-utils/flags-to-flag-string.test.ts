import { describe, expect, it } from 'vitest';

import { Flags } from './flags';
import { flagsToFlagString } from './flags-to-flag-string';

describe('lib > utils > regexp-utils > flags-to-flag-string', () => {
  it.each([
    [undefined, ''],
    [0, ''],
    [Flags.hasIndices, 'd'],
    [Flags.global, 'g'],
    [Flags.ignoreCase, 'i'],
    [Flags.multiline, 'm'],
    [Flags.dotAll, 's'],
    [Flags.unicode, 'u'],
    [Flags.unicodeSets, 'v'],
    [Flags.sticky, 'y'],
  ])('converts %s to %s', (flags, expected) => {
    expect(flagsToFlagString(flags)).toBe(expected);
  });

  it('returns combined flags in the expected order', () => {
    const flags =
      Flags.sticky |
      Flags.unicodeSets |
      Flags.unicode |
      Flags.dotAll |
      Flags.multiline |
      Flags.ignoreCase |
      Flags.global |
      Flags.hasIndices;

    expect(flagsToFlagString(flags)).toBe('dgimsuvy');
  });
});
