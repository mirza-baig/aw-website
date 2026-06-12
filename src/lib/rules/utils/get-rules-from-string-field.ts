import { Field } from '@sitecore-content-sdk/nextjs';

import { RuleContext } from '../rule-context';
import { RuleList } from '../rule-list';
import { GetRulesContext } from './get-rules-context';
import { getRulesFromXmlString } from './get-rules-from-xml-string';

export function getRulesFromStringField<TContext extends RuleContext>(
  field: Field<string>,
  context: GetRulesContext<TContext>,
  id?: string
): RuleList<TContext> {
  return getRulesFromXmlString(field.value, context, id);
}
