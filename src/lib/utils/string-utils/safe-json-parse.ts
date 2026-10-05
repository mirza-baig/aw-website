/**
 * Safely parses JSON text.
 *
 * @typeParam T The expected type of the parsed value.
 * @param input The JSON text to parse.
 * @returns The parsed value, or undefined when the input is invalid JSON.
 */
export function safeJsonParse<T = unknown>(input: string): T | undefined {
  try {
    return JSON.parse(input) as T;
  } catch {
    return undefined;
  }
}
