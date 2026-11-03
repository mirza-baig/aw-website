import { ItemChildrenService } from 'lib/graphql/item-children-service';
import sitecoreClient from 'lib/sitecore-client';

import { Sitecore } from '.sitecore/AndersenWindows.model';

export type ButtonCardItem = Sitecore.Forms.GenericFormBuilder.Datasources.ButtonCardItem & {
  id: string;
};

type DatasourceResult = Omit<
  Sitecore.Forms.GenericFormBuilder.Datasources.ButtonCardItemJson,
  '_AW_TemplateId'
> & {
  id: string;
};

const query = /* GraphQL */ `
  query DatasourceQuery($parentId: String!, $pageSize: Int = 50, $after: String) {
    item(path: $parentId, language: "en") {
      children(first: $pageSize, after: $after) {
        total
        pageInfo {
          hasNext
          endCursor
        }
        results {
          id
          ... on AW_ListItem {
            title {
              jsonValue
            }
            value {
              jsonValue
            }
          }
          ... on AW_ButtonCardItem {
            description {
              jsonValue
            }
            desktopImage {
              jsonValue
            }
            mobileImage {
              jsonValue
            }
          }
        }
      }
    }
  }
`;

export async function getButtonCardItems(parentId: string): Promise<ButtonCardItem[]> {
  const itemChildrenService = new ItemChildrenService<DatasourceResult>({ sitecoreClient });
  const results = await itemChildrenService.fetchAllResults(query, {
    parentId,
  });

  const options: ButtonCardItem[] = results.map((item) => ({
    id: item.id,
    fields: {
      title: item.title.jsonValue,
      value: item.value.jsonValue,
      description: item.description.jsonValue,
      desktopImage: item.desktopImage.jsonValue,
      mobileImage: item.mobileImage.jsonValue,
      _AW_TemplateId: { value: '' },
    },
  }));

  return options;
}
