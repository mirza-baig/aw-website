/**
 * Determines whether a value is neither null nor undefined.
 *
 * @param value The value to check.
 * @returns True when the value is present, narrowing it to `T`; otherwise false.
 */
export function isNotNullOrUndefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
