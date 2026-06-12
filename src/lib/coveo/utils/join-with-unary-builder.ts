import { Stack } from 'lib/utils/stack';

import { QueryNode } from '../expressions/query-nodes/query-node';
import { TrueNode } from '../expressions/query-nodes/true-node';

export function joinWithUnaryBuilder(
  nodes: QueryNode[],
  builder: (left: QueryNode, right: QueryNode) => QueryNode
): QueryNode {
  const stack = new Stack<QueryNode>({ initialValue: nodes });
  if (stack.size == 0) {
    return new TrueNode();
  }
  while (stack.size > 1) {
    const left = stack.pop()!;
    const right = stack.pop()!;
    const combined = builder(left, right);
    stack.push(combined);
  }
  return stack.peek()!;
}
