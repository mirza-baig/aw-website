/**
 * Converts a numeric timestamp to a local date string; otherwise returns the string representation of the value.
 *
 * @param data The value to convert. Numbers are interpreted as timestamps in milliseconds.
 * @returns A local date formatted as `M/D/YYYY`, or `String(data)` for non-numeric values.
 */
export function convertToDate(data: unknown): string {
  if (typeof data == 'number') {
    const formatted = new Date(data);

    const dd = formatted.getDate();
    const yy = formatted.getFullYear();
    const mm = formatted.getMonth() + 1;
    return `${mm}/${dd}/${yy}`;
  } else {
    return String(data);
  }
}
