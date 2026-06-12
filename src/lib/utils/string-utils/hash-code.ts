export function hashCode(s: string) {
  let hash = s.split('').reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

  hash = Math.abs(hash);

  return hash.toString();
}
