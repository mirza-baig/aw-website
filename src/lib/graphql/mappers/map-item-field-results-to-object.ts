import { ItemFieldResult } from '../types/item-field-result';

export function mapItemFieldResultsToObject(
  fields: ItemFieldResult[],
  property: 'jsonValue' | 'value' = 'jsonValue'
) {
  if (fields === undefined) {
    return {};
  }
  const entries = fields.map((entry) => [entry.name, entry[property]]);
  const result = Object.fromEntries(entries);
  return result;
}
