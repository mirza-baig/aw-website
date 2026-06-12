import { QueryNode } from '../query-nodes/query-node';

export class FalseNode implements QueryNode {
  getExpression(): string {
    return '(NOT @uri)';
  }
}
