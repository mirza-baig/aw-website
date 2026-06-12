import { faker } from '@faker-js/faker';
import type { Debugger } from 'debug';
import sendGridService from 'lib/send-grid-service';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createSendEmailHandler, sendEmailSchema as schema } from './send-email-submit-action';

const handler = createSendEmailHandler(vi.fn() as unknown as Debugger);

const validBody = {
  to: [faker.internet.email()],
  from: faker.internet.email(),
  subject: faker.lorem.sentence(),
  body: faker.lorem.paragraphs(),
};

describe('lib > shared-form-submit-actions > send-email > send-email-submit-action', () => {
  describe('schema', () => {
    it('requires to', async () => {
      expect(await schema.isValid({ ...validBody, to: undefined })).toBe(false);
    });

    it('rejects an empty to array', async () => {
      expect(await schema.isValid({ ...validBody, to: [] })).toBe(false);
    });

    it('rejects invalid email in to', async () => {
      expect(await schema.isValid({ ...validBody, to: ['not-an-email'] })).toBe(false);
    });

    it('requires from', async () => {
      expect(await schema.isValid({ ...validBody, from: undefined })).toBe(false);
    });

    it('rejects invalid email in from', async () => {
      expect(await schema.isValid({ ...validBody, from: 'not-an-email' })).toBe(false);
    });

    it('requires subject', async () => {
      expect(await schema.isValid({ ...validBody, subject: undefined })).toBe(false);
    });

    it('requires body', async () => {
      expect(await schema.isValid({ ...validBody, body: undefined })).toBe(false);
    });

    it('accepts multiple to addresses', async () => {
      const body = { ...validBody, to: [faker.internet.email(), faker.internet.email()] };
      expect(await schema.isValid(body)).toBe(true);
    });

    it('accepts a valid payload', async () => {
      expect(await schema.isValid(validBody)).toBe(true);
    });
  });

  describe('handler', () => {
    const sendEmail = vi.spyOn(sendGridService, 'sendEmail').mockResolvedValue(undefined);

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('sends the email with a sanitized payload', async () => {
      await handler({
        to: ['  User@Example.COM  '],
        from: '  Sender@Example.COM  ',
        subject: '  Hello World  ',
        body: '  Email body  ',
      });

      expect(sendEmail).toHaveBeenCalledWith({
        to: ['user@example.com'],
        from: 'sender@example.com',
        subject: 'Hello World',
        body: 'Email body',
        isHtml: true,
      });
    });

    it('returns a success response', async () => {
      const response = await handler(validBody);
      const responseBody = await response.json();
      expect(response.status).toBe(200);
      expect(responseBody).toEqual({ title: 'Email Send Accepted', status: 200 });
    });

    it('calls sendEmail once per request', async () => {
      await handler(validBody);
      expect(sendEmail).toHaveBeenCalledTimes(1);
    });
  });
});
