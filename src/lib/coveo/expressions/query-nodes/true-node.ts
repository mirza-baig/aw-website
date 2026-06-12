import { QueryNode } from '../query-nodes/query-node';

export class TrueNode implements QueryNode {
  getExpression(): string {
    return '@uri';
  }
}
