import { faker } from '@faker-js/faker';
import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';

import { cookies } from './cookies';

describe('lib > utils > nextjs-utils > route-handlers > extractors > cookies', async () => {
  describe('with no parameters', () => {
    const extractor = cookies();

    it('returns an empty object for undefined', async () => {
      const result = await extractor(undefined as unknown as NextRequest);

      expect(result).toEqual({});
    });

    it('returns an empty object for null', async () => {
      const result = await extractor(null as unknown as NextRequest);

      expect(result).toEqual({});
    });

    it('returns the object with all the cookies', async () => {
      const cookiesEntries = faker.helpers.multiple(
        () => [faker.word.words(), faker.lorem.sentence()],
        { count: 5 }
      );
      const request = {
        cookies: {
          getAll() {
            return cookiesEntries.map((entry) => ({ name: entry[0], value: entry[1] }));
          },
        },
      } as unknown as NextRequest;
      const expectedResult = Object.fromEntries(cookiesEntries);

      const result = await extractor(request);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('with pattern parameters', () => {
    const extractor = cookies(['cookie*']);

    it('returns an empty object for undefined', async () => {
      const result = await extractor(undefined as unknown as NextRequest);

      expect(result).toEqual({});
    });

    it('returns an empty object for null', async () => {
      const result = await extractor(null as unknown as NextRequest);

      expect(result).toEqual({});
    });

    it('returns the object with all the cookies', async () => {
      const cookiesEntries = [
        ['cookie', faker.lorem.sentence()],
        ['cookie1', faker.lorem.sentence()],
        ['cookieabc', faker.lorem.sentence()],
      ];
      const expectedResult = Object.fromEntries(cookiesEntries);
      cookiesEntries.push(['other', faker.lorem.sentence()]);

      const request = {
        cookies: {
          getAll() {
            return cookiesEntries.map((entry) => ({ name: entry[0], value: entry[1] }));
          },
        },
      } as unknown as NextRequest;

      const result = await extractor(request);

      expect(result).toEqual(expectedResult);
    });
  });
});
