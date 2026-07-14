import { faker } from '@faker-js/faker';
import searchTokenService from 'lib/coveo/search-token-service';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { handler, schema } from './post';

const validBody = {
  organizationid: faker.string.alphanumeric(10),
};

describe('app > api > aw > coveo > access-token', async () => {
  describe('schema', () => {
    it('accepts a valid body', async () => {
      const isValid = await schema.isValid(validBody);
      expect(isValid).toBe(true);
    });

    it('requires organizationid', async () => {
      const invalidBody = { ...validBody, organizationid: undefined };
      const isValid = await schema.isValid(invalidBody);
      expect(isValid).toBe(false);
    });

    it('rejects an empty organizationid', async () => {
      const invalidBody = { ...validBody, organizationid: '' };
      const isValid = await schema.isValid(invalidBody);
      expect(isValid).toBe(false);
    });
  });

  describe('handler', async () => {
    const token = faker.string.alphanumeric(32);
    const getSearchToken = vi.spyOn(searchTokenService, 'getSearchToken').mockResolvedValue(token);

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('requests a token for the given organization', async () => {
      await handler(validBody);
      expect(getSearchToken).toHaveBeenCalledWith(validBody.organizationid);
    });

    it('returns a success response with the token', async () => {
      const response = await handler(validBody);
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody).toEqual({
        title: 'Access Token Created',
        status: 200,
        data: { token },
      });
    });

    it('propagates errors from the token service', async () => {
      getSearchToken.mockRejectedValueOnce(new Error('coveo unavailable'));
      await expect(handler(validBody)).rejects.toThrow('coveo unavailable');
    });
  });
});
