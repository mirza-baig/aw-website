import { Flags } from 'lib/utils/regexp-utils/flags';
import { asterikPatternToRegExp } from 'lib/utils/string-utils/asterik-pattern-to-regexp';
import { NextRequest } from 'next/server';

import { Extractor } from './extractor';

type SearchParamsParams = string | RegExp | (string | RegExp)[];

/**
 * Extracts keys and values from the request URL search params based on provided keys or patterns.
 * If no keys or patterns are provided, it extracts all search params.
 * Patterns can be specified using asterisks (*), which will be converted to regular expressions.
 * @param searchParams (optional) a string, regular expression, or array of strings or regular expressions of keys to extract
 * @returns an object containing found keys and their values
 */
export function searchParams(searchParams?: SearchParamsParams): Extractor {
  if (searchParams != undefined && !Array.isArray(searchParams)) {
    searchParams = [searchParams];
  }
  const searchParamsRegex = searchParams?.map((patternOrRegExp) =>
    patternOrRegExp instanceof RegExp
      ? patternOrRegExp
      : asterikPatternToRegExp(patternOrRegExp, Flags.ignoreCase)
  );
  return async function searchParamsExtractor(request: NextRequest): Promise<unknown> {
    if (request == undefined || request == null) {
      return {};
    }

    const entries: [PropertyKey, unknown][] = [];

    for (const [key, value] of request.nextUrl.searchParams.entries()) {
      if (searchParamsRegex == undefined || searchParamsRegex.some((regex) => regex.test(key))) {
        entries.push([key, value]);
      }
    }

    return Object.fromEntries(entries);
  };
}
