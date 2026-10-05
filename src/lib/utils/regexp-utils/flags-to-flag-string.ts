import { Flags } from './flags';

/**
 * Converts a bitwise combination of regular expression flags to its string representation.
 *
 * @param flags The optional bitwise combination of regular expression flags.
 * @returns The regular expression flag string in canonical order, or an empty string when no flags are provided.
 */
export function flagsToFlagString(flags?: Flags): string {
  if (flags == undefined) {
    return '';
  }

  let flagsString = '';
  if (flags & Flags.hasIndices) {
    flagsString += 'd';
  }
  if (flags & Flags.global) {
    flagsString += 'g';
  }
  if (flags & Flags.ignoreCase) {
    flagsString += 'i';
  }
  if (flags & Flags.multiline) {
    flagsString += 'm';
  }
  if (flags & Flags.dotAll) {
    flagsString += 's';
  }
  if (flags & Flags.unicode) {
    flagsString += 'u';
  }
  if (flags & Flags.unicodeSets) {
    flagsString += 'v';
  }
  if (flags & Flags.sticky) {
    flagsString += 'y';
  }

  return flagsString;
}
