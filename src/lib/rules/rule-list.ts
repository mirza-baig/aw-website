import { Debug } from 'lib/constants/debug';

import { Rule } from './rule';
import { RuleContext } from './rule-context';
import { RuleStack } from './rule-stack';

export class RuleList<TContext extends RuleContext> {
  protected _rules: Rule<TContext>[] = [];

  static fromRule<T extends RuleContext>(rule: Rule<T>) {
    const result = new RuleList<T>();
    result._rules = [rule];
    return result;
  }

  static fromRules<T extends RuleContext>(rules: Rule<T>[]) {
    const result = new RuleList<T>();
    result._rules = rules;
    return result;
  }

  get rules() {
    return this._rules;
  }

  get count() {
    return this._rules.length;
  }

  add(rule: Rule<TContext>) {
    this._rules.push(rule);
  }

  addRange(rules: Rule<TContext>[]) {
    this._rules = [...this._rules, ...rules];
  }

  /// <summary>Executes this rule set.</summary>
  /// <param name="ruleContext">The rule context.</param>
  /// <param name="executedRulesCount">The number of rules, whose actions has been executed.</param>
  run(context: TContext): number {
    return this.runRules(context, false);
  }

  /// <summary>
  /// Executes this rule set until any rule condition evaluates to true.
  /// </summary>
  /// <param name="ruleContext">The rule context.</param>
  /// <param name="anyRuleExecuted">Flag indicated whether any rule has been executed.</param>
  runFirstMatching(context: TContext): boolean {
    const rulesCount = this.runRules(context, true);
    return rulesCount > 0;
  }

  protected runRules(ruleContext: TContext, stopOnFirstMatching: boolean): number {
    let executedRulesCount = 0;
    if (this.count == 0) {
      return executedRulesCount;
    }

    for (const rule of this._rules) {
      if (!rule.condition?.canEvaluate(ruleContext)) {
        Debug.rules('Evaluation of rule skipped. Rule item ID: %s', rule.id ?? 'Unknown');
      } else {
        const stack = new RuleStack();
        try {
          rule.condition.evaluate(ruleContext, stack);
        } catch {
          Debug.rules(
            'Evaluation of condition failed. Rule item ID: %s, condition item ID: %s',
            rule.id ?? 'Unknown',
            rule.condition.id ?? 'Unknown'
          );
          ruleContext.abort();
        }
        if (ruleContext.isAborted) {
          return executedRulesCount;
        }
        if (stack.size != 0) {
          if (!stack.pop() || ruleContext.skipRule) {
            ruleContext.skipRule = false;
          } else {
            for (const action of rule.actions) {
              try {
                action.apply(ruleContext);
              } catch {
                Debug.rules(
                  'Execution of action failed. Rule item ID: %s, action item ID: %s',
                  rule.id ?? 'Unknown',
                  action.id ?? 'Unknown'
                );
                ruleContext.abort();
              }
              if (ruleContext.isAborted) {
                return executedRulesCount;
              }
            }
            ++executedRulesCount;
            if (stopOnFirstMatching) {
              break;
            }
          }
        }
      }
    }

    return executedRulesCount;
  }
}
