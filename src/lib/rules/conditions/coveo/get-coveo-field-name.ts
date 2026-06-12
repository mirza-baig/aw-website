import { Item, ItemTextField } from 'lib/graphql/item-fetcher/item';

export function getCoveoFieldName(item: Item): string {
  const valueField = item.fields.find(
    (field) => field.name == 'Value' && field.type == 'TextField'
  ) as ItemTextField | undefined;
  if (valueField == undefined) {
    return '';
  }
  return valueField.value;
}
