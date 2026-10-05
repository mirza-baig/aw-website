'use client';

/**
 * Decodes HTML entities while preserving markup as text.
 *
 * @param string The HTML-encoded string to decode.
 * @returns The decoded string.
 */
export function decodeHtml(string: string): string {
  const decodeTextArea = document.createElement('textarea');

  decodeTextArea.innerHTML = string;
  return decodeTextArea.value;
}
