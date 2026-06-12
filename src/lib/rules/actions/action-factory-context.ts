import { XmlElement } from '@rgrove/parse-xml';
import { FutureResult } from 'lib/graphql/item-fetcher/future-result';

import { RuleAction } from '../rule-action';
import { RuleContext } from '../rule-context';

export type ActionConstructor = new (
  element: XmlElement,
  context: IActionFactoryContext
) => RuleAction<RuleContext>;

export interface IActionFactoryContext {
  readonly actionMap: Map<string, ActionConstructor>;
  getItem(idOrPath: string, language?: string): FutureResult;
}
