import { AndNode } from '../expressions/query-nodes/and-node';
import { QueryNode } from '../expressions/query-nodes/query-node';
import { joinWithUnaryBuilder } from './join-with-unary-builder';

export function joinWithAndNode(nodes: QueryNode[]): QueryNode {
  return joinWithUnaryBuilder(nodes, (left, right) => new AndNode(left, right));
}
