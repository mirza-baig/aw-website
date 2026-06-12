import { BinaryNode } from './binary-node';

export class OrNode extends BinaryNode {
  getExpression(): string {
    return `(${this.leftOperand.getExpression()} OR ${this.rightOperand.getExpression()})`;
  }
}
