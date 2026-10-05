import { describe, expect, it, vi } from 'vitest';

import { safeText } from './safe-text';

describe('lib > utils > request-response-utils > safe-text', () => {
  it.each([undefined, null])('returns an empty string for %s requests', async (request) => {
    expect(await safeText(request)).toBe('');
  });

  it('returns the request text unchanged', async () => {
    const request = {
      text: async () => ' request text ',
    } as unknown as Request;

    expect(await safeText(request)).toBe(' request text ');
  });

  it('returns an empty string and logs when reading text fails', async () => {
    const error = new Error('invalid text');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const request = {
      text: async () => {
        throw error;
      },
    } as unknown as Request;

    expect(await safeText(request)).toBe('');
    expect(consoleError).toHaveBeenCalledWith('safeText: error retrieving text: invalid text');

    consoleError.mockRestore();
  });
});
