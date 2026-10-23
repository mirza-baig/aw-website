import type { Debugger } from 'debug';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createZippopotamHandler, zippopotamSchema } from './zippopotam-action';

const logger = vi.fn() as unknown as Debugger;
const handler = createZippopotamHandler(logger);

const validUSBody = {
  country: 'us' as const,
  postalCode: '55125',
};

const validCABody = {
  country: 'ca' as const,
  postalCode: 'L5N7Y2',
};

describe('lib > zippopotam > zippopotam-action', () => {
  describe('schema', () => {
    it('requires country', async () => {
      expect(
        await zippopotamSchema.isValid({
          postalCode: '55125',
        })
      ).toBe(false);
    });

    it('requires postalCode', async () => {
      expect(
        await zippopotamSchema.isValid({
          country: 'us',
        })
      ).toBe(false);
    });

    it('rejects invalid postal code', async () => {
      expect(
        await zippopotamSchema.isValid({
          country: 'ca',
          postalCode: 'ABC123',
        })
      ).toBe(false);
    });

    it('rejects unsupported country', async () => {
      expect(
        await zippopotamSchema.isValid({
          country: 'mx',
          postalCode: '55125',
        })
      ).toBe(false);
    });

    it('accepts a valid US payload', async () => {
      expect(await zippopotamSchema.isValid(validUSBody)).toBe(true);
    });

    it('accepts a valid CA payload', async () => {
      expect(await zippopotamSchema.isValid(validCABody)).toBe(true);
    });

    it('accepts postal code with surrounding whitespace', async () => {
      expect(
        await zippopotamSchema.isValid({
          country: 'us',
          postalCode: ' 55125 ',
        })
      ).toBe(true);
    });

    it('accepts a canadian FSA', async () => {
      expect(
        await zippopotamSchema.isValid({
          country: 'ca',
          postalCode: 'L5M',
        })
      ).toBe(true);
    });
  });

  describe('handler', () => {
    afterEach(() => {
      vi.restoreAllMocks();
      vi.clearAllMocks();
    });

    it('calls zippopotam api for US postal code', async () => {
      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          places: [],
        }),
      } as unknown as Response);

      await handler(validUSBody);

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.zippopotam.us/us/55125',
        expect.any(Object)
      );
    });

    it('calls zippopotam api for CA postal code', async () => {
      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          places: [],
        }),
      } as unknown as Response);

      await handler(validCABody);

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.zippopotam.us/ca/L5N7Y2',
        expect.any(Object)
      );
    });

    it('returns successful response', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          places: [],
        }),
      } as unknown as Response);

      const response = await handler(validUSBody);

      expect(response.status).toBe(200);
    });

    it('returns failure response when api request fails', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
        statusText: 'Not Found',
        text: vi.fn().mockResolvedValue('Postal code not found'),
      } as unknown as Response);

      const response = await handler(validUSBody);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body).toEqual({
        message: 'Zippopotam request failed',
        error: 'Postal code not found',
      });
    });

    it('trims postal code before calling api', async () => {
      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          places: [],
        }),
      } as unknown as Response);

      await handler({
        country: 'us',
        postalCode: ' 55125 ',
      });

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.zippopotam.us/us/55125',
        expect.any(Object)
      );
    });
  });
});
