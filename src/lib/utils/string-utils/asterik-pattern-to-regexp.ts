import { Flags } from 'lib/utils/regexp-utils/flags';
import { flagsToFlagString } from 'lib/utils/regexp-utils/flags-to-flag-string';

// Workaround for the fact that the definition for RegExp.escape was not added until TypeScript 6
// This can be removed once we upgrade to TypeScript 6
declare global {
  interface RegExpConstructor {
    escape(str: string): string;
  }
}

/**
 * Converts an asterisk wildcard pattern into an anchored regular expression.
 *
 * `*` matches any sequence of characters; other pattern characters are escaped.
 * Matching is case-sensitive unless an ignore-case flag is supplied.
 *
 * @param pattern The pattern text where `*` represents a wildcard.
 * @param flags Optional RegExp flags as a flag string or `Flags` bitmask.
 * @returns A regular expression that matches the entire input string.
 */
export function asterikPatternToRegExp(pattern: string, flags?: string | Flags): RegExp {
  const flagsString = typeof flags === 'string' ? flags : flagsToFlagString(flags);

  const escapedPattern = RegExp.escape(pattern);

  // stars should be treated as wildcards
  const regExpPattern = escapedPattern.replaceAll(String.raw`\*`, '.*');

  const regExp = new RegExp(`^${regExpPattern}$`, flagsString);

  return regExp;
}
