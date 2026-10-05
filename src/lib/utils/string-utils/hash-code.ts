/**
 * Generates a deterministic, case-sensitive hash for a string.
 *
 * @param s The string to hash.
 * @returns The absolute 32-bit hash value as a decimal string.
 */
export function hashCode(s: string) {
  let hash = s.split('').reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

  hash = Math.abs(hash);

  return hash.toString();
}
