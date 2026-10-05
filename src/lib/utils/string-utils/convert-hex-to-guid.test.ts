import { describe, expect, it } from 'vitest';

import { convertHexToGUID } from './convert-hex-to-guid';

describe('lib > utils > string-utils > convert-hex-to-guid', () => {
  it('converts a 32-character hexadecimal string to a guid', () => {
    expect(convertHexToGUID('c138c30ac0b3456fa547e9b1e6197eb4')).toBe(
      'c138c30a-c0b3-456f-a547-e9b1e6197eb4'
    );
  });

  it('preserves the casing of the input', () => {
    expect(convertHexToGUID('C138C30AC0B3456FA547E9B1E6197EB4')).toBe(
      'C138C30A-C0B3-456F-A547-E9B1E6197EB4'
    );
  });

  it('leaves an already formatted guid unchanged', () => {
    const guid = 'c138c30a-c0b3-456f-a547-e9b1e6197eb4';

    expect(convertHexToGUID(guid)).toBe(guid);
  });

  it('leaves strings shorter than 32 characters unchanged', () => {
    expect(convertHexToGUID('c138c30ac0b3456f')).toBe('c138c30ac0b3456f');
  });
});
