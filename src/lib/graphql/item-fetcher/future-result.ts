import { Item } from './item';
import { ItemBatch } from './item-batch';

export class FutureResult {
  constructor(
    protected readonly batch: ItemBatch,
    protected readonly key: number
  ) {}

  get result(): Item | null {
    if (!this.batch.hasExecuted) {
      throw new Error('FutureResult!result: Batch has not executed yet or failed');
    }

    return this.batch.results[this.key];
  }
}
