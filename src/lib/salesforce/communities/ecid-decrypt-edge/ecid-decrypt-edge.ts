const IV_LENGTH = 16; // AES block size

/**
 * Converts a base64 string to a Uint8Array without using Buffer (Edge runtime compatible).
 */
function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.codePointAt(i) ?? 0;
  }
  return bytes;
}

/**
 * Edge-runtime-compatible version of decryptEcid.
 * Uses the Web Crypto API (crypto.subtle) instead of node:crypto.
 *
 * Decrypts a Salesforce Communities managed-IV AES-256 encrypted ecid token.
 *
 * @param token  Base64-encoded string from the ?sf_ecid= query param
 * @param keyB64 Base64-encoded AES-256 key (32 bytes) from environment config
 * @returns The Salesforce Contact ID string, or null on any error
 */
export async function decryptEcidEdge(token: string, keyB64: string): Promise<string | null> {
  if (!token || !keyB64) {
    return null;
  }

  try {
    // When a standard base64 token is embedded in a URL query string without encoding,
    // '+' is decoded as a space by URL parsers (application/x-www-form-urlencoded).
    // Restore '+' before decoding so the buffer is correct.
    const normalizedToken = token.replaceAll(' ', '+');
    const encryptedBuffer = base64ToUint8Array(normalizedToken);

    if (encryptedBuffer.length <= IV_LENGTH) {
      return null;
    }

    const iv = encryptedBuffer.slice(0, IV_LENGTH);
    const ciphertext = encryptedBuffer.slice(IV_LENGTH);

    const keyBytes = base64ToUint8Array(keyB64);
    if (keyBytes.length !== 32) {
      return null;
    }

    const cryptoKey = await crypto.subtle.importKey('raw', keyBytes, { name: 'AES-CBC' }, false, [
      'decrypt',
    ]);

    const decrypted = await crypto.subtle.decrypt({ name: 'AES-CBC', iv }, cryptoKey, ciphertext);

    const plaintext = new TextDecoder().decode(decrypted);

    // Expected format: "<contactId>:<timestamp_ms>"
    const colonIndex = plaintext.indexOf(':');
    if (colonIndex === -1) {
      return null;
    }

    const contactId = plaintext.substring(0, colonIndex);
    return contactId.length > 0 ? contactId : null;
  } catch {
    // Invalid token, wrong key, or padding error — treat as no identifier
    return null;
  }
}
