import { RuleContext } from './rule-context';

export abstract class RuleAction<TContext extends RuleContext> {
  uid?: string;
  id?: string;

  abstract apply(ruleContext: TContext): void;
}
