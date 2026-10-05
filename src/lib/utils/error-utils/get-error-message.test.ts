import { describe, expect, it } from 'vitest';

import { getErrorMessage } from './get-error-message';

describe('lib > utils > error-utils > get-error-message', () => {
  it('returns the message from an Error', () => {
    expect(getErrorMessage(new Error('Something went wrong'))).toBe('Something went wrong');
  });

  it.each([
    [null, 'null'],
    ['message', '"message"'],
    [{ code: 'ERR_INVALID' }, '{"code":"ERR_INVALID"}'],
  ])('serializes non-Error values: %s', (value, expected) => {
    expect(getErrorMessage(value)).toBe(expected);
  });

  it('falls back to String when a value cannot be serialized', () => {
    const circular: { self?: unknown } = {};
    circular.self = circular;

    expect(getErrorMessage(circular)).toBe('[object Object]');
    expect(getErrorMessage(BigInt(123))).toBe('123');
  });

  it('returns undefined when JSON serialization returns undefined', () => {
    expect(getErrorMessage(undefined)).toBe(undefined);
  });
});
