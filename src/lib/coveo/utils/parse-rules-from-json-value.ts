import { RuleContext } from 'lib/rules/rule-context';

import { CoveoRule } from '../expressions/coveo-rule';
import { ParseRulesContext } from './parse-rules-context';
import { parseRulesFromXmlString } from './parse-rules-from-xml-string';

export async function parseRulesFromJsonValue<TContext extends RuleContext>(
  jsonValue: {
    value: string;
  },
  context: ParseRulesContext<TContext>
): Promise<CoveoRule<TContext>[]> {
  return parseRulesFromXmlString(jsonValue.value, context);
}
