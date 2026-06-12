import { OrNode } from '../expressions/query-nodes/or-node';
import { QueryNode } from '../expressions/query-nodes/query-node';
import { joinWithUnaryBuilder } from './join-with-unary-builder';

export function joinWithOrNode(nodes: QueryNode[]): QueryNode {
  return joinWithUnaryBuilder(nodes, (left, right) => new OrNode(left, right));
}
