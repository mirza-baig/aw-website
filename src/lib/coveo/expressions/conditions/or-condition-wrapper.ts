import { getCondition } from 'lib/coveo/utils/get-condition';
import { OrCondition } from 'lib/rules/conditions/sitecore/or-condition';
import { RuleContext } from 'lib/rules/rule-context';

import { OrNode } from '../query-nodes/or-node';
import { QueryNode } from '../query-nodes/query-node';
import { ConditionWrapper } from './condition-wrapper';
import { CoveoCondition } from './coveo-condition';

export class OrConditionWrapper<TContext extends RuleContext> extends ConditionWrapper<
  OrCondition<TContext>
> {
  protected get leftOperand(): CoveoCondition {
    return getCondition(this.condition.leftOperand);
  }

  protected get rightOperand(): CoveoCondition {
    return getCondition(this.condition.rightOperand);
  }

  getQueryNode(): QueryNode {
    return new OrNode(this.leftOperand.getQueryNode(), this.rightOperand.getQueryNode());
  }
}
