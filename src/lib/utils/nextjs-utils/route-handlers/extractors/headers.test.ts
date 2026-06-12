import { faker } from '@faker-js/faker';
import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';

import { headers } from './headers';

describe('lib > utils > nextjs-utils > route-handlers > extractors > headers', async () => {
  describe('with no parameters', () => {
    const extractor = headers();

    it('returns an empty object for undefined', async () => {
      const result = await extractor(undefined as unknown as NextRequest);

      expect(result).toEqual({});
    });

    it('returns an empty object for null', async () => {
      const result = await extractor(null as unknown as NextRequest);

      expect(result).toEqual({});
    });

    it('returns the object with all the headers', async () => {
      const headersEntries = faker.helpers.multiple(
        () => [faker.word.words(), faker.lorem.sentence()],
        { count: 5 }
      );

      const request = {
        headers: {
          entries() {
            return headersEntries;
          },
        },
      } as unknown as NextRequest;
      const expectedResult = Object.fromEntries(headersEntries);

      const result = await extractor(request);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('with pattern parameters', () => {
    const extractor = headers(['header*']);

    it('returns an empty object for undefined', async () => {
      const result = await extractor(undefined as unknown as NextRequest);

      expect(result).toEqual({});
    });

    it('returns an empty object for null', async () => {
      const result = await extractor(null as unknown as NextRequest);

      expect(result).toEqual({});
    });

    it('returns the object with all the headers', async () => {
      const headersEntries = [
        ['header', faker.lorem.sentence()],
        ['header1', faker.lorem.sentence()],
        ['headerabc', faker.lorem.sentence()],
      ];
      const expectedResult = Object.fromEntries(headersEntries);
      headersEntries.push(['other', faker.lorem.sentence()]);

      const request = {
        headers: {
          entries() {
            return headersEntries;
          },
        },
      } as unknown as NextRequest;

      const result = await extractor(request);

      expect(result).toEqual(expectedResult);
    });
  });
});
