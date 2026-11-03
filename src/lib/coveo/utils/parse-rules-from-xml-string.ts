import { RuleContext } from 'lib/rules/rule-context';
import { getRulesFromXmlString } from 'lib/rules/utils/get-rules-from-xml-string';
import { isNotNullOrUndefined } from 'lib/utils/filter-utils/is-not-null-or-undefined';

import { CoveoCondition } from '../expressions/conditions/coveo-condition';
import { CoveoRule } from '../expressions/coveo-rule';
import { getAction } from './get-action';
import { getCondition } from './get-condition';
import { ParseRulesContext } from './parse-rules-context';

export async function parseRulesFromXmlString<T extends RuleContext>(
  value: string,
  context: ParseRulesContext<T>
): Promise<CoveoRule<T>[]> {
  const rules = getRulesFromXmlString(value, context).rules;
  await context.fetchItems();
  const result: CoveoRule<T>[] = [];

  for (const rule of rules) {
    let condition: CoveoCondition | undefined = undefined;
    if (rule.condition != undefined) {
      condition = getCondition(rule.condition);
    }
    const actions = rule.actions.map((action) => getAction(action)).filter(isNotNullOrUndefined);

    result.push(new CoveoRule<T>(actions, condition));
  }

  return result;
}
