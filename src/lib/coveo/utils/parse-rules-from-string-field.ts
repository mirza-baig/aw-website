import { Field } from '@sitecore-content-sdk/nextjs';
import { RuleContext } from 'lib/rules/rule-context';

import { CoveoRule } from '../expressions/coveo-rule';
import { ParseRulesContext } from './parse-rules-context';
import { parseRulesFromXmlString } from './parse-rules-from-xml-string';

export async function parseRulesFromStringField<TContext extends RuleContext>(
  field: Field<string>,
  context: ParseRulesContext<TContext>
): Promise<CoveoRule<TContext>[]> {
  return parseRulesFromXmlString(field.value, context);
}
