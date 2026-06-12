// To generate new codes/hashes, run:
// node scripts/webinar/hash-codes.mjs
// and update .env.local with the new salt and hashes.

import crypto from 'node:crypto';

function sha256Hex(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

function normalize(code) {
  return code.trim().toLowerCase();
}

// 1) Generate a random salt (or reuse an existing one to keep the same hashes):
const salt = crypto.randomUUID().replaceAll('-', '');

// 2) List your raw codes exactly as you’ll share with users:
const codes = ['and2026', 'and2o26'];

const digest = (c) => sha256Hex(`${salt}:${normalize(c)}`);

const hashes = codes.map(digest);

console.log('Salt:', salt);
console.log('Codes:', codes);
console.log('Hashes (hex):');
console.log(JSON.stringify(hashes, null, 2));
