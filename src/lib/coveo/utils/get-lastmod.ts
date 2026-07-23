import { normalizeSitecoreDateString } from 'lib/utils/string-utils/normalize-sitecore-date-string';

import { getDateField, IndexableItem } from '../indexing';

export function getLastModifiedDate(item: IndexableItem): Date | undefined {
  const updated = getDateField(item.fields, '__Updated');
  if (updated?.value) {
    return new Date(normalizeSitecoreDateString(updated.value));
  }

  const created = getDateField(item.fields, '__Created');
  if (created?.value) {
    return new Date(normalizeSitecoreDateString(created.value));
  }

  return undefined;
}
