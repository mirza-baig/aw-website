export function setCookie(
  cookieName: string,
  cookieValue: unknown,
  expiryTime: string,
  path = '/'
): void {
  document.cookie = `${cookieName}=${cookieValue}; expires=${expiryTime}; path=${path}`;
}
