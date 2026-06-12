export function getCookieFromString(cookieString: string | null, cookieName: string): unknown {
  if (!cookieName) {
    return undefined;
  }

  const match = cookieString?.match(new RegExp('(^| )' + cookieName + '=([^;]+)'));
  if (match) {
    return match[2];
  } else {
    return undefined;
  }
}
