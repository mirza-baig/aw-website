import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { PageInfo, SearchQueryService } from 'lib/graphql/search-query-service';
import sitecoreClient, { AWSitecoreClient } from 'lib/sitecore-client';

// The default query for fetching item
const defaultQuery = /* GraphQL */ `
  query ($rootItemId: String, $pageSize: Int = 50, $after: String) {
    search(
      where: {
        AND: [
          { name: "_templates", value: "${SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.FieldSets.Search._IndexableItem.Id}", operator: CONTAINS }
          { name: "_path", value: $rootItemId, operator: CONTAINS }
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
    }
  }
`;

/**
 * Service that fetch the sitemaps data using Sitecore's GraphQL API.
 */
export class GraphQLCoveoSitemapIndexService {
  private readonly searchService: SearchQueryService;

  protected get query(): string {
    return defaultQuery;
  }

  /**
   * This creates an instance of graphQL sitemaps service with the provided options
   * @param {GraphQLSitemapXmlServiceConfig} options instance
   */
  constructor(public options: { sitecoreClient: AWSitecoreClient }) {
    this.searchService = new SearchQueryService({
      sitecoreClient: this.options.sitecoreClient,
    });
  }

  /**
   * Fetch list of sitemaps for the site
   * @returns {string[]} list of sitemap paths
   * @throws {Error} if the siteName is empty.
   */

  async fetch(rootItemId: string, pageSize: number): Promise<PageInfo[]> {
    try {
      const results = await this.searchService.fetchPageInfo<PageInfo[]>(this.query, {
        rootItemId,
        pageSize,
      });
      return results;
    } catch (e) {
      throw e instanceof Error ? e : new Error(String(e));
    }
  }
}

export const graphQLCoveoSitemapIndexService = new GraphQLCoveoSitemapIndexService({
  sitecoreClient,
});
