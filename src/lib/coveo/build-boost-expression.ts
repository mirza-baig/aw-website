import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';

import { buildCoveoRules } from './build-coveo-rules';
import { BoostExpressionBuilder } from './expressions/boost-expression-builder';

export async function buildBoostExpression(xml: string): Promise<string | undefined> {
  if (isNullOrWhitespace(xml)) {
    return '';
  }
  const rules = await buildCoveoRules(xml);
  const builder = new BoostExpressionBuilder();
  builder.addBoostingRules(rules);
  const expression = builder.buildExpression();
  return expression;
}
