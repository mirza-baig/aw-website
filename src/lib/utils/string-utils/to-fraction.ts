/**
 * Converts supported decimal strings to whole-number and fractional notation.
 *
 * Supported decimal strings are:
 * - 0
 * - 0.0625
 * - 0.125
 * - 0.1875
 * - 0.25
 * - 0.3125
 * - 0.375
 * - 0.4375
 * - 0.5
 * - 0.5625
 * - 0.625
 * - 0.6875
 * - 0.75
 * - 0.8125
 * - 0.875
 * - 0.9375
 *
 * @param value The decimal string to convert.
 * @returns The converted string, the original value when unsupported, or undefined.
 */
export function toFraction(value: string | undefined): string | undefined {
  const parts = value?.split('.');

  if (!parts) {
    return undefined;
  }

  if (parts.length === 1) {
    return parts[0];
  }

  switch (parts[1]) {
    case '0':
      return parts[0];
    case '0625':
      return parts[0] + ' 1/16';
    case '125':
      return parts[0] + ' 1/8';
    case '1875':
      return parts[0] + ' 3/16';
    case '25':
      return parts[0] + ' 1/4';
    case '3125':
      return parts[0] + ' 5/16';
    case '375':
      return parts[0] + ' 3/8';
    case '4375':
      return parts[0] + ' 7/16';
    case '5':
      return parts[0] + ' 1/2';
    case '5625':
      return parts[0] + ' 9/16';
    case '625':
      return parts[0] + ' 5/8';
    case '6875':
      return parts[0] + ' 11/16';
    case '75':
      return parts[0] + ' 3/4';
    case '8125':
      return parts[0] + ' 13/16';
    case '875':
      return parts[0] + ' 7/8';
    case '9375':
      return parts[0] + ' 15/16';
    default:
      return value;
  }
}
