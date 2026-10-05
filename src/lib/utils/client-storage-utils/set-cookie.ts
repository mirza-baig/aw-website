/**
 * Sets a browser cookie with an expiration time and path.
 *
 * @param cookieName The name of the cookie to set.
 * @param cookieValue The value to store in the cookie.
 * @param expiryTime The cookie expiration date string.
 * @param path The cookie path, defaulting to `/`.
 * @returns Nothing. The cookie is written through `document.cookie`.
 */
export function setCookie(
  cookieName: string,
  cookieValue: unknown,
  expiryTime: string,
  path = '/'
): void {
  document.cookie = `${cookieName}=${cookieValue}; expires=${expiryTime}; path=${path}`;
}
