import { XmlElement } from '@rgrove/parse-xml';
import { BaseBoostAction } from 'lib/coveo/expressions/actions/base-boost-action';
import { RuleContext } from 'lib/rules/rule-context';

import { IActionFactoryContext } from '../action-factory-context';

export const CoveoReduceBoostActionId = '{28CC203F-895D-43AC-83DB-C103353D9A62}';

export class CoveoReduceBoostAction<
  TContext extends RuleContext,
> extends BaseBoostAction<TContext> {
  constructor(condition: XmlElement, _context: IActionFactoryContext) {
    const weight = parseFloat(condition.attributes.weight ?? '0');
    super(false, weight);
  }
}
