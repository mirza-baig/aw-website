export function isUrlSafeChar(ch: string): boolean {
  if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9')) {
    return true;
  }

  switch (ch) {
    case '-':
    case '_':
    case '.':
    case '!':
    case '*':
    case '(':
    case ')':
      return true;
  }

  return false;
}
