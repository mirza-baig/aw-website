// Not sure if this is the best way to do this, but it works
export function decodeHtml(string: string): string {
  const decodeTextArea = document.createElement('textarea');

  decodeTextArea.innerHTML = string;
  return decodeTextArea.value;
}
