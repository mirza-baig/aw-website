import { afterEach, describe, expect, it, vi } from 'vitest';

import { createUUID } from './create-uuid';

describe('lib > utils > string-utils > create-uuid', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns a version 4 UUID with a valid variant', () => {
    const uuid = createUUID();

    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it('uses the expected values when Math.random returns zero', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    expect(createUUID()).toBe('00000000-0000-4000-8000-000000000000');
  });
});
