import type { Debugger } from 'debug';
import { afterEach, describe, expect, it, vi } from 'vitest';

import marlimarService from './index';
import { createShareARLinkHandler, shareARLinkSchema } from './share-ar-link-action';

const logger = vi.fn() as unknown as Debugger;
const handler = createShareARLinkHandler(logger);

const validBody = {
  phoneNumber: '5551234567',
  link: 'https://test.com',
};

describe('lib > marlimar > share-ar-link-action', () => {
  describe('schema', () => {
    it('requires phoneNumber', async () => {
      expect(
        await shareARLinkSchema.isValid({
          link: 'https://test.com',
        })
      ).toBe(false);
    });

    it('rejects phone numbers shorter than 10 digits', async () => {
      expect(
        await shareARLinkSchema.isValid({
          phoneNumber: '123456789',
          link: 'https://test.com',
        })
      ).toBe(false);
    });

    it('rejects phone numbers longer than 11 digits', async () => {
      expect(
        await shareARLinkSchema.isValid({
          phoneNumber: '123456789012',
          link: 'https://test.com',
        })
      ).toBe(false);
    });

    it('rejects phone numbers containing non-numeric characters', async () => {
      expect(
        await shareARLinkSchema.isValid({
          phoneNumber: '555-123-4567',
          link: 'https://test.com',
        })
      ).toBe(false);
    });

    it('accepts a 10 digit phone number', async () => {
      expect(
        await shareARLinkSchema.isValid({
          phoneNumber: '5551234567',
          link: 'https://test.com',
        })
      ).toBe(true);
    });

    it('accepts an 11 digit phone number', async () => {
      expect(
        await shareARLinkSchema.isValid({
          phoneNumber: '15551234567',
          link: 'https://test.com',
        })
      ).toBe(true);
    });

    it('accepts a phone number with surrounding whitespace', async () => {
      expect(
        await shareARLinkSchema.isValid({
          phoneNumber: ' 5551234567 ',
          link: 'https://test.com',
        })
      ).toBe(true);
    });
    it('requires link', async () => {
      expect(
        await shareARLinkSchema.isValid({
          phoneNumber: '5551234567',
        })
      ).toBe(false);
    });

    it('accepts valid payload', async () => {
      expect(await shareARLinkSchema.isValid(validBody)).toBe(true);
    });
  });

  describe('handler', () => {
    const sendOutboundMessage = vi
      .spyOn(marlimarService, 'sendOutboundMessage')
      .mockResolvedValue(undefined);

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('sends message', async () => {
      await handler(validBody);

      expect(sendOutboundMessage).toHaveBeenCalledTimes(1);
    });

    it('returns success response', async () => {
      const response = await handler(validBody);
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody).toEqual({
        title: 'Message Sent',
        status: 200,
      });
    });

    it('propagates marlimar errors', async () => {
      sendOutboundMessage.mockRejectedValueOnce(new Error('marlimar unavailable'));
      await expect(handler(validBody)).rejects.toThrow('marlimar unavailable');
    });
  });
});
