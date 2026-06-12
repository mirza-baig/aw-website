import { RuleAction } from 'lib/rules/rule-action';
import { RuleContext } from 'lib/rules/rule-context';

export abstract class BaseBoostAction<TContext extends RuleContext> extends RuleAction<TContext> {
  public isPositiveBoost: boolean;
  public weight: number;

  constructor(isPositiveBoost: boolean, weight: number) {
    super();
    this.isPositiveBoost = isPositiveBoost;
    this.weight = weight;
  }

  apply(_ruleContext: TContext): void {
    /* Nothing to do here */
  }

  public getEffectiveWeight(): number {
    return this.isPositiveBoost ? this.weight : -this.weight;
  }
}
