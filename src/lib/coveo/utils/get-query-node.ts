import { RuleContext } from 'lib/rules/rule-context';

import { CoveoRule } from '../expressions/coveo-rule';
import { QueryNode } from '../expressions/query-nodes/query-node';
import { joinWithAndNode } from './join-with-and-node';

export function getQueryNode<TContext extends RuleContext>(
  rules: CoveoRule<TContext>[] | CoveoRule<TContext>
): QueryNode | null {
  const ruleArray = Array.isArray(rules) ? rules : [rules];

  return joinWithAndNode(
    ruleArray
      .filter((rule) => rule.condition != undefined)
      .map((rule) => rule.condition!.getQueryNode())
  );
}
