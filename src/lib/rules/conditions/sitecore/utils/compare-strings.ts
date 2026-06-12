import { isEqualIgnoreCase } from 'lib/utils/string-utils/is-equal-ignore-case';

import { StringConditionOperator } from '../string-condition-operator';
import { getStringConditionOperatorById } from './get-string-condition-operator-by-id';

export const compareStrings = (
  value1: string,
  value2: string,
  conditionOperatorId: string
): boolean => {
  const conditionOperator = getStringConditionOperatorById(conditionOperatorId);
  switch (conditionOperator) {
    case StringConditionOperator.Equals:
      return value1 === value2;
    case StringConditionOperator.CaseInsensitivelyEquals:
      return isEqualIgnoreCase(value1, value2);
    case StringConditionOperator.NotEqual:
      return value1 !== value2;
    case StringConditionOperator.NotCaseInsensitivelyEquals:
      return !isEqualIgnoreCase(value1, value2);
    case StringConditionOperator.Contains:
      return value1.indexOf(value2) >= 0;
    case StringConditionOperator.MatchesRegularExpression:
      return new RegExp(value1).test(value2);
    case StringConditionOperator.EndsWith:
      return value1.toLocaleLowerCase().endsWith(value2.toLocaleLowerCase());
    case StringConditionOperator.StartsWith:
      return value1.toLocaleLowerCase().startsWith(value2.toLocaleLowerCase());
    default:
      return false;
  }
};
