import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { buildExpressionList, buildVariableList, buildVariableValues } from 'lib/graphql';
import { SearchQueryService } from 'lib/graphql/search-query-service';
import { AWSitecoreClient } from 'lib/sitecore-client';

export type ProductByIdQueryResult = {
  productId: {
    value: string;
  };
  productName: {
    value: string;
  };
  productSubtitle: {
    value: string;
  };
  productDescription: {
    value: string;
  };
  productShortDescription: {
    value: string;
  };
  productImage: {
    title: string;
    src: string;
    height: number;
    width: number;
    alt: string;
  };
  productImageMobile: {
    title: string;
    src: string;
    height: number;
    width: number;
    alt: string;
  };
  productImageMobileFocusArea: {
    targetItem: {
      value: {
        value: string;
      };
    };
  };
  productType: {
    value: string;
  };
  productSeries: {
    value: string;
  };
  windowProductType: {
    value: string;
  };
  stormDoorProductType: {
    value: string;
  };
  exteriorDoorProductType: {
    value: string;
  };
  priceLevel: {
    targetItem: {
      priceLevelText: {
        value: string;
      };
    };
  };
  productDetailPageLink: {
    text: string;
    target: null | string;
    url: string;
    anchor: null | string;
  };
  name: string;
};

export interface GraphQLServiceConfig {
  sitecoreClient: AWSitecoreClient;
}

export class FavoriteProductsService {
  private readonly searchService: SearchQueryService;
  protected query(productIdLength: number): string {
    const variableListResult = buildVariableList('productid', 'String', productIdLength);
    const variableList = variableListResult
      .split(',')
      .map((variable) => variable.trim()) // Remove whitespace
      .filter((variable) => variable !== '') // Remove empty variables
      .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
      .join(', ');

    const productIdExpression = buildExpressionList(
      'productid',
      'EQ',
      'productid',
      productIdLength
    );
    /* GraphQL */
    return `query getProduct($after: String $language: String! ${variableList}, ){
    search(
        where: {
          AND: [
            {
              name:"_path"
              value:"${SitecoreIds.Content.AndersenCorporation.AndersenWindows.Global.Products.Id}"
              operator: CONTAINS
            }
            {
              name:"_templates"
              value:"${SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Data.Products.Product.Id}"
              operator:CONTAINS
            }
            {
              name: "_language"
              value: $language
              operator: EQ
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
      results {
        ... on AW_Product {
          ItemId: id
          productId {
            value
          }
          bazaarvoiceProductId {
            value
          }
          productName {
            value
          }
          productSubtitle {
            value
          }
          productDescription {
            value
          }
          productShortDescription {
            value
          }
          productImage {
            ... on ImageField {
              title
              src
              height
              width
              alt
            }
          }
          productImageMobile {
            ... on ImageField {
              title
              src
              height
              width
              alt
            }
          }
          productImageMobileFocusArea {
            targetItem {
              ... on Enum {
                value {
                  value
                }
              }
            }
          }
          productType {
            ...ProductType
          }
          productSeries {
            ...ProductType
          }
          windowProductType {
            ...ProductType
          }
          stormDoorProductType {
            ...ProductType
          }
          exteriorDoorProductType {
            ...ProductType
          }
          priceLevel {
            targetItem {
              ... on AW_PriceLevel {
                priceLevelText {
                  value
                }
              }
            }
          }
          featuredInteriorColors {
            ...Colors
          }
          standardInteriorColors {
            ...SwatchCollection
          }
          featuredExteriorColors {
            ...Colors
          }
          productDetailPageLink {
            ... on LinkField {
              text
              target
              url
              anchor
            }
          }
          name
        }
      }
      }
    }
    fragment Colors on MultilistField {
      colors: targetItems {
        ... on AW_Swatch {
          swatchName {
            value
          }
          swatchDescription {
            value
          }
          swatchImage {
            alt
            height
            width
            src
          }
        }
      }
    }
    fragment ProductType on LookupField {
      targetItem {
        ... on AW_ProductType {
          productTypeName {
            value
          }
          productTypeDescription {
            value
          }
          productTypeImage {
            alt
            height
            width
            src
          }
        }
      }
    }
    fragment SwatchCollection on LookupField {
      targetItem {
        ... on AW_SwatchCollection {
          swatchCollectionName {
            value
          }
          swatchCollectionDescription {
            value
          }
          swatchCollectionFooterCopy {
            value
          }
          swatches {
            ...Colors
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
   * @returns {ProductByIdQueryResult[]} list of products
   * @throws {Error} if the siteName is empty.
   */

  async fetch(favoriteProductIDs: string[], language = 'en'): Promise<ProductByIdQueryResult[]> {
    const query = this.query(favoriteProductIDs.length);
    const variableValues = buildVariableValues('productid', favoriteProductIDs);
    const fetchResult: Promise<ProductByIdQueryResult[]> =
      this.searchService.fetchAllResults<ProductByIdQueryResult>(query, {
        ...variableValues,
        language: language,
      });
    return fetchResult;
  }
}
