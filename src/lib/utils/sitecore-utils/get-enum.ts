import { EnumField } from './enum-field';

/**
 * Reads the value from a nested enum field.
 *
 * @typeParam T The type of the enum value.
 * @param field The optional enum field to read.
 * @returns The nested enum value, or undefined when it is unavailable.
 */
export function getEnum<T>(field?: EnumField<T>): T | undefined {
  return field?.fields?.Value?.value;
}
