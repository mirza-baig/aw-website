import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { AWSitecoreClient } from 'lib/sitecore-client';

export type BreadcrumbItem = {
  name: string;
  href: string;
};

type BreadcrumbFields = {
  breadcrumbTitle: {
    value: string;
  };
  pageTitle: {
    value: string;
  };
  url: {
    path: string;
  };
};

type Breadcrumb = {
  contextItem: {
    breadcrumbTitle: {
      value: string;
    };
    pageTitle: {
      value: string;
    };
    url: {
      path: string;
    };
    ancestors: BreadcrumbFields[];
  };
};

const breadcrumbQuery = /* GraphQL */ `
  query BreadcrumbQuery($componentItemId: String!, $language: String!) {
    contextItem: item(path: $componentItemId, language: $language) {
      ...breadcrumbFields
      ancestors(hasLayout: true, includeTemplateIDs: "${SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.BaseTemplates._BasePage.Id}") {
        ...breadcrumbFields
      }
    }
  }

  fragment breadcrumbFields on Item {
    breadcrumbTitle: field(name: "breadcrumbTitle") {
      ... on TextField {
        value
      }
    }
    pageTitle: field(name: "pageTitle") {
      ... on TextField {
        value
      }
    }
    url {
      path
    }
  }
`;

export class BreadcrumbService {
  constructor(public options: { sitecoreClient: AWSitecoreClient }) {}

  async getBreadcrumbData(componentItemId?: string, language?: string): Promise<BreadcrumbItem[]> {
    const result = await this.options.sitecoreClient.getData<Breadcrumb>(breadcrumbQuery, {
      // The GraphQL query does not like empty string for the condition for some reason
      componentItemId: componentItemId ?? 'null',
      language: language ?? 'en',
    });

    const breadcrumbList: BreadcrumbItem[] = [];

    if (result.contextItem) {
      if (result.contextItem.ancestors.length > 0) {
        const ancestors = result.contextItem.ancestors;
        ancestors.reverse();

        // Add the ancestors to the array
        ancestors.forEach((item) => {
          breadcrumbList.push({
            name: item.breadcrumbTitle?.value ?? item.pageTitle?.value ?? '',
            href: item.url?.path ?? '',
          });
        });
      }

      // Add the current page context info to the array
      breadcrumbList.push({
        name:
          result.contextItem.breadcrumbTitle?.value ?? result.contextItem.pageTitle?.value ?? '',
        href: result.contextItem.url?.path ?? '',
      });
    }

    return breadcrumbList;
  }
}
