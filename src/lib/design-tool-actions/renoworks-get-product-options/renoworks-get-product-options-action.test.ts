import { faker } from '@faker-js/faker';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createRenoworksGetProductOptionsHandler,
  renoworksGetProductOptionsSchema as schema,
} from './renoworks-get-product-options-action';

const logger = vi.fn() as unknown as import('debug').Debugger;
const handler = createRenoworksGetProductOptionsHandler(logger);

const validBody = {
  ApiHost: faker.internet.url(),
  Rwd: '/products/interior/100Series_INT.rwd',
  Settings: 'Width=36|Height=48',
};

describe('lib > design-tool-actions > renoworks-get-product-options > renoworks-get-product-options-action', () => {
  describe('schema', () => {
    it('requires ApiHost', async () => {
      const invalidBody = { ...validBody, ApiHost: undefined };
      const isValid = await schema.isValid(invalidBody);
      expect(isValid).toBe(false);
    });

    it('requires Rwd', async () => {
      const invalidBody = { ...validBody, Rwd: undefined };
      const isValid = await schema.isValid(invalidBody);
      expect(isValid).toBe(false);
    });

    it('defaults Settings to empty string', async () => {
      const body = { ...validBody, Settings: undefined };
      const isValid = await schema.isValid(body);
      expect(isValid).toBe(true);
    });

    it('accepts a valid payload', async () => {
      const isValid = await schema.isValid(validBody);
      expect(isValid).toBe(true);
    });
  });

  describe('handler', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('fetches product options from the Renoworks API', async () => {
      const mockResults = { product: { name: '100 Series' } };
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        text: () => Promise.resolve(JSON.stringify(mockResults)),
      } as Response);

      await handler(validBody);

      const expectedUrl = `${validBody.ApiHost}/_rwapi/?function=ProductOptions&mode=json&rwd=${validBody.Rwd}&settings=${validBody.Settings}`;
      expect(global.fetch).toHaveBeenCalledWith(expectedUrl, { method: 'GET' });
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('returns a success response with data', async () => {
      const mockResults = { product: { name: '100 Series' } };
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        text: () => Promise.resolve(JSON.stringify(mockResults)),
      } as Response);

      const response = await handler(validBody);
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody).toEqual({
        data: mockResults,
        title: 'Product Options',
        status: 200,
      });
    });

    it('throws an error when Renoworks returns an XML error response', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        text: () => Promise.resolve('<error>Product not found</error>'),
      } as Response);

      await expect(handler(validBody)).rejects.toThrow('Product not found');
    });

    it('throws an error when fetch fails', async () => {
      vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));

      await expect(handler(validBody)).rejects.toThrow('Network error');
    });
  });
});
