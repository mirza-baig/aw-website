import { describe, expect, it } from 'vitest';

import { Stack } from './stack';

describe('lib > types > stack', () => {
  it('starts empty and returns undefined when empty', () => {
    const stack = new Stack<string>();

    expect(stack.size).toBe(0);
    expect(stack.peek()).toBe(undefined);
    expect(stack.pop()).toBe(undefined);
  });

  it('pushes and pops items in last-in-first-out order', () => {
    const stack = new Stack<string>();

    stack.push('first');
    stack.push('second');

    expect(stack.size).toBe(2);
    expect(stack.pop()).toBe('second');
    expect(stack.pop()).toBe('first');
    expect(stack.size).toBe(0);
  });

  it('peeks at the latest item without removing it', () => {
    const stack = new Stack<string>({ initialValue: ['first', 'second'] });

    expect(stack.peek()).toBe('second');
    expect(stack.size).toBe(2);
  });

  it('copies the initial value array', () => {
    const initialValue = ['first'];
    const stack = new Stack<string>({ initialValue });

    initialValue.push('second');

    expect(stack.size).toBe(1);
    expect(stack.pop()).toBe('first');
  });

  it('throws when pushing beyond capacity', () => {
    const stack = new Stack<string>({ capacity: 1 });

    stack.push('first');

    expect(() => stack.push('second')).toThrow(
      'Stack has reached max capacity, you cannot add more items'
    );
  });
});
