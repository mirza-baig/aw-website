import { NextRequest } from 'next/server';

import { Extractor } from './extractor';

/**
 * Composes multiple extractors into one, returning an object with the results of each extractor under their respective names.
 *
 * @param extractors an object where keys are the names to assign to the extracted values and values are the corresponding extractor functions
 * @returns an object containing extracted values under their respective names, or an empty object if the request is undefined or null
 */
export async function composite(extractors: { [name: string]: Extractor }): Promise<unknown> {
  return async function compositeExtractor(request: NextRequest): Promise<unknown> {
    if (request == undefined || request == null) {
      return {};
    }

    const entries: [PropertyKey, unknown][] = [];

    for (const [name, extractorFunc] of Object.entries(extractors)) {
      entries.push([name, await extractorFunc(request)]);
    }

    return Object.fromEntries(entries);
  };
}
