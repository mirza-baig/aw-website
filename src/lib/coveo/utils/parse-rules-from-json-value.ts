import { RuleContext } from 'lib/rules/rule-context';

import { CoveoRule } from '../expressions/coveo-rule';
import { ParseRulesContext } from './parse-rules-context';
import { parseRulesFromXmlString } from './parse-rules-from-xml-string';
import { Item } from 'lib/graphql/item-fetcher/item';

export async function parseRulesFromJsonValue<TContext extends RuleContext>(
  jsonValue: {
    value: string;
  },
  context: ParseRulesContext<TContext>
): Promise<{ rules:CoveoRule<TContext>[], fetchedItems: Item[] }> {
  return parseRulesFromXmlString(jsonValue.value, context);
}
