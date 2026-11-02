import { buildSitecoreItemCacheTag } from 'lib/cache/build-sitecore-item-cache-tag';
import { ItemChildrenService } from 'lib/graphql/item-children-service';
import sitecoreClient from 'lib/sitecore-client';
import { cacheTag } from 'next/cache';

export type OptionItem = {
  id: string;
  label: string;
  value: string;
};

type DatasourceResult = {
  id: string;
  label: {
    value: string;
  };
  value: {
    value: string;
  };
};

const query = /* GraphQL */ `
  query DatasourceQuery(
    $parentId: String!
    $labelName: String!
    $valueName: String!
    $pageSize: Int = 50
    $after: String
  ) {
    item(path: $parentId, language: "en") {
      children(first: $pageSize, after: $after) {
        total
        pageInfo {
          hasNext
          endCursor
        }
        results {
          id
          label: field(name: $labelName) {
            value
          }
          value: field(name: $valueName) {
            value
          }
        }
      }
    }
  }
`;

export async function getOptionItems(
  parentId: string,
  labelName: string,
  valueName: string
): Promise<OptionItem[]> {
  'use cache';

  const itemChildrenService = new ItemChildrenService<DatasourceResult>({ sitecoreClient });
  const results = await itemChildrenService.fetchAllResults(query, {
    parentId,
    labelName,
    valueName,
  });

  const options = results.map((item) => ({
    id: item.id,
    label: item.label.value,
    value: item.value.value,
  }));

  options.forEach((option) => {
    cacheTag(buildSitecoreItemCacheTag({ itemId: option.id, locale: 'en' }));
  });

  return options;
}
