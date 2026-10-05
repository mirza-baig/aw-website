/**
 * Reads a cookie value from the browser document.
 *
 * @param cookieName The name of the cookie to retrieve.
 * @returns The raw cookie value, or undefined when running server-side or when the cookie is not found.
 */
export function getCookie(cookieName: string): unknown {
  // SSR guard
  if (typeof document === 'undefined') {
    return undefined;
  }

  const regex = new RegExp(`(^| )${cookieName}=([^;]+)`);
  const match = regex.exec(document.cookie);
  if (match) {
    return match[2];
  } else {
    console.log(`something went wrong while reading ${cookieName}`);
    return undefined;
  }
}
