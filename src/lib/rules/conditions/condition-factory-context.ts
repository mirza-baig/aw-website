import { XmlElement } from '@rgrove/parse-xml';
import { FutureResult } from 'lib/graphql/item-fetcher/future-result';

import { RuleCondition } from '../rule-condition';
import { RuleContext } from '../rule-context';

export type ConditionConstructor = new (
  element: XmlElement,
  context: IConditionFactoryContext
) => RuleCondition<RuleContext>;

export interface IConditionFactoryContext {
  readonly conditionMap: Map<string, ConditionConstructor>;
  getItem(idOrPath: string, language?: string): FutureResult;
}
