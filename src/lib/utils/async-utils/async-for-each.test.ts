import { describe, expect, it, vi } from 'vitest';

import { asyncForEach } from './async-for-each';

describe('lib > utils > async-utils > async-for-each', () => {
  it('processes entries sequentially in array order', async () => {
    const completed: number[] = [];

    await asyncForEach([1, 2, 3], async (value) => {
      await Promise.resolve();
      completed.push(value);
    });

    expect(completed).toEqual([1, 2, 3]);
  });

  it('does not invoke the callback for an empty array', async () => {
    const callback = vi.fn(async () => undefined);

    await asyncForEach([], callback);

    expect(callback).not.toHaveBeenCalled();
  });

  it('rejects and stops processing when a callback fails', async () => {
    const processed: number[] = [];

    await expect(
      asyncForEach([1, 2, 3], async (value) => {
        processed.push(value);
        if (value === 2) {
          throw new Error('failed');
        }
      })
    ).rejects.toThrow('failed');

    expect(processed).toEqual([1, 2]);
  });
});
