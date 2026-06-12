import { faker } from '@faker-js/faker';
import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';

import { bodyAsJson } from './body-as-json';

describe('lib > utils > nextjs-utils > route-handlers > extractors > body-as-json', async () => {
  it('returns an empty object for undefined', async () => {
    const result = await bodyAsJson(undefined as unknown as NextRequest);

    expect(result).toEqual({});
  });

  it('returns an empty object for null', async () => {
    const result = await bodyAsJson(null as unknown as NextRequest);

    expect(result).toEqual({});
  });

  it('returns an empty object for invalid json', async () => {
    const request = {
      json: async () => {
        throw new Error('invalid json');
      },
    } as unknown as NextRequest;

    const result = await bodyAsJson(request);

    expect(result).toEqual({});
  });

  it('returns the json object', async () => {
    const object = {
      [faker.word.words()]: faker.lorem.sentence(),
    };
    const request = {
      json: async () => object,
    } as unknown as NextRequest;

    const result = await bodyAsJson(request);

    expect(result).toEqual(object);
  });
});
