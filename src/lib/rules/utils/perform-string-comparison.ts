export const IS_EQUAL_TO = '{10537C58-1684-4CAB-B4C0-40C10907CE31}';
export const IS_EQUAL_TO_IGNORE_CASE = '{537244C2-3A3F-4B81-A6ED-02AF494C0563}';
export const IS_NOT_EQUAL_TO = '{A6AC5A6B-F409-48B0-ACE7-C3E8C5EC6406}';
export const IS_NOT_EQUAL_TO_IGNORE_CASE = '{6A7294DF-ECAE-4D5F-A8D2-C69CB1161C09}';
export const CONTAINS = '{2E67477C-440C-4BCA-A358-3D29AED89F47}';
export const MATCHES_REGEX = '{F8641C26-EE27-483C-9FEA-35529ECC8541}';
export const ENDS_WITH = '{22E1F05F-A17A-4D0C-B376-6F7661500F03}';
export const STARTS_WITH = '{FDD7C6B1-622A-4362-9CFF-DDE9866C68EA}';

export function performStringComparison(value: string, operatorid: string, compareTo: string) {
  const normalizedValue = value ?? '';
  const normalizedCompareTo = compareTo ?? '';
  switch (operatorid) {
    case IS_EQUAL_TO:
      return normalizedValue === normalizedCompareTo;
    case IS_EQUAL_TO_IGNORE_CASE:
      return normalizedValue.toLowerCase() === normalizedCompareTo.toLowerCase();
    case IS_NOT_EQUAL_TO:
      return normalizedValue !== normalizedCompareTo;
    case IS_NOT_EQUAL_TO_IGNORE_CASE:
      return normalizedValue.toLowerCase() !== normalizedCompareTo.toLowerCase();
    case CONTAINS:
      return normalizedValue.indexOf(normalizedCompareTo) >= 0;
    case MATCHES_REGEX: {
      const regex = new RegExp(normalizedCompareTo);
      return regex.test(normalizedValue);
    }
    case ENDS_WITH:
      return normalizedValue.endsWith(normalizedCompareTo);
    case STARTS_WITH:
      return normalizedValue.startsWith(normalizedCompareTo);
    default:
      return false;
  }
}
