import { Flags } from './flags';

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
