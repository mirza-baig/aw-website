import { UnaryNode } from './unary-node';

export class NotNode extends UnaryNode {
  getExpression(): string {
    return `NOT ${this.operand.getExpression()}`;
  }
}
