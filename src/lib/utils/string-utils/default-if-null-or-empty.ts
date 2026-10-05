import { isNullOrEmpty } from './is-null-or-empty';

/**
 * Returns `defaultValue` when `value` is null, undefined, or empty.
 *
 * Whitespace-only strings are preserved because they are not empty.
 *
 * @param value The string to evaluate.
 * @param defaultValue The value to return for null, undefined, or empty input.
 * @returns The original value, or `defaultValue` when the original is null, undefined, or empty.
 */
export function defaultIfNullOrEmpty(
  value: string | null | undefined,
  defaultValue: string
): string {
  if (isNullOrEmpty(value)) {
    return defaultValue;
  }

  return value;
}
