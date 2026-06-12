import { Flags } from 'lib/utils/regexp-utils/flags';
import { asterikPatternToRegExp } from 'lib/utils/string-utils/asterik-pattern-to-regexp';
import { NextRequest } from 'next/server';

import { Extractor } from './extractor';

type CookieParams = string | RegExp | (string | RegExp)[];

/**
 * Extracts names and values from the request cookies based on provided names or patterns.
 * If no names or patterns are provided, it extracts all cookies.
 * Patterns can be specified using asterisks (*), which will be converted to regular expressions.
 * @param names (optional) a string, regular expression, or array of strings or regular expressions of names to extract
 * @returns an object containing found names and their values
 */
export function cookies(names?: CookieParams): Extractor {
  if (names != undefined && !Array.isArray(names)) {
    names = [names];
  }
  const nameRegex = names?.map((patternOrRegExp) =>
    patternOrRegExp instanceof RegExp
      ? patternOrRegExp
      : asterikPatternToRegExp(patternOrRegExp, Flags.ignoreCase)
  );
  return async function cookieExtractor(request: NextRequest): Promise<unknown> {
    if (request == undefined || request == null) {
      return {};
    }

    const entries: [PropertyKey, unknown][] = [];

    const cookieEntries = request.cookies.getAll();

    for (const { name, value } of cookieEntries) {
      if (nameRegex == undefined || nameRegex.some((regex) => regex.test(name))) {
        entries.push([name, value]);
      }
    }

    return Object.fromEntries(entries);
  };
}
