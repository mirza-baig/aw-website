import { QueryNode } from './query-nodes/query-node';

export class RankingExpression {
  constructor(
    public expression?: QueryNode,
    public modifier: number = 0
  ) {}
}
