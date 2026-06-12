import { XmlElement } from '@rgrove/parse-xml/dist/lib/XmlElement';

import { RuleContext } from '../../rule-context';
import { StringConditionOperator } from './string-condition-operator';
import { compareStrings } from './utils/compare-strings';
import { getStringConditionOperatorById } from './utils/get-string-condition-operator-by-id';
import { WhenCondition } from './when-condition';

export abstract class StringOperatorCondition<
  TContext extends RuleContext,
> extends WhenCondition<TContext> {
  public readonly operatorId: string;

  constructor(element: XmlElement) {
    super();
    this.operatorId = element.attributes.operatorid ?? '{10537C58-1684-4CAB-B4C0-40C10907CE31}';
  }

  protected compare(value1: string, value2: string): boolean {
    return compareStrings(value1, value2, this.operatorId);
  }

  protected getOperator(): StringConditionOperator {
    return getStringConditionOperatorById(this.operatorId);
  }
}
