import { XmlElement } from '@rgrove/parse-xml';

import { RuleContext } from '../../rule-context';
import { StringOperatorCondition } from './string-operator-condition';

export class WhenField<TContext extends RuleContext> extends StringOperatorCondition<TContext> {
  public readonly fieldName: string;
  public readonly value: string;

  constructor(element: XmlElement) {
    super(element);
    this.value = element.attributes.value ?? '';
    this.fieldName = element.attributes.fieldname ?? '';
  }

  execute(_ruleContext: TContext): boolean {
    throw new Error('Method not implemented.');
  }
}
