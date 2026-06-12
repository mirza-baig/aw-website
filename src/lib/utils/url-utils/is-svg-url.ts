export function isSvgUrl(src: string | undefined) {
  if (src == undefined) {
    return false;
  }

  try {
    return new URL(src, 'https://server').pathname.endsWith('.svg');
  } catch (error) {
    console.error('Invalid image src `' + src + '` - ' + error);
    return false;
  }
}
