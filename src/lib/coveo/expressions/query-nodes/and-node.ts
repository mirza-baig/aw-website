import { BinaryNode } from './binary-node';

export class AndNode extends BinaryNode {
  getExpression(): string {
    return `(${this.leftOperand.getExpression()} ${this.rightOperand.getExpression()})`;
  }
}
