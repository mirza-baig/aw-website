import { FalseNode } from '../query-nodes/false-node';
import { ConditionWrapper } from './condition-wrapper';
import { CoveoCondition } from './coveo-condition';

export class NotSupportedConditionWrapper<TCondition> extends ConditionWrapper<TCondition> {
  protected get operand(): CoveoCondition {
    return this.operand;
  }

  public getQueryNode() {
    return new FalseNode();
  }
}
