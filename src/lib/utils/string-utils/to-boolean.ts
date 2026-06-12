import { isEqualIgnoreCase } from './is-equal-ignore-case';

/**
 * Converts a string value to a boolean value, ignoring case.
 * @param value The value to convert
 * @returns true if value is in ('true', 't', '1', 'yes', 'y')
 */
export function toBoolean(value: string | undefined | null): boolean {
  if (value == undefined || value == null) {
    return false;
  }
  if (
    isEqualIgnoreCase(value, 'true') ||
    isEqualIgnoreCase(value, 't') ||
    value === '1' ||
    isEqualIgnoreCase(value, 'yes') ||
    isEqualIgnoreCase(value, 'y')
  ) {
    return true;
  }
  return false;
}
