import { RuleContext } from '../../rule-context';
import { WhenCondition } from './when-condition';

export class LayoutCondition<TContext extends RuleContext> extends WhenCondition<TContext> {
  execute(_ruleContext: TContext): boolean {
    throw new Error('Method not implemented.');
  }
}
