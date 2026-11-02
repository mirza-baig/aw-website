import { RuleContext } from 'lib/rules/rule-context';
import { getRulesFromXmlString } from 'lib/rules/utils/get-rules-from-xml-string';
import { isNotNullOrUndefined } from 'lib/utils/filter-utils/is-not-null-or-undefined';

import { CoveoCondition } from '../expressions/conditions/coveo-condition';
import { CoveoRule } from '../expressions/coveo-rule';
import { getAction } from './get-action';
import { getCondition } from './get-condition';
import { ParseRulesContext } from './parse-rules-context';
import { Item } from 'lib/graphql/item-fetcher/item';

export async function parseRulesFromXmlString<TContext extends RuleContext>(
  value: string,
  context: ParseRulesContext<TContext>
): Promise<{ rules:CoveoRule<TContext>[], fetchedItems: Item[] }> {
  const rules = getRulesFromXmlString(value, context).rules;
  await context.fetchItems();
  const coveoRules: CoveoRule<TContext>[] = [];

  for (const rule of rules) {
    let condition: CoveoCondition | undefined = undefined;
    if (rule.condition != undefined) {
      condition = getCondition(rule.condition);
    }
    const actions = rule.actions.map((action) => getAction(action)).filter(isNotNullOrUndefined);

    coveoRules.push(new CoveoRule<TContext>(actions, condition));
  }

  const fetchedItems = context.itemBatch.results.filter(isNotNullOrUndefined);

  return { rules: coveoRules, fetchedItems };
}
