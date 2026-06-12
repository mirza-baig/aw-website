import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';

import { StringConditionOperator } from '../string-condition-operator';

export const getStringConditionOperatorById = (
  conditionOperatorId: string
): StringConditionOperator => {
  if (isNullOrWhitespace(conditionOperatorId)) {
    return StringConditionOperator.Unknown;
  }
  switch (conditionOperatorId) {
    case '{10537C58-1684-4CAB-B4C0-40C10907CE31}':
      return StringConditionOperator.Equals;
    case '{537244C2-3A3F-4B81-A6ED-02AF494C0563}':
      return StringConditionOperator.CaseInsensitivelyEquals;
    case '{2E67477C-440C-4BCA-A358-3D29AED89F47}':
      return StringConditionOperator.Contains;
    case '{F8641C26-EE27-483C-9FEA-35529ECC8541}':
      return StringConditionOperator.MatchesRegularExpression;
    case '{A6AC5A6B-F409-48B0-ACE7-C3E8C5EC6406}':
      return StringConditionOperator.NotEqual;
    case '{6A7294DF-ECAE-4D5F-A8D2-C69CB1161C09}':
      return StringConditionOperator.NotCaseInsensitivelyEquals;
    case '{22E1F05F-A17A-4D0C-B376-6F7661500F03}':
      return StringConditionOperator.EndsWith;
    case '{FDD7C6B1-622A-4362-9CFF-DDE9866C68EA}':
      return StringConditionOperator.StartsWith;
    default:
      return StringConditionOperator.Unknown;
  }
};
