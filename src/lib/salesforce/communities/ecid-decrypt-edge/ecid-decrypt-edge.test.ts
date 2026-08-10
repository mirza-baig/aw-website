import { describe, expect, it } from 'vitest';

import { decryptEcidEdge } from './ecid-decrypt-edge';

// ---------------------------------------------------------------------------
// Helpers — use the Web Crypto API so no Node.js built-ins are needed
// ---------------------------------------------------------------------------

/** Generate a random 32-byte (256-bit) AES key, base64-encoded. */
function makeKey(): string {
  const raw = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCodePoint(...raw));
}

/**
 * Simulates Apex Crypto.encryptWithManagedIV('AES256', key, data):
 * prepends a random 16-byte IV to the AES-CBC ciphertext and base64-encodes
 * the combined buffer.
 */
async function encryptManagedIV(plaintext: string, keyB64: string): Promise<string> {
  const keyBytes = Uint8Array.from(atob(keyB64), (c) => c.codePointAt(0) ?? 0);
  const cryptoKey = await crypto.subtle.importKey('raw', keyBytes, { name: 'AES-CBC' }, false, [
    'encrypt',
  ]);
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-CBC', iv },
    cryptoKey,
    new TextEncoder().encode(plaintext)
  );
  const combined = new Uint8Array(16 + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), 16);
  return btoa(String.fromCodePoint(...combined));
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('lib > salesforce > communities > ecid-decrypt-edge > decryptEcidEdge', () => {
  it('returns null when token is empty', async () => {
    expect(await decryptEcidEdge('', makeKey())).toBeNull();
  });

  it('returns null when key is empty', async () => {
    const key = makeKey();
    const token = await encryptManagedIV('abc123:1700000000000', key);
    expect(await decryptEcidEdge(token, '')).toBeNull();
  });

  it('returns null when key is not 32 bytes', async () => {
    const shortKey = btoa('not-32-bytes');
    const key = makeKey();
    const token = await encryptManagedIV('abc123:1700000000000', key);
    expect(await decryptEcidEdge(token, shortKey)).toBeNull();
  });

  it('returns null when token decodes to 16 bytes or fewer (no ciphertext beyond IV)', async () => {
    // 16 bytes of data → buffer.length === IV_LENGTH, no ciphertext
    const tooShort = btoa(String.fromCodePoint(...new Uint8Array(16)));
    expect(await decryptEcidEdge(tooShort, makeKey())).toBeNull();
  });

  it('returns null when decryption fails (wrong key)', async () => {
    const correctKey = makeKey();
    const wrongKey = makeKey();
    const token = await encryptManagedIV('abc123:1700000000000', correctKey);
    expect(await decryptEcidEdge(token, wrongKey)).toBeNull();
  });

  it('returns null when plaintext contains no colon separator', async () => {
    const key = makeKey();
    const token = await encryptManagedIV('abc123-no-colon', key);
    expect(await decryptEcidEdge(token, key)).toBeNull();
  });

  it('returns null when the contactId portion is empty', async () => {
    const key = makeKey();
    // Format ":timestamp" — contactId is the empty string before the colon
    const token = await encryptManagedIV(':1700000000000', key);
    expect(await decryptEcidEdge(token, key)).toBeNull();
  });

  it('returns the contactId for a valid token', async () => {
    const key = makeKey();
    const token = await encryptManagedIV('SF-CONTACT-001:1700000000000', key);
    expect(await decryptEcidEdge(token, key)).toBe('SF-CONTACT-001');
  });

  it('ignores everything after the first colon (timestamp)', async () => {
    const key = makeKey();
    const token = await encryptManagedIV('SF-CONTACT-002:1700000000000:extra', key);
    expect(await decryptEcidEdge(token, key)).toBe('SF-CONTACT-002');
  });

  it('handles URL-encoded tokens where + has been decoded as space', async () => {
    const key = makeKey();
    // encryptManagedIV may produce base64 with '+'; simulate URL-decoding by
    // replacing '+' with ' ' before passing to decryptEcidEdge
    const token = await encryptManagedIV('SF-CONTACT-003:1700000000000', key);
    const urlDecoded = token.replaceAll('+', ' ');
    expect(await decryptEcidEdge(urlDecoded, key)).toBe('SF-CONTACT-003');
  });
});
