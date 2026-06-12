export interface IStack<T> {
  push(item: T): void;
  pop(): T | undefined;
  peek(): T | undefined;
  get size(): number;
}

export class Stack<T> implements IStack<T> {
  private readonly storage: T[];
  private readonly capacity: number;

  constructor({
    initialValue = [],
    capacity = Infinity,
  }: { initialValue?: T[]; capacity?: number } = {}) {
    this.storage = [...initialValue];
    this.capacity = capacity;
  }

  push(item: T): void {
    if (this.size === this.capacity) {
      throw Error('Stack has reached max capacity, you cannot add more items');
    }
    this.storage.push(item);
  }

  pop(): T | undefined {
    return this.storage.pop();
  }

  peek(): T | undefined {
    return this.storage[this.size - 1];
  }

  get size(): number {
    return this.storage.length;
  }
}
