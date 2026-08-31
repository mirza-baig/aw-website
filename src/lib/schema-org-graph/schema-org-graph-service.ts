import { AWSitecoreClient } from 'lib/sitecore-client';

import { Sitecore } from '.sitecore/AndersenWindows.model';

const VALUE_FIELDS_FRAGMENT = /* GraphQL */ `
  fragment ValueFields on ItemField {
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
`;

const LINK_FIELDS_FRAGMENT = /* GraphQL */ `
  fragment LinkFields on ItemField {
    ... on MultilistField {
      targetItems {
        id
        name
        url {
          path
        }
        fields {
          ...ValueFields
        }
      }
    }
    ... on LookupField {
      targetItem {
        template {
          id
        }
        id
        name
        fields {
          ...ValueFields
        }
      }
    }
  }
`;

const SETTINGS_SCHEMA_QUERY = /* GraphQL */ `
  query SettingsSchemaQuery($path: String!, $language: String = "en") {
    item(path: $path, language: $language) {
      ... on AW_JSSSettings {
        schemaOrgGraph {
          ... on MultilistField {
            targetItems {
              fields {
                ...ValueFields
                ...LinkFields
              }
            }
          }
        }
      }
    }
  }
  ${VALUE_FIELDS_FRAGMENT}
  ${LINK_FIELDS_FRAGMENT}
`;

export class SchemaOrgGraphService {
  constructor(private readonly sitecoreClient: AWSitecoreClient) {}

  async getSettingsSchemaOrgGraph(
    rootPath: string,
    locale: string
  ): Promise<Sitecore.BaseTemplates.BaseSchemaOrgGraph[]> {
    try {
      const results = await this.sitecoreClient.getData<{
        item: {
          schemaOrgGraph?: {
            __typename?: string;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            targetItems?: any[];
          };
        };
      }>(SETTINGS_SCHEMA_QUERY, {
        path: `${rootPath}/Settings`,
        language: locale,
      });
      return (results.item?.schemaOrgGraph?.targetItems ??
        []) as Sitecore.BaseTemplates.BaseSchemaOrgGraph[];
    } catch (error) {
      console.error('Error fetching settings schemaOrgGraph:', error);
      return [];
    }
  }
}
