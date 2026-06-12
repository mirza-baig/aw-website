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
