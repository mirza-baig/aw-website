import { describe, expect, it } from 'vitest';

import { getBreakpoint, getScreenType } from './get-screen-type';

describe('lib > utils > get-screen-type', () => {
  it.each([
    [1488, 'xl'],
    [1248, 'lg'],
    [1024, 'mml'],
    [1008, 'ml'],
    [800, 'mmd'],
    [672, 'md'],
    [671, 'sm'],
  ])('returns the %s screen type at width %s', (width, screenType) => {
    expect(getScreenType(width)).toEqual({ screenType, currentScreenWidth: width });
  });

  it('preserves the supplied width for a small screen', () => {
    expect(getScreenType(320)).toEqual({ screenType: 'sm', currentScreenWidth: 320 });
  });

  it.each([
    ['xl', 1488],
    ['lg', 1248],
    ['mml', 1024],
    ['ml', 1008],
    ['mmd', 800],
    ['md', 672],
    ['sm', 375],
  ])('returns the %s breakpoint', (screenType, breakpoint) => {
    expect(getBreakpoint(screenType as never)).toBe(breakpoint);
  });
});
