import { faker } from '@faker-js/faker';
import externalDbService from 'lib/external-db';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { objectContainsKey } from 'vitest-mock-extended';

import { handler, schema } from './post';

const validBody = {
  formId: faker.string.uuid(),
  sessionId: faker.string.uuid(),
  name: faker.word.noun(),
  lines: [
    {
      fieldId: faker.string.uuid(),
      name: faker.word.noun(),
      type: faker.word.noun(),
      value: faker.word.noun(),
    },
  ],
};

describe('app > api > aw > custom-forms > submit-actions > save-to-database', async () => {
  describe('schema', () => {
    it('requires formId', async () => {
      const invalidBody = { ...validBody, formId: undefined };
      const isValid = await schema.isValid(invalidBody);
      expect(isValid).toBe(false);
    });
    it('requires name', async () => {
      const invalidBody = { ...validBody, name: undefined };
      const isValid = await schema.isValid(invalidBody);
      expect(isValid).toBe(false);
    });
    it('does not require sessionId', async () => {
      const invalidBody = { ...validBody, sessionId: undefined };
      const isValid = await schema.isValid(invalidBody);
      expect(isValid).toBe(true);
    });
    describe('lines', () => {
      it('requires formId', async () => {
        const invalidBody = {
          ...validBody,
          lines: [{ ...validBody.lines[0], fieldId: undefined }],
        };
        const isValid = await schema.isValid(invalidBody);
        expect(isValid).toBe(false);
      });
      it('requires name', async () => {
        const invalidBody = {
          ...validBody,
          lines: [{ ...validBody.lines[0], name: undefined }],
        };
        const isValid = await schema.isValid(invalidBody);
        expect(isValid).toBe(false);
      });
      it('requires type', async () => {
        const invalidBody = {
          ...validBody,
          lines: [{ ...validBody.lines[0], type: undefined }],
        };
        const isValid = await schema.isValid(invalidBody);
        expect(isValid).toBe(false);
      });
      describe('value', () => {
        it('accepts null', async () => {
          const invalidBody = {
            ...validBody,
            lines: [{ ...validBody.lines[0], value: null }],
          };
          const isValid = await schema.isValid(invalidBody);
          expect(isValid).toBe(true);
        });
        it('accepts an array', async () => {
          const invalidBody = {
            ...validBody,
            lines: [{ ...validBody.lines[0], value: [faker.word.noun(), faker.word.noun()] }],
          };
          const isValid = await schema.isValid(invalidBody);
          expect(isValid).toBe(true);
        });
      });
    });
  });

  describe('handler', async () => {
    const createOrUpdateEntForm = vi
      .spyOn(externalDbService, 'createOrUpdateEntForm')
      .mockResolvedValue({
        success: true,
        headerId: '',
        sessionId: '',
        formId: '',
      });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('saves the data to the database', async () => {
      await handler(validBody);
      expect(createOrUpdateEntForm).toHaveBeenCalledWith(
        expect.objectContaining({
          formId: validBody.formId,
          sessionId: validBody.sessionId,
          formName: validBody.name,
          lines: [
            {
              fieldId: validBody.lines[0].fieldId,
              fieldName: validBody.lines[0].name,
              fieldType: validBody.lines[0].type,
              fieldValue: validBody.lines[0].value,
            },
          ],
        })
      );
    });

    it('concatenates field values', async () => {
      const value1 = faker.word.noun();
      const value2 = faker.word.noun();
      const body = {
        ...validBody,
        lines: [{ ...validBody.lines[0], value: [value1, value2] }],
      };
      await handler(body);
      expect(createOrUpdateEntForm).toHaveBeenCalledWith(
        expect.objectContaining({
          formId: validBody.formId,
          sessionId: validBody.sessionId,
          formName: validBody.name,
          lines: [
            {
              fieldId: validBody.lines[0].fieldId,
              fieldName: validBody.lines[0].name,
              fieldType: validBody.lines[0].type,
              fieldValue: `${value1},${value2}`,
            },
          ],
        })
      );
    });

    it('returns a success response', async () => {
      const response = await handler(validBody);
      const responseBody = await response.json();
      expect(response.status).toBe(201);
      expect(responseBody).toEqual({ title: 'Form Saved', status: 201 });
    });

    it('generates a sessionId if not provided', async () => {
      const body = { ...validBody, sessionId: undefined };
      await handler(body);
      expect(createOrUpdateEntForm).toHaveBeenCalledWith(objectContainsKey('sessionId'));
    });
  });
});
