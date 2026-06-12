import { isNullOrEmpty } from './is-null-or-empty';

/** Returns the default value if the specified string is null, undefined or an empty string ("").
 * Otherwise, returns the specified value */
export const defaultIfNullOrEmpty = (
  value: string | null | undefined,
  defaultValue: string
): string => {
  if (isNullOrEmpty(value)) {
    return defaultValue;
  }

  return value;
};
