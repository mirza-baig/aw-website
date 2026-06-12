import { RuleContext } from '../../rule-context';
import { WhenCondition } from './when-condition';

export class TrueCondition<TContext extends RuleContext> extends WhenCondition<TContext> {
  execute(_ruleContext: TContext) {
    return true;
  }
}
