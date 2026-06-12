import { QueryNode } from '../query-nodes/query-node';

export interface CoveoCondition {
  getQueryNode(): QueryNode;
}
