import { AWSitecoreClient } from 'lib/sitecore-client';

/**
 * Data needed to paginate results
 */
export interface PageInfo {
  /**
   * string token that can be used to fetch the next page of results
   */
  endCursor: string;
  /**
   * a value that indicates whether more pages of results are available
   */
  hasNext: boolean;
}

/**
 * Schema of data returned in response to a "search" query request
 * @template T The type of objects being requested.
 */
export type ItemChildrenQueryResult<T> = {
  item: {
    children: {
      /**
       * Data needed to paginate the search results
       */
      pageInfo: PageInfo;
      /*
       * the type of data querying about items matching the search criteria
       */
      results: T[];
    };
  };
};

/**
 * Describes the variables used by the 'search' query.
 * The other predicates are optional.
 */
export interface ItemChildrenQueryVariables {
  [key: string]: unknown;

  /** common variable for all GraphQL queries
   * it will be used for every type of query to regulate result batch size
   * Optional. How many result items to fetch in each GraphQL call. This is needed for pagination.
   * @default 100
   */
  pageSize?: number;
}

/**
 * Provides functionality for performing GraphQL 'search' operations, including handling pagination.
 * This class is meant to be extended or used as a mixin; it's not meant to be used directly.
 * @template T The type of objects being requested.
 * @mixin
 */
export class ItemChildrenService<T> {
  constructor(public options: { sitecoreClient: AWSitecoreClient }) {}

  /**
   * 1. Validates mandatory search query arguments
   * 2. Executes search query with pagination
   * 3. Aggregates pagination results into a single result-set.
   * @template T The type of objects being requested.
   * @param {string} query the search query.
   * @param {SearchQueryVariables} args search query arguments.
   * @returns {T[]} array of result objects.
   * @throws {RangeError} if a valid root item ID is not provided.
   * @throws {RangeError} if the provided language(s) is(are) not valid.
   */
  async fetchAllResults(query: string, args: ItemChildrenQueryVariables): Promise<T[]> {
    let results: T[] = [];
    let hasNext = true;
    let after = '';
    const pageSize = args.pageSize ?? 100;

    while (hasNext) {
      const fetchResponse = await this.options.sitecoreClient.getData<ItemChildrenQueryResult<T>>(
        query,
        {
          ...args,
          pageSize,
          after,
        }
      );

      results = results.concat(fetchResponse?.item?.children?.results);
      hasNext = fetchResponse.item.children.pageInfo.hasNext;
      after = fetchResponse.item.children.pageInfo.endCursor;
    }

    return results;
  }

  /**
   * 1. Validates mandatory search query arguments
   * 2. Executes search query with pagination
   * 3. Aggregates page info into a single result-set.
   * @param {string} query the search query.
   * @param {SearchQueryVariables} args search query arguments.
   * @returns {T[]} array of result objects.
   * @throws {RangeError} if a valid root item ID is not provided.
   * @throws {RangeError} if the provided language(s) is(are) not valid.
   */
  async fetchPageInfo(query: string, args: ItemChildrenQueryVariables): Promise<PageInfo[]> {
    let pageInfo: PageInfo[] = [{ endCursor: '', hasNext: true }];
    let hasNext = true;
    let after = '';
    const pageSize = args.pageSize ?? 100;

    while (hasNext) {
      const fetchResponse = await this.options.sitecoreClient.getData<ItemChildrenQueryResult<T>>(
        query,
        {
          ...args,
          pageSize,
          after,
        }
      );

      pageInfo = pageInfo.concat(fetchResponse?.item?.children?.pageInfo);
      hasNext = fetchResponse.item.children.pageInfo.hasNext;
      after = fetchResponse.item.children.pageInfo.endCursor;
    }

    return pageInfo;
  }

  /**
   * 1. Validates mandatory search query arguments
   * 2. Executes search query for a specific page
   * 3. Provides results of that page.
   * @template T The type of objects being requested.
   * @param {string} query the search query.
   * @param {SearchQueryVariables} args search query arguments.
   * @param {string} after value of endCursor to fetch results of the specific page.
   * @returns {T[]} array of result objects.
   * @throws {RangeError} if a valid root item ID is not provided.
   * @throws {RangeError} if the provided language(s) is(are) not valid.
   */
  async fetchPageResults(
    query: string,
    args: ItemChildrenQueryVariables,
    after: string
  ): Promise<T[]> {
    const pageSize = args.pageSize ?? 100;
    const fetchResponse = await this.options.sitecoreClient.getData<ItemChildrenQueryResult<T>>(
      query,
      {
        ...args,
        pageSize,
        after,
      }
    );

    return fetchResponse?.item?.children?.results;
  }
}
