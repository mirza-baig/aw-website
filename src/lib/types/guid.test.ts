import { afterEach, describe, expect, it, vi } from 'vitest';

import { Guid } from './guid';

describe('lib > types > guid', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([
    'c138c30ac0b3456fa547e9b1e6197eb4',
    'c138c30a-c0b3-456f-a547-e9b1e6197eb4',
    '{C138C30A-C0B3-456F-A547-E9B1E6197EB4}',
    '(c138c30a-c0b3-456f-a547-e9b1e6197eb4)',
  ])('recognizes %s as a guid', (value) => {
    expect(Guid.isGuid(value)).toBe(true);
  });

  it.each(['not-a-guid', '', null, undefined])('rejects %s as a guid', (value) => {
    expect(Guid.isGuid(value)).toBe(false);
  });

  it('returns the expected string formats', () => {
    const guid = new Guid('c138c30ac0b3456fa547e9b1e6197eb4');

    expect(guid.toString()).toBe('c138c30ac0b3456fa547e9b1e6197eb4');
    expect(guid.toString('D')).toBe('c138c30a-c0b3-456f-a547-e9b1e6197eb4');
    expect(guid.toString('B')).toBe('{c138c30a-c0b3-456f-a547-e9b1e6197eb4}');
    expect(guid.toString('P')).toBe('(c138c30a-c0b3-456f-a547-e9b1e6197eb4)');
  });

  it('throws for an unknown string format', () => {
    const guid = new Guid('c138c30ac0b3456fa547e9b1e6197eb4');

    expect(() => guid.toString('unknown')).toThrow("Guid!toString: Unknown format 'unknown'.");
  });

  it('returns the parsed guid or the empty guid from tryParse', () => {
    const parsed = Guid.tryParse('c138c30a-c0b3-456f-a547-e9b1e6197eb4');
    const invalid = Guid.tryParse('invalid');

    expect(parsed.success).toBe(true);
    expect(parsed.guid.toString()).toBe('c138c30ac0b3456fa547e9b1e6197eb4');
    expect(invalid.success).toBe(false);
    expect(invalid.guid).toBe(Guid.empty);
  });

  it('serializes to an object containing the compact value', () => {
    const guid = new Guid('c138c30ac0b3456fa547e9b1e6197eb4');

    expect(guid.toJSON()).toEqual({ value: 'c138c30ac0b3456fa547e9b1e6197eb4' });
  });

  it('creates a deterministic guid when Math.random returns zero', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    expect(Guid.newGuid().toString('D')).toBe('00000000-0000-0000-0000-000000000000');
  });

  it('identifies only the empty singleton as empty', () => {
    expect(Guid.empty.isEmpty).toBe(true);
    expect(new Guid('00000000-0000-0000-0000-000000000000').isEmpty).toBe(false);
  });
});
