'use server';

import { buildSitecoreItemCacheTag } from 'lib/cache/build-sitecore-item-cache-tag';
import { ItemChildrenService } from 'lib/graphql/item-children-service';
import sitecoreClient from 'lib/sitecore-client';
import { cacheTag } from 'next/cache';
import { CountryItem, StateItem } from './address-field-types';

type DatasourceResult = {
  id: string;
  title: {
    value: string;
  };
  value: {
    value: string;
  };
};

const query = /* GraphQL */ `
  query DatasourceQuery(
    $parentId: String!
    $titleName: String!
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
          title: field(name: $titleName) {
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

export async function getCountryStateOptions(
  parentId: string,
  titleName: string,
  valueName: string
): Promise<CountryItem[]> {
  'use cache';

  const itemChildrenService = new ItemChildrenService<DatasourceResult>({ sitecoreClient });
  const results = await itemChildrenService.fetchAllResults(query, {
    parentId,
    titleName,
    valueName,
  });

  const countries = results.map(async (item) => {
    const results2 = await itemChildrenService.fetchAllResults(query, {
      parentId: item.id,
      titleName,
      valueName,
    });

    const states: StateItem[] = results2.map((stateItem) => ({
      id: stateItem.id,
      title: stateItem.title.value,
      value: stateItem.value.value,
    }));

    return {
      id: item.id,
      title: item.title.value,
      value: item.value.value,
      states: states,
    };
  });

  const allCountries = await Promise.all(countries);

  allCountries.forEach((country) => {
    cacheTag(buildSitecoreItemCacheTag({ itemId: country.id, locale: 'en' }));
    country.states.forEach((state) => {
      cacheTag(buildSitecoreItemCacheTag({ itemId: state.id, locale: 'en' }));
    });
  });

  return allCountries;
}

export async function getStateOptions(
  parentId: string,
  titleName: string,
  valueName: string
): Promise<StateItem[]> {
  'use cache';

  const itemChildrenService = new ItemChildrenService<DatasourceResult>({ sitecoreClient });
  const results = await itemChildrenService.fetchAllResults(query, {
    parentId,
    titleName,
    valueName,
  });

  const states = results.map((item) => ({
    id: item.id,
    title: item.title.value,
    value: item.value.value,
  }));

  states.forEach((state) => {
    cacheTag(buildSitecoreItemCacheTag({ itemId: state.id, locale: 'en' }));
  });

  return states;
}
