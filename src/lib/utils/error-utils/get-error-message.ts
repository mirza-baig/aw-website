/**
 * Converts an unknown error value into a loggable message.
 *
 * @param error The error or value to convert.
 * @returns The Error message, a JSON representation, or a string fallback. Returns undefined when JSON serialization errs.
 */
export function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}
