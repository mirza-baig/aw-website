/**
 * Allows approved absolute or relative URI forms for use in links and rejects
 * potentially dangerous protocols such as `javascript:`.
 *
 * Allowed protocols: http, https, ftp, file, mailto, tel
 * Allowed relative paths: /, ./, ../
 *
 * @param uri The URI to validate.
 * @returns The original URI when its protocol or path is allowed; otherwise, an empty string.
 */
export function filterProtocol(uri: string) {
  const isAbsolute = /^(https?|ftp|file|mailto|tel):/i.test(uri);
  const isRelative = /^(\/|\.\/|\.\.\/)/.test(uri);

  return isAbsolute || isRelative ? uri : '';
}
