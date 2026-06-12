import { QueryNode } from './query-node';

export class VoidNode implements QueryNode {
  getExpression(): string {
    return '';
  }
}
