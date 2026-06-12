import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';

import { buildCoveoRules } from './build-coveo-rules';
import { FilterExpressionBuilder } from './expressions/filter-expression-builder';

export async function buildFilterExpression(xml: string): Promise<string | undefined> {
  if (isNullOrWhitespace(xml)) {
    return '';
  }
  const rules = await buildCoveoRules(xml);
  const builder = new FilterExpressionBuilder();
  builder.addFilterRules(rules);
  const expression = builder.buildExpression();
  return expression;
}
