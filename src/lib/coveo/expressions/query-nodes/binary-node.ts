import { QueryNode } from '../query-nodes/query-node';

export abstract class BinaryNode implements QueryNode {
  public leftOperand: QueryNode;
  public rightOperand: QueryNode;

  constructor(leftOperand: QueryNode, rightOperand: QueryNode) {
    this.leftOperand = leftOperand;
    this.rightOperand = rightOperand;
  }

  abstract getExpression(): string;
}
