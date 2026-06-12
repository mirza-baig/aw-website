import { buildExpressionList, buildVariableList, buildVariableValues } from 'lib/graphql';
import { SearchQueryService } from 'lib/graphql/search-query-service';
import { AWSitecoreClient } from 'lib/sitecore-client';

/**
 * The schema for the product data coming back from the graphQl query.
 */
export type ProductByBVIdQueryResult = {
  bazaarvoiceProductId: { value: string };
  productName: { value: string };
  productImage: {
    src: string;
    height: string;
    width: string;
    alt: string;
  };
};

export interface GraphQLServiceConfig {
  sitecoreClient: AWSitecoreClient;
}

/**
 * Service that fetch the sitemaps data using Sitecore's GraphQL API.
 */
export class GraphQLProductByBVIdService {
  private readonly searchService: SearchQueryService;

  protected query(sourceIdLength: number, productIdLength: number, language: string): string {
    const variables = `${buildVariableList(
      'sourceId',
      'String',
      sourceIdLength
    )}${buildVariableList('productId', 'String', productIdLength)}`;
    const sourceIdExpression = buildExpressionList('_path', 'CONTAINS', 'sourceId', sourceIdLength);
    const productIdExpression = buildExpressionList(
      'bazaarvoiceProductId',
      'EQ',
      'productId',
      productIdLength
    );

    /* GraphQL */
    return `
  query ProductByBVIdQuery($after: String${variables}) {
    search(
      where: {
        AND: [
          { name: "_language", value: "${language}", operator: EQ }
          ${
            sourceIdLength
              ? `{
            OR: [
              { name: "id", value: "0", operator: EQ }
              ${sourceIdExpression}
            ]
          }`
              : ''
          }
          {
            OR: [
              ${productIdExpression}
            ]
          }
        ]
      }
      after: $after
    ) {
      total
      pageInfo {
        endCursor
        hasNext
      }
      results{
        ... on AW_Product {
          bazaarvoiceProductId {
            value
          }
          productName{
             value
          }
          productImage {
            src,
            height,
            width,
            alt
          }
          productSeries {
            targetItem {
              ... on AW_ProductType {
                productTypeName {
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;
  }

  /**
   * Creates an instance of graphQL sitemaps service with the provided options
   * @param {GraphQLSitemapXmlServiceConfig} options instance
   */
  constructor(public options: GraphQLServiceConfig) {
    this.searchService = new SearchQueryService({
      sitecoreClient: this.options.sitecoreClient,
    });
  }

  /**
   * Fetch list of products for the bazaarvoice ids
   * @param sourceIds {string[]} the product ids to search
   * @param productIds {string[]} the bazaarvoice product ids
   * @returns {ProductByBVIdQueryResult[]} list of products
   * @throws {Error} if the siteName is empty.
   */
  async fetch(
    sourceIds: string[],
    productIds: string[],
    language: string
  ): Promise<ProductByBVIdQueryResult[]> {
    const query = this.query(sourceIds.length, productIds.length, language);
    const sourceIdValues = buildVariableValues('sourceId', sourceIds);
    const productIdValues = buildVariableValues('productId', productIds);

    const fetchResult: Promise<ProductByBVIdQueryResult[]> =
      this.searchService.fetchAllResults<ProductByBVIdQueryResult>(query, {
        ...sourceIdValues,
        ...productIdValues,
      });
    return fetchResult;
  }
}
