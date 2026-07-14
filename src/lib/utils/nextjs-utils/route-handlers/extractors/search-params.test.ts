import { faker } from '@faker-js/faker';
import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';

import { searchParams } from './search-params';

function requestWith(entries: [string, string][]): NextRequest {
  return {
    nextUrl: {
      searchParams: new URLSearchParams(entries),
    },
  } as unknown as NextRequest;
}

describe('lib > utils > nextjs-utils > route-handlers > extractors > search-params', async () => {
  describe('with no parameters', () => {
    const extractor = searchParams();

    it('returns an empty object for undefined', async () => {
      const result = await extractor(undefined as unknown as NextRequest);

      expect(result).toEqual({});
    });

    it('returns an empty object for null', async () => {
      const result = await extractor(null as unknown as NextRequest);

      expect(result).toEqual({});
    });

    it('returns the object with all the search params', async () => {
      const entries: [string, string][] = faker.helpers.multiple(
        () => [faker.word.sample(), faker.lorem.word()] as [string, string],
        { count: 5 }
      );

      const result = await extractor(requestWith(entries));

      expect(result).toEqual(Object.fromEntries(entries));
    });
  });

  describe('with pattern parameters', () => {
    const extractor = searchParams(['param*']);

    it('returns an empty object for undefined', async () => {
      const result = await extractor(undefined as unknown as NextRequest);

      expect(result).toEqual({});
    });

    it('returns an empty object for null', async () => {
      const result = await extractor(null as unknown as NextRequest);

      expect(result).toEqual({});
    });

    it('returns only the search params matching the pattern', async () => {
      const matching: [string, string][] = [
        ['param', faker.lorem.word()],
        ['param1', faker.lorem.word()],
        ['paramabc', faker.lorem.word()],
      ];
      const entries: [string, string][] = [...matching, ['other', faker.lorem.word()]];

      const result = await extractor(requestWith(entries));

      expect(result).toEqual(Object.fromEntries(matching));
    });
  });
});
