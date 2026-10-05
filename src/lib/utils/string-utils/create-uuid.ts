/**
 * Generates a version 4 UUID with a valid variant.
 *
 * @returns A randomly generated version 4 UUID string.
 */
export function createUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.trunc(Math.random() * 16), //NOSONAR - this is an acceptable RNG
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
