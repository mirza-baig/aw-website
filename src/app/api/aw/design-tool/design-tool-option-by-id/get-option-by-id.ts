import { SitecoreIds } from 'lib/constants/sitecore-ids';
import type { AWSitecoreClient } from 'lib/sitecore-client';

import {
  ImgFieldFragment,
  LnkFieldFragment,
  OptionChildQueryResultFragment,
  OptionQueryResultFragment,
  ProductChildQueryResultFragment,
  ProductItemQueryResultFragment,
  ProductTypeFragment,
} from '../design-tool-fragments';

export type DesignToolQueryItem = {
  id: string;
  name: string;
  parentId: string;
  templateId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: any;
  children: DesignToolQueryItem[];
};

interface ImageQuery {
  title: string;
  src: string;
  height: string;
  width: string;
  alt: string;
}

interface LinkQuery {
  text: string;
  target: string;
  url: string;
  anchor: string;
}

interface ProductTypeQueryResult {
  targetItem: {
    productTypeName: {
      value: string;
    };
    productTypeDescription: {
      value: string;
    };
    productTypeImage: ImageQuery;
  };
}

interface ProductItemQueryResult {
  targetItem: {
    productDetailPageLink: LinkQuery;
    findADealerLink: LinkQuery;
    productSeries: ProductTypeQueryResult;
    productType: ProductTypeQueryResult;
    productId: {
      value: string;
    };
    renoworksKey: {
      value: string;
    };
    renoworksName: {
      value: string;
    };
    priceLevel: {
      targetItem: {
        priceLevelText: {
          value: string;
        };
      };
    };
    bazaarvoiceProductId: {
      value: string;
    };
  };
}

interface ProductConfigItemQueryResult {
  targetItem: {
    productDimensions: { value: string };
  };
}

interface OptionQueryResult {
  item: OptionQueryResultInnerItem;
}

interface OptionQueryResultInnerItem {
  test: string;
  id: string;
  name: string;
  parent: {
    id: string;
  };
  template: {
    id: string;
  };
  children: {
    results: (OptionQueryResultInnerItem | ProductQueryResultInnerItem)[];
  };
  ctaText: {
    value: string;
  };
  optionHeading: {
    value: string;
  };
  stepHeading: {
    value: string;
  };
  stepSubhead: {
    value: string;
  };
  stepCopy: {
    value: string;
  };
  helpCTAText: {
    value: string;
  };
  helpText: {
    value: string;
  };
  optionImage: ImageQuery;
  optionIcon: ImageQuery;
  helpImage1: ImageQuery;
  helpImage2: ImageQuery;
  helpImage3: ImageQuery;
  helpImage4: ImageQuery;
  helpImage5: ImageQuery;
  helpMobileImage1: ImageQuery;
  helpMobileImage2: ImageQuery;
  helpMobileImage3: ImageQuery;
  helpMobileImage4: ImageQuery;
  helpMobileImage5: ImageQuery;
}

interface ProductQueryResult {
  item: ProductQueryResultInnerItem;
}

interface ProductQueryResultInnerItem {
  test: string;
  id: string;
  name: string;
  parent: {
    id: string;
  };
  template: {
    id: string;
  };
  children: {
    results: (OptionQueryResultInnerItem | ProductQueryResultInnerItem)[];
  };
  product: ProductItemQueryResult;
  bulletText1: { value: string };
  bulletText2: { value: string };
  bulletText3: { value: string };
  productImage1: ImageQuery;
  productImage2: ImageQuery;
  productImage3: ImageQuery;
  productImage4: ImageQuery;
  productImage5: ImageQuery;
  videoYouTubeId1: { value: string };
  videoYouTubeId2: { value: string };
  videoYouTubeId3: { value: string };
  videoYouTubeId4: { value: string };
  videoYouTubeId5: { value: string };
  summaryText: { value: string };
  sizingText: { value: string };
  customSizingText: { value: string };
  disclaimerText: { value: string };
  glassText: { value: string };
  homeDepotBuyCTAText: { value: string };
  homeDepotSpecialOrderCTAText: { value: string };
  homeDepotSpecialOrderLightboxText: { value: string };
  displayUniversalHandingLogo: { value: string };
  designHeading: { value: string };
  designSubhead: { value: string };
  summaryHeading: { value: string };
  summarySubhead: { value: string };
  productConfiguration: ProductConfigItemQueryResult;
  sizeChartsLink: LinkQuery;
  customSizesLink: LinkQuery;
  ctaText: { value: string };
  relatedProduct: { value: string };
  featureImage: ImageQuery;
  featureText: { value: string };
}

// The query for fetching the option with option or product children
const defaultQuery = /* GraphQL */ `
  query GetItem($itemId: String, $language: String!) {
    # path can be an item tree path or GUID-based id
    item(path: $itemId, language: $language) {
      id
      name
      parent {
        id
      }
      template {
        id
      }
      ...OptionQueryResult
      children(includeTemplateIDs: ["${SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Components.Tool.DesignTool.DesignToolOption.Id}","${SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Components.Tool.DesignTool.DesignToolProduct.Id}"]) {
        results {
          id
          name
          parent {
            id
          }
          template {
            id
          }
          ...OptionChildQueryResult
          ...ProductChildQueryResult
      }
    }
  }
}
${ImgFieldFragment}
${OptionQueryResultFragment}
${OptionChildQueryResultFragment}
${LnkFieldFragment}
${ProductTypeFragment}
${ProductItemQueryResultFragment}
${ProductChildQueryResultFragment}
`;

export const defaultQueryResultItem: DesignToolQueryItem = {
  id: '',
  name: '',
  parentId: '',
  templateId: '',

  fields: {},
  children: [],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapOptionFields = (optionItem: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = {};
  if (!!optionItem) {
    Object.keys(optionItem).forEach((key: string) => {
      switch (key) {
        case 'children':
        case 'id':
        case 'parent':
          return;
        default:
      }

      if (!!optionItem[key]?.targetItem?.fields) {
        result[key as keyof unknown] = {
          id: StringToGuid(optionItem[key]?.targetItem?.id),
          fields: { ...mapOptionFields(optionItem[key]?.targetItem?.fields) },
        };
      } else if (!!optionItem[key]?.targetItem) {
        result[key as keyof unknown] = {
          id: StringToGuid(optionItem[key]?.targetItem?.id),
          fields: { ...mapOptionFields(optionItem[key]?.targetItem) },
        };
      } else if (optionItem[key]?.__typename === 'LinkField') {
        result[key as keyof unknown] = {
          value: {
            ...optionItem[key],
            href: optionItem[key]?.href || optionItem[key]?.url,
            url: optionItem[key]?.url || optionItem[key]?.href,
          },
        };
      } else if (!!optionItem[key]?.src) {
        result[key as keyof unknown] = {
          value: {
            ...optionItem[key],
          },
        };
      } else {
        result[key as keyof unknown] = optionItem[key];
      }
    });
  }

  return result;
};

const mapOptionToQueryItem = (
  optionItem: OptionQueryResultInnerItem | ProductQueryResultInnerItem
): DesignToolQueryItem => {
  return {
    id: StringToGuid(optionItem?.id),
    name: optionItem?.name,
    parentId: StringToGuid(optionItem?.parent?.id),
    templateId: StringToGuid(optionItem?.template?.id),
    fields: { ...mapOptionFields(optionItem) },
    children: optionItem?.children?.results.map((child) => mapOptionToQueryItem(child)),
  };
};

/**
 * Encode an incoming string and attempt to convert it to an encoded, upper cased Guid format
 * @returns {string} the guid formatted string
 */
function StringToGuid(value: string) {
  return encodeURIComponent(value?.toLowerCase().replaceAll(/[\}\{-]/g, '')).replace(
    /([0-9a-fA-F]{8})([0-9a-fA-F]{4})([0-5][0-9a-fA-F]{3})([089abAB][0-9a-fA-F]{3})([0-9a-fA-F]{12})/g,
    '$1-$2-$3-$4-$5'
  );
}

/**
 * Configuration options for @see GraphQLDesignToolOptionByIdService instances
 */
interface GraphQLDesignToolOptionByIdServiceConfig {
  /**
   * A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
   * This factory function is used to create and configure GraphQL clients for making GraphQL API requests.
   */
  sitecoreClient: AWSitecoreClient;
}

/**
 * Service that fetch a Design Tool templated item using Sitecore's GraphQL API, in order to reduce the initial
 * page load size.
 */
export class GraphQLDesignToolOptionByIdService {
  protected get query(): string {
    return defaultQuery;
  }

  constructor(public options: GraphQLDesignToolOptionByIdServiceConfig) {}

  /**
   * Fetch the requested Design Tool data item
   * @returns {DesignToolQueryItem[]} array of Design Tool items
   * @throws {Error} if the formatted itemId returns nothing.
   */
  async fetchItem(itemId: string, language = 'en'): Promise<DesignToolQueryItem> {
    const result: Promise<OptionQueryResult | ProductQueryResult> =
      this.options.sitecoreClient.getData(this.query, {
        itemId: itemId,
        language: language,
      });
    try {
      return result.then((result: OptionQueryResult | ProductQueryResult) => {
        const reresult = mapOptionToQueryItem(result?.item);
        return reresult;
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
