import { IStack } from './istack';

/** A generic last-in-first-out collection with optional capacity limits. */
export class Stack<T> implements IStack<T> {
  private readonly storage: T[];
  private readonly capacity: number;

  /**
   * Creates a stack.
   *
   * @param options Initial values and an optional maximum capacity.
   * @param options.initialValue Values to place on the stack initially.
   * @param options.capacity Maximum number of items allowed; defaults to unlimited.
   */
  constructor({
    initialValue = [],
    capacity = Infinity,
  }: { initialValue?: T[]; capacity?: number } = {}) {
    this.storage = [...initialValue];
    this.capacity = capacity;
  }

  /**
   * Adds an item to the top of the stack.
   *
   * @param item The item to add.
   * @throws Error when the stack has reached its capacity.
   */
  push(item: T): void {
    if (this.size === this.capacity) {
      throw new Error('Stack has reached max capacity, you cannot add more items');
    }
    this.storage.push(item);
  }

  /**
   * Removes and returns the item at the top of the stack.
   *
   * @returns The most recently added item, or undefined when the stack is empty.
   */
  pop(): T | undefined {
    return this.storage.pop();
  }

  /**
   * Returns the item at the top of the stack without removing it.
   *
   * @returns The most recently added item, or undefined when the stack is empty.
   */
  peek(): T | undefined {
    return this.storage[this.size - 1];
  }

  /** @returns The current number of items in the stack. */
  get size(): number {
    return this.storage.length;
  }
}
