import { debug, SiteInfo } from '@sitecore-content-sdk/nextjs';
import { AWSitecoreClient } from 'lib/sitecore-client';

import { sites } from '.sitecore/aw-sites';

// The default query for requesting Crawlers setting item
const defaultQuery = /* GraphQL */ `
  query CrawlersQuery($crawlersPath: String!, $language: String = "en") {
    item(path: $crawlersPath, language: $language) {
      ... on AW_Crawlers {
        llmsTxt {
          value
        }
      }
    }
  }
`;

export type GraphQLCrawlersServiceConfig = {
  /**
   * The SitecoreClient that will be used for data fetching.
   */
  sitecoreClient: AWSitecoreClient;
  /**
   * The JSS application name
   */
  siteName: string;
};

/**
 * The schema of data returned in response to Crawlers request
 */
export type CrawlersQueryResult = {
  item: { llmsTxt: { value: string } };
};

/**
 * Service that fetch the Crawlers data using Sitecore's GraphQL API.
 */
export class AWGraphQLCrawlersService {
  protected get query(): string {
    return defaultQuery;
  }

  /**
   * Creates an instance of graphQL Crawlers service with the provided options
   * @param {GraphQLCrawlersServiceConfig} options instance
   */
  constructor(public options: GraphQLCrawlersServiceConfig) {}

  /**
   * Fetch a data of Crawlers.txt from API
   * @returns text of Crawlers.txt
   * @throws {Error} if the siteName is empty.
   */
  async fetchLlmsTxt(): Promise<string> {
    const siteName: string = this.options.siteName;
    const siteNameError = 'The siteName cannot be empty';

    if (!siteName) {
      throw new Error(siteNameError);
    }

    const siteInfo = sites.find((value: SiteInfo) => value.name === siteName);
    if (siteInfo === undefined) {
      throw new Error(siteNameError);
    }

    const crawlersPath = `${siteInfo.rootPath}/Settings/Crawlers`;

    try {
      const results = await this.options.sitecoreClient.getData<CrawlersQueryResult>(this.query, {
        crawlersPath,
      });
      return results.item?.llmsTxt?.value ?? '';
    } catch (e) {
      debug.llmsTxt(`Error getting crawlers node: %O`, e);
      throw e;
    }
  }
}
