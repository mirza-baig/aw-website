import type { EnumField } from './enum-field';

/**
 * Extracts enum values from a Sitecore multiselect field.
 *
 * @typeParam T The type of the enum values.
 * @param field Optional multiselect enum fields.
 * @returns Ordered enum values excluding missing or falsy values, or undefined when no field is provided.
 */
export function getEnumsFromMultiselectField<T>(field?: EnumField<T>[]): T[] | undefined {
  return field?.map((_) => _.fields?.Value?.value).filter((_): _ is T => !!_);
}
