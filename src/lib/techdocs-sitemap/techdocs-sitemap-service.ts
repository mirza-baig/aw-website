import { SiteInfo } from '@sitecore-content-sdk/nextjs';
import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { SearchQueryService } from 'lib/graphql/search-query-service';
import { AWSitecoreClient } from 'lib/sitecore-client';
import { convertHexToGUID } from 'lib/utils/string-utils/convert-hex-to-guid';
import { normalizeSitecoreDateString } from 'lib/utils/string-utils/normalize-sitecore-date-string';
import { create } from 'xmlbuilder2';

const sitemapPathsQuery = /* GraphQL */ `
  query SitemapPaths($rootItemId: String!, $language: String!, $site: String!, $pageSize: Int = 100, $after: String) {
    search(
      where:{
        AND: [
          { name: "_path", value: $rootItemId, operator: CONTAINS }
          { name: "_templates", value: "${SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Data.Documents.TechnicalDocument.Id}", operator: CONTAINS }
          { name: "documentSite", value: $site, operator: CONTAINS }
          { name: "_language", value: $language }
        ]
      }
      first: $pageSize
      after: $after
  ) {
      total
      pageInfo {
        endCursor
        hasNext
      }
      results {
        id
        lastUpdated: field(name: "lastUpdated"){
          value
        }
        ... on AW_TechnicalDocument {
          document {
            ... on LinkField {
              url
            }
          }
        }
      }
    }
  }
`;

type SitemapQueryResult = {
  id: string;
  lastUpdated: {
    value: string;
  };
  document: {
    url: string;
  };
};

const siteRootIdQuery = /* GraphQL */ `
  query HomePageIdQuery($siteName: String!, $language: String!) {
    layout(site: $siteName, routePath: "/", language: $language) {
      homePage: item {
        parent {
          id
        }
      }
    }
  }
`;

type SiteRootIdQueryResult = {
  layout: {
    homePage: {
      parent: {
        id: string;
      };
    };
  };
};

export type TechDocSitemapItem = {
  url: string;
  lastMod: Date;
  id: string;
};

export type TechDocsSitemapServiceConfig = {
  /**
   * A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
   * This factory function is used to create and configure GraphQL clients for making GraphQL API requests.
   */
  sitecoreClient: AWSitecoreClient;
};

/**
 * Service that fetches the rendered layout for a specific page.
 */
export class TechDocsSitemapService {
  private readonly sitemapPathQueryService: SearchQueryService;

  protected get query(): string {
    return '';
  }

  constructor(public options: TechDocsSitemapServiceConfig) {
    this.sitemapPathQueryService = new SearchQueryService({
      sitecoreClient: this.options.sitecoreClient,
    });
  }

  // Generate the actual techdoc sitemap XML for a given set of paths.
  async generateTechDocsSitemap(site: SiteInfo, hostName: string): Promise<string> {
    const techDocSitemapItems = await this.fetchTechDocSitemapItems(site);
    const root = create({ encoding: 'UTF-8' })
      .ele('urlset')
      .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
      .att('xmlns:xhtml', 'http://www.w3.org/TR/xhtml11/xhtml11_schema.html')
      .att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
      .att(
        'xsi:schemaLocation',
        'http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.w3.org/TR/xhtml11/xhtml11_schema.html http://www.w3.org/2002/08/xhtml/xhtml1-strict.xsd'
      );

    techDocSitemapItems.forEach((sitemapItem) => {
      if (!sitemapItem?.url) {
        console.error(`TechDoc url not found for site ${site?.name}: ${sitemapItem?.id}`);
        return;
      }

      const mediaLibraryRegex =
        /https?:\/\/[^"' ]*\/-\/media\/[^"' ]+\.\w+(\?[^"' ]*)?(#[^"' ]*)?\b/gi;
      const documentExtensionMatch = sitemapItem.url.match(mediaLibraryRegex);
      if (!documentExtensionMatch) {
        // Url not in media library, log an error and skip this item
        console.error(
          `TechDoc url not in media library for site ${site?.name}: ${sitemapItem?.id}, url: ${sitemapItem.url}`
        );
      }

      const techDocNode = root.ele('url');

      // Replace all edge.sitecorecloud.io/andersencor{environment}-* media URLs with the site target hostname
      const urlWithHostnameReplaced = sitemapItem.url?.replace(
        /https:\/\/edge\.sitecorecloud\.io\/andersencor[^/]+(\/media\/[^\s"'\\)]+)/g,
        `https://${hostName}/-$1`
      );

      // --- STRIP TIME LIMIT PARAMETERS ---
      const techDocUrl = new URL(urlWithHostnameReplaced);
      techDocUrl.searchParams.delete('tt');
      techDocUrl.searchParams.delete('ttc');

      techDocNode.ele('loc').txt(techDocUrl.toString());
      if (!isNaN(sitemapItem?.lastMod?.getDate())) {
        techDocNode.ele('lastmod').txt(sitemapItem.lastMod?.toISOString());
      } else {
        console.error(
          `Invalid lastmod date for TechDoc item ${sitemapItem?.id} on site ${site?.name}: ${sitemapItem?.lastMod}`
        );
      }
    });

    const xml = root.end({ prettyPrint: true });

    return xml;
  }

  protected mapQueryResults(results: SitemapQueryResult[]) {
    return results?.map((path) => {
      return {
        id: path.id,
        url: path.document.url,
        lastMod: new Date(normalizeSitecoreDateString(path.lastUpdated?.value)),
      };
    });
  }

  protected async fetchTechDocSitemapItems(site: SiteInfo): Promise<TechDocSitemapItem[]> {
    const siteItemId = await this.options.sitecoreClient.getData<SiteRootIdQueryResult>(
      siteRootIdQuery,
      { siteName: site.name, language: site.language }
    );

    const rootItemId =
      SitecoreIds.Content.AndersenCorporation.AndersenWindows.Global.TechnicalDocuments.Id;

    const siteItemGuid = `${convertHexToGUID(siteItemId.layout.homePage.parent.id)}`;
    const results = await this.sitemapPathQueryService.fetchAllResults<SitemapQueryResult>(
      sitemapPathsQuery,
      {
        rootItemId,
        language: site.language,
        site: siteItemGuid,
      }
    );

    const paths = this.mapQueryResults(results);

    return paths;
  }
}
