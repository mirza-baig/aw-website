/**
 * Truncates a number to the requested number of decimal digits without rounding.
 *
 * @param number The number to truncate.
 * @param digits The number of decimal digits to retain.
 * @returns The truncated number, or the original number when truncation is not applicable.
 */
export function truncate(number: number, digits: number): number {
  const re = new RegExp(String.raw`(\d+\.\d{${digits}})(\d)`),
    m = re.exec(number.toString());
  return m ? Number.parseFloat(m[1]) : number.valueOf();
}
