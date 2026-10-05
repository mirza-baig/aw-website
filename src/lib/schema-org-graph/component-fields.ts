import { mapItemFieldResultsToObject } from 'lib/graphql/mappers/map-item-field-results-to-object';
import { ItemFieldResult } from 'lib/graphql/types/item-field-result';

type IntegratedComponentFields = {
  data?: {
    item?: {
      fields?: ItemFieldResult[];
    };
  };
};

export function getComponentFields(fields: unknown): unknown {
  if (!fields || typeof fields !== 'object') {
    return fields;
  }

  const integratedFields = fields as IntegratedComponentFields;
  const itemFields = integratedFields.data?.item?.fields;

  return Array.isArray(itemFields) ? mapItemFieldResultsToObject(itemFields) : fields;
}
