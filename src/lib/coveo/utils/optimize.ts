import { AndNode } from '../expressions/query-nodes/and-node';
import { BinaryNode } from '../expressions/query-nodes/binary-node';
import { FalseNode } from '../expressions/query-nodes/false-node';
import { NotNode } from '../expressions/query-nodes/not-node';
import { OrNode } from '../expressions/query-nodes/or-node';
import { QueryNode } from '../expressions/query-nodes/query-node';
import { TrueNode } from '../expressions/query-nodes/true-node';
import { UnaryNode } from '../expressions/query-nodes/unary-node';
import { VoidNode } from '../expressions/query-nodes/void-node';

export function optimize(node: QueryNode): QueryNode | null {
  let result: QueryNode | null = null;
  if (node != null) {
    result = optimizeNode(node);
  }
  if (result != null && result instanceof VoidNode) {
    result = null;
  }
  return result;
}

function optimizeNode(node: QueryNode): QueryNode {
  if (node instanceof BinaryNode) {
    return optimizeBinaryNode(node);
  }
  if (node instanceof UnaryNode) {
    return optimizeUnaryNode(node);
  }
  return node;
}

function optimizeBinaryNode(node: BinaryNode): QueryNode {
  node.leftOperand = optimizeNode(node.leftOperand);
  node.rightOperand = optimizeNode(node.rightOperand);
  let result: QueryNode = optimizeBinaryVoidOperands(node);
  if (result instanceof BinaryNode) {
    if (result instanceof AndNode) {
      result = optimizeAndNodeOperands(result);
    }
    if (result instanceof OrNode) {
      result = optimizeOrNodeOperands(result);
    }
  }
  return result;
}

function optimizeBinaryVoidOperands(node: BinaryNode): QueryNode {
  if (node.leftOperand instanceof VoidNode) {
    return node.rightOperand;
  }
  if (node.rightOperand instanceof VoidNode) {
    return node.leftOperand;
  }
  return node;
}

function optimizeAndNodeOperands(node: AndNode): QueryNode {
  let result: QueryNode = node;
  if (node.leftOperand instanceof TrueNode) {
    result = node.rightOperand;
  } else if (node.rightOperand instanceof TrueNode) {
    result = node.leftOperand;
  } else if (node.leftOperand instanceof FalseNode) {
    result = node.leftOperand;
  } else if (node.rightOperand instanceof FalseNode) {
    result = node.rightOperand;
  }
  return result;
}

function optimizeOrNodeOperands(node: OrNode): QueryNode {
  let result: QueryNode = node;
  if (node.leftOperand instanceof TrueNode) {
    result = node.leftOperand;
  } else if (node.rightOperand instanceof TrueNode) {
    result = node.rightOperand;
  } else if (node.leftOperand instanceof FalseNode) {
    result = node.rightOperand;
  } else if (node.rightOperand instanceof FalseNode) {
    result = node.leftOperand;
  }
  return result;
}

function optimizeUnaryNode(node: UnaryNode): QueryNode {
  node.operand = optimizeNode(node.operand);
  let result: QueryNode = optimizeUnaryVoidOperand(node);
  if (result instanceof NotNode) {
    result = optimizeNotNodeOperand(result);
  }
  return result;
}

function optimizeUnaryVoidOperand(node: UnaryNode): QueryNode {
  if (node.operand instanceof VoidNode) {
    return node.operand;
  }
  return node;
}

function optimizeNotNodeOperand(node: NotNode): QueryNode {
  if (node.operand instanceof TrueNode) {
    return new FalseNode();
  }
  if (node.operand instanceof FalseNode) {
    return new TrueNode();
  }
  return node;
}
