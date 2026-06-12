import config from 'aw.config.server';
import { AWSitecoreClient } from 'lib/sitecore-client';

import { FutureResult } from './future-result';
import {
  isLookupField,
  isMultilistField,
  ItemQueryResult,
  ItemQueryResultFields,
} from './graphql-types';
import { Item, ItemFields } from './item';

type ItemId = {
  idOrPath: string;
  language: string;
};

export class ItemBatch {
  protected ids: ItemId[] = [];

  protected _results: (Item | null)[] = [];
  get results() {
    return this._results;
  }

  protected _hasExecuted: boolean = false;
  get hasExecuted() {
    return this._hasExecuted;
  }

  constructor(protected sitecoreClient: AWSitecoreClient) {}

  item(idOrPath: string, language: string = 'en'): FutureResult {
    // Check if this item has already been requested
    let index = this.ids.findIndex(
      (item) => item.idOrPath == idOrPath && item.language == language
    );

    // If not, then add it to the list to query
    if (index == -1) {
      index = this.ids.length;
      this.ids.push({ idOrPath, language });
    }

    // Return a placeholder for the item
    const result = new FutureResult(this, index);
    return result;
  }

  async execute(): Promise<void> {
    if (this.ids.length <= 0) {
      return;
    }

    if (this.hasExecuted) {
      throw new Error('ItemBatch!execute: Batch has already been executed');
    }

    // Break the item requests up into batches
    const batchSize = config.app.role == 'preview' ? 3 : 5;

    const results: (Item | null)[] = [];
    for (let i = 0; i < this.ids.length; i += batchSize) {
      const command = this.buildCommand(i, Math.min(i + batchSize, this.ids.length));
      const result = await this.sitecoreClient.getData<Record<string, ItemQueryResult | null>>(
        command.query,
        command.variables
      );
      results.push(...this.mapQueryResults(result));
    }

    this._hasExecuted = true;
    this._results = results;
  }

  protected buildCommand(
    start: number,
    end: number
  ): { query: string; variables: Record<string, unknown> } {
    const variables: Record<string, unknown> = {};
    const parameters: string[] = [];
    const itemQuery: string[] = [];
    for (let i = 0; i < end; i++) {
      variables[`p${i}`] = this.ids[i + start].idOrPath;
      variables[`l${i}`] = this.ids[i + start].language;
      parameters.push(`$p${i}: String!, $l${i}: String!`);
      itemQuery.push(`i${i}: item(path: $p${i} language: $l${i}) {...ItemFields}`);
    }

    const parameterString = parameters.join(', ');

    const itemQueryString = itemQuery.join('\n');

    const query = `query ItemBatch(${parameterString}) {
    ${itemQueryString}
}
fragment ItemFields on Item {
  id
  name
  language {
    name
  }
  path
  url {
    path
    siteName
  }
  version

  template {
    id
    name
  }
  fields(ownFields: false) {
    ...ValueFields
    ...LinkFields
  }
}
fragment ValueFields on ItemField {
  id
  name
  __typename
  ... on RichTextField {
    value
  }
  ... on NumberField {
    numberValue
  }
  ... on NameValueListField {
    values {
      name
      value
    }
  }
  ... on LinkField {
    anchor
    className
    linkType
    queryString
    text
    url
  }
  ... on TextField {
    value
  }
  ... on IntegerField {
    intValue
  }
  ... on ImageField {
    alt
    height
    width
    src
  }
  ... on DateField {
    value
  }
  ... on CheckboxField {
    boolValue
  }
}
fragment LinkFields on ItemField {
  ... on MultilistField {
    targetItems {
      id
    }
  }
  ... on LookupField {
    targetItem {
      id
    }
  }
}`;

    return { query, variables };
  }

  protected mapQueryResults(queryResults: Record<string, ItemQueryResult | null>): (Item | null)[] {
    const results: (Item | null)[] = [];

    for (let index = 0; index < this.ids.length; index++) {
      const queryResult = queryResults[`i${index}`];

      if (queryResult == null) {
        results.push(null);
        continue;
      }

      const item: Item = {
        id: queryResult.id,
        name: queryResult.name,
        language: queryResult.language.name,
        path: queryResult.path,
        templateId: queryResult.template.id,
        templateName: queryResult.template.name,
        fields: this.mapQueryResultFields(queryResult.fields),
      };
      results.push(item);
    }
    return results;
  }

  protected mapQueryResultFields(fields: ItemQueryResultFields[]): ItemFields[] {
    return fields.map((field) => {
      if (isMultilistField(field)) {
        const { __typename, targetItems, ...rest } = field;
        const mapped: ItemFields = {
          type: __typename,
          targetItems: targetItems?.map((item) => ({
            id: item.id,
          })),
          ...rest,
        };
        return mapped;
      } else if (isLookupField(field)) {
        const { __typename, targetItem, ...rest } = field;
        const mapped: ItemFields = {
          type: __typename,
          targetItem: targetItem
            ? {
                id: targetItem.id,
              }
            : targetItem,
          ...rest,
        };
        return mapped;
      } else {
        const { __typename, ...rest } = field;
        const mapped: ItemFields = { type: __typename, ...rest };
        return mapped;
      }
    });
  }
}
