import { getCondition } from 'lib/coveo/utils/get-condition';
import { AndCondition } from 'lib/rules/conditions/sitecore/and-condition';
import { RuleContext } from 'lib/rules/rule-context';

import { AndNode } from '../query-nodes/and-node';
import { QueryNode } from '../query-nodes/query-node';
import { ConditionWrapper } from './condition-wrapper';
import { CoveoCondition } from './coveo-condition';

export class AndConditionWrapper<TContext extends RuleContext> extends ConditionWrapper<
  AndCondition<TContext>
> {
  protected get leftOperand(): CoveoCondition {
    return getCondition(this.condition.leftOperand);
  }

  protected get rightOperand(): CoveoCondition {
    return getCondition(this.condition.rightOperand);
  }

  getQueryNode(): QueryNode {
    return new AndNode(this.leftOperand.getQueryNode(), this.rightOperand.getQueryNode());
  }
}
