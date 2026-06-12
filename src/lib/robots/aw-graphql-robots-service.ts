import { debug, SiteInfo } from '@sitecore-content-sdk/nextjs';
import { AWSitecoreClient } from 'lib/sitecore-client';
import {} from 'lib/utils/linq/array';

import { sites } from '.sitecore/aw-sites';

// The default query for request robots.txt
const defaultQuery = /* GraphQL */ `
  query RobotsQuery($robotsPath: String!, $language: String = "en") {
    item(path: $robotsPath, language: $language) {
      ... on AW_Robots {
        robotsContent {
          value
        }
      }
    }
  }
`;

export type GraphQLRobotsServiceConfig = {
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
 * The schema of data returned in response to robots.txt request
 */
export type RobotsQueryResult = {
  item: { robotsContent: { value: string } };
};

/**
 * Service that fetch the robots.txt data using Sitecore's GraphQL API.
 */
export class AWGraphQLRobotsService {
  protected get query(): string {
    return defaultQuery;
  }

  /**
   * Creates an instance of graphQL robots.txt service with the provided options
   * @param {GraphQLRobotsServiceConfig} options instance
   */
  constructor(public options: GraphQLRobotsServiceConfig) {}

  /**
   * Fetch a data of robots.txt from API
   * @returns text of robots.txt
   * @throws {Error} if the siteName is empty.
   */
  async fetchRobots(): Promise<string> {
    const siteName: string = this.options.siteName;
    const siteNameError = 'The siteName cannot be empty';

    if (!siteName) {
      throw new Error(siteNameError);
    }

    const siteInfo = sites.find((value: SiteInfo) => value.name === siteName);
    if (siteInfo === undefined) {
      throw new Error(siteNameError);
    }

    const robotsPath = `${siteInfo.rootPath}/Settings/Robots`;

    try {
      const results = await this.options.sitecoreClient.getData<RobotsQueryResult>(this.query, {
        robotsPath,
      });
      return results.item?.robotsContent?.value ?? '';
    } catch (e) {
      debug.robots(`Error getting robots node: %O`, e);
      throw e;
    }
  }
}
