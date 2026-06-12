import { RuleAction } from 'lib/rules/rule-action';
import { RuleContext } from 'lib/rules/rule-context';

import { CoveoCondition } from './conditions/coveo-condition';

export class CoveoRule<TContext extends RuleContext> {
  public readonly actions: RuleAction<TContext>[];
  public readonly condition: CoveoCondition | undefined;

  constructor(actions: RuleAction<TContext>[], condition?: CoveoCondition) {
    this.actions = [...actions];
    this.condition = condition;
  }
}
