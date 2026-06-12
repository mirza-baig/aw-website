import { RuleCondition } from '../../rule-condition';
import { RuleContext } from '../../rule-context';
import { RuleStack } from '../../rule-stack';

export abstract class BinaryCondition<T extends RuleContext> extends RuleCondition<T> {
  public readonly leftOperand: RuleCondition<T>;
  public readonly rightOperand: RuleCondition<T>;

  constructor(leftOperand: RuleCondition<T>, rightOperand: RuleCondition<T>) {
    super();
    this.leftOperand = leftOperand;
    this.rightOperand = rightOperand;
  }

  evaluate(ruleContext: T, stack: RuleStack) {
    this.leftOperand.evaluate(ruleContext, stack);
    this.rightOperand.evaluate(ruleContext, stack);
  }

  canEvaluate(ruleContext: T) {
    return this.leftOperand.canEvaluate(ruleContext) && this.rightOperand.canEvaluate(ruleContext);
  }
}
