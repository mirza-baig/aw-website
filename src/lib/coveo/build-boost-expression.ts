import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';

import { buildCoveoRules } from './build-coveo-rules';
import { BoostExpressionBuilder } from './expressions/boost-expression-builder';
import { Item } from 'lib/graphql/item-fetcher/item';

export async function buildBoostExpression(xml: string): Promise<{ expression: string | undefined; fetchedItems: Item[] }> {
  if (isNullOrWhitespace(xml)) {
    return { expression: undefined, fetchedItems: [] };
  }
  const { rules, fetchedItems } = await buildCoveoRules(xml);
  const builder = new BoostExpressionBuilder();
  builder.addBoostingRules(rules);
  const expression = builder.buildExpression();
  return { expression, fetchedItems };
}
