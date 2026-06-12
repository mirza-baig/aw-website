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
 * Converts a string pattern with asterisks as wildcards into a RegExp.
 * For example, "X*Y" would match "XY", "X123Y", "XabcY", etc.
 * The resulting RegExp is case-insensitive and matches the entire string.
 */
export function asterikPatternToRegExp(pattern: string, flags?: string | Flags): RegExp {
  const flagsString = typeof flags === 'string' ? flags : flagsToFlagString(flags);

  const escapedPattern = RegExp.escape(pattern);

  // stars should be treated as wildcards
  const regExpPattern = escapedPattern.replaceAll(String.raw`\*`, '.*');

  const regExp = new RegExp(`^${regExpPattern}$`, flagsString);

  return regExp;
}
