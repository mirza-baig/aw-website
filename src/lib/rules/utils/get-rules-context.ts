import { XmlElement } from '@rgrove/parse-xml';
import { FutureResult } from 'lib/graphql/item-fetcher/future-result';
import { ItemBatch } from 'lib/graphql/item-fetcher/item-batch';
import { AWSitecoreClient } from 'lib/sitecore-client';

import { ActionConstructor, IActionFactoryContext } from '../actions/action-factory-context';
import { buildActionFactory } from '../actions/build-action-factory';
import { buildConditionFactory } from '../conditions/build-condition-factory';
import {
  ConditionConstructor,
  IConditionFactoryContext,
} from '../conditions/condition-factory-context';
import { RuleAction } from '../rule-action';
import { RuleCondition } from '../rule-condition';
import { RuleContext } from '../rule-context';

export class GetRulesContext<TContext extends RuleContext>
  implements IActionFactoryContext, IConditionFactoryContext
{
  protected readonly conditionFactory: (element: XmlElement) => RuleCondition<TContext> | null;
  protected readonly actionFactory: (element: XmlElement) => RuleAction<TContext> | null;
  protected readonly itemBatch: ItemBatch;

  constructor(
    public readonly conditionMap: Map<string, ConditionConstructor>,
    public readonly actionMap: Map<string, ActionConstructor>,
    public readonly sitecoreClient: AWSitecoreClient
  ) {
    this.conditionFactory = buildConditionFactory(this);
    this.actionFactory = buildActionFactory(this);
    this.itemBatch = new ItemBatch(this.sitecoreClient);
  }

  getCondition(element: XmlElement): RuleCondition<TContext> | null {
    return this.conditionFactory(element);
  }

  getAction(element: XmlElement): RuleAction<TContext> | null {
    return this.actionFactory(element);
  }

  getItem(idOrPath: string, language: string = 'en'): FutureResult {
    return this.itemBatch.item(idOrPath, language);
  }

  async fetchItems() {
    await this.itemBatch.execute();
  }
}
