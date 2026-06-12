import { faker } from '@faker-js/faker';
import transactionalMessagingService from 'lib/salesforce/marketing-cloud/transaction-messaging';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createSfmcTransactionalMessagingSendEmailHandler,
  sfmcTransactionalMessagingSendEmailSchema as schema,
} from './sfmc-transactional-messaging-send-email-submit-action';

const logger = vi.fn() as unknown as import('debug').Debugger;
const handler = createSfmcTransactionalMessagingSendEmailHandler(logger);

const validBody = {
  account: 'AW' as const,
  definitionKey: faker.string.alphanumeric(20),
  recipient: {
    contactKey: faker.string.uuid(),
    to: faker.internet.email(),
    attributes: {
      firstName: faker.person.firstName(),
    },
  },
};

describe('lib > shared-form-submit-actions > sfmc-transactional-messaging-send-email > sfmc-transactional-messaging-send-email-submit-action', () => {
  describe('schema', () => {
    it('requires account', async () => {
      const invalidBody = { ...validBody, account: undefined };
      const isValid = await schema.isValid(invalidBody);
      expect(isValid).toBe(false);
    });

    it('only accepts AW as account', async () => {
      const invalidBody = { ...validBody, account: 'INVALID' };
      const isValid = await schema.isValid(invalidBody);
      expect(isValid).toBe(false);
    });

    it('requires definitionKey', async () => {
      const invalidBody = { ...validBody, definitionKey: undefined };
      const isValid = await schema.isValid(invalidBody);
      expect(isValid).toBe(false);
    });

    it('requires recipient', async () => {
      const invalidBody = { ...validBody, recipient: undefined };
      const isValid = await schema.isValid(invalidBody);
      expect(isValid).toBe(false);
    });

    it('requires recipient.to', async () => {
      const invalidBody = {
        ...validBody,
        recipient: { ...validBody.recipient, to: undefined },
      };
      const isValid = await schema.isValid(invalidBody);
      expect(isValid).toBe(false);
    });

    it('validates recipient.to is an email', async () => {
      const invalidBody = {
        ...validBody,
        recipient: { ...validBody.recipient, to: 'not-an-email' },
      };
      const isValid = await schema.isValid(invalidBody);
      expect(isValid).toBe(false);
    });

    it('does not require contactKey', async () => {
      const body = {
        ...validBody,
        recipient: { ...validBody.recipient, contactKey: undefined },
      };
      const isValid = await schema.isValid(body);
      expect(isValid).toBe(true);
    });

    it('does not require attributes', async () => {
      const body = {
        ...validBody,
        recipient: { ...validBody.recipient, attributes: undefined },
      };
      const isValid = await schema.isValid(body);
      expect(isValid).toBe(true);
    });

    it('accepts a valid payload', async () => {
      const isValid = await schema.isValid(validBody);
      expect(isValid).toBe(true);
    });
  });

  describe('handler', () => {
    const sendEmailToSingleRecipient = vi
      .spyOn(transactionalMessagingService, 'sendEmailToSingleRecipient')
      .mockResolvedValue(undefined);

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('sends the email via SFMC transactional messaging service', async () => {
      await handler(validBody);
      expect(sendEmailToSingleRecipient).toHaveBeenCalledWith(
        expect.objectContaining({
          account: validBody.account,
          definitionKey: validBody.definitionKey,
          recipient: expect.objectContaining({
            to: validBody.recipient.to,
            contactKey: validBody.recipient.contactKey,
          }),
        })
      );
    });

    it('calls sendEmailToSingleRecipient once per request', async () => {
      await handler(validBody);
      expect(sendEmailToSingleRecipient).toHaveBeenCalledTimes(1);
    });

    it('returns a success response', async () => {
      const response = await handler(validBody);
      const responseBody = await response.json();
      expect(response.status).toBe(200);
      expect(responseBody).toEqual({ title: 'Email Sent', status: 200 });
    });
  });
});
