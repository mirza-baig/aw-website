import { describe, expect, it, vi } from 'vitest';

import { safeJson } from './safe-json';

describe('lib > utils > request-response-utils > safe-json', () => {
  it.each([undefined, null])('returns an empty object for %s requests', async (request) => {
    expect(await safeJson(request)).toEqual({});
  });

  it('returns the parsed JSON value unchanged', async () => {
    const value = [{ id: 1 }, { id: 2 }];
    const request = {
      json: async () => value,
    } as unknown as Request;

    expect(await safeJson<typeof value>(request)).toBe(value);
  });

  it('returns an empty object and logs when reading JSON fails', async () => {
    const error = new Error('invalid json');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const request = {
      json: async () => {
        throw error;
      },
    } as unknown as Request;

    expect(await safeJson(request)).toEqual({});
    expect(consoleError).toHaveBeenCalledWith('safeJson: error retrieving JSON: invalid json');

    consoleError.mockRestore();
  });
});
