import { XmlElement } from '@rgrove/parse-xml';
import { BaseBoostAction } from 'lib/coveo/expressions/actions/base-boost-action';
import { RuleContext } from 'lib/rules/rule-context';

import { IActionFactoryContext } from '../action-factory-context';

export const CoveoBoostActionId = '{6B180206-55BF-448D-9095-3145963041AE}';

export class CoveoBoostAction<TContext extends RuleContext> extends BaseBoostAction<TContext> {
  constructor(condition: XmlElement, _context: IActionFactoryContext) {
    const weight = parseFloat(condition.attributes.weight ?? '0');
    super(true, weight);
  }
}
