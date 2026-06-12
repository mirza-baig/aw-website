import { QueryNode } from '../query-nodes/query-node';

export abstract class UnaryNode implements QueryNode {
  public operand: QueryNode;

  constructor(operand: QueryNode) {
    this.operand = operand;
  }

  abstract getExpression(): string;
}
