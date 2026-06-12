import { RuleContext } from '../rule-context';
import { RuleList } from '../rule-list';
import { GetRulesContext } from './get-rules-context';
import { getRulesFromXmlString } from './get-rules-from-xml-string';

export function getRulesFromJsonValue<TContext extends RuleContext>(
  jsonValue: {
    value: string;
  },
  context: GetRulesContext<TContext>,
  id?: string
): RuleList<TContext> {
  return getRulesFromXmlString(jsonValue.value, context, id);
}
