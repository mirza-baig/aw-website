import { isUrlSafeChar } from './is-url-safe-char';

export function encodeUrl(string: string) {
  const parts = [];
  for (let i = 0; i < string.length; i++) {
    const ch = string.charAt(i);
    if (isUrlSafeChar(ch)) {
      parts.push(ch);
    } else if (ch === ' ') {
      parts.push('+');
    } else {
      parts.push(encodeURIComponent(ch));
    }
  }
  return parts.join('');
}
