import { faker } from '@faker-js/faker';
import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';

import { bodyAsText } from './body-as-text';

describe('lib > utils > nextjs-utils > route-handlers > extractors > body-as-text', async () => {
  it('returns an empty string for undefined', async () => {
    const result = await bodyAsText(undefined as unknown as NextRequest);

    expect(result).toEqual('');
  });

  it('returns an empty string for null', async () => {
    const result = await bodyAsText(null as unknown as NextRequest);

    expect(result).toEqual('');
  });

  it('returns an empty string for invalid text', async () => {
    const request = {
      text: async () => {
        throw new Error('invalid text');
      },
    } as unknown as NextRequest;

    const result = await bodyAsText(request);

    expect(result).toEqual('');
  });

  it('returns the text content', async () => {
    const text = faker.lorem.sentence();
    const request = {
      text: async () => text,
    } as unknown as NextRequest;

    const result = await bodyAsText(request);

    expect(result).toEqual(text);
  });
});
