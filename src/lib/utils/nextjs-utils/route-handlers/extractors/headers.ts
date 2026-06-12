import { Flags } from 'lib/utils/regexp-utils/flags';
import { asterikPatternToRegExp } from 'lib/utils/string-utils/asterik-pattern-to-regexp';
import { NextRequest } from 'next/server';

import { Extractor } from './extractor';

type HeadersParams = string | RegExp | (string | RegExp)[];

/**
 * Extracts keys and values from the request headers based on provided keys or patterns.
 * If no keys or patterns are provided, it extracts all headers.
 * Patterns can be specified using asterisks (*), which will be converted to regular expressions.
 * @param headers (optional) a string, regular expression, or array of strings or regular expressions of keys to extract
 * @returns an object containing found keys and their values
 */
export function headers(headers?: HeadersParams): Extractor {
  if (headers != undefined && !Array.isArray(headers)) {
    headers = [headers];
  }
  const headerRegex = headers?.map((patternOrRegExp) =>
    patternOrRegExp instanceof RegExp
      ? patternOrRegExp
      : asterikPatternToRegExp(patternOrRegExp, Flags.ignoreCase)
  );
  return async function headerExtractor(request: NextRequest): Promise<unknown> {
    if (request == undefined || request == null) {
      return {};
    }

    const entries: [PropertyKey, unknown][] = [];

    for (const [key, value] of request.headers.entries()) {
      if (headerRegex == undefined || headerRegex.some((regex) => regex.test(key))) {
        entries.push([key, value]);
      }
    }

    return Object.fromEntries(entries);
  };
}
