import { QueryNode } from '../query-nodes/query-node';
import { VoidNode } from '../query-nodes/void-node';
import { CoveoCondition } from './coveo-condition';

export abstract class ConditionWrapper<TCondition> implements CoveoCondition {
  public readonly condition: TCondition;

  constructor(condition: TCondition) {
    this.condition = condition;
  }

  getQueryNode(): QueryNode {
    return new VoidNode();
  }
}
