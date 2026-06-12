import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { AWSitecoreClient } from 'lib/sitecore-client';

export interface Question {
  id: string;
  template: {
    name: string;
  };
  questionText: {
    value?: string;
  };
  answeredText: {
    value: string;
  };
  breadcrumbText: {
    value: string;
  };
  errorText: {
    value: string;
  };
}

export interface Answer {
  id: string;
  answerText: {
    value: string;
  };
  answerDescription: {
    value: string;
  };
  primaryImage: {
    title: string;
    src: string;
    height: number;
    width: number;
    alt: string;
  };
  primaryImageMobile: {
    title: string;
    src: string;
    height: number;
    width: number;
    alt: string;
  };
  primaryImageMobileFocusArea: {
    targetItem: {
      value: {
        value: string;
      };
    };
  };
}

export interface Recommendation {
  id: string;
  template: {
    name: string;
  };
  productItem: {
    value: string;
  };
  cta1Link: {
    text: string;
    target: null | string;
    url: string;
    anchor: null | string;
  };
  cta1Style: {
    targetItem: {
      value: {
        value: string;
      };
    };
  };
  cta1Icon: {
    targetItem: {
      value: {
        value: string;
      };
    };
  };
  cta2Link: {
    text: string;
    target: null | string;
    url: string;
    anchor: null | string;
  };
  cta2Style: {
    targetItem: {
      value: {
        value: string;
      };
    };
  };
  cta2Icon: {
    targetItem: {
      value: {
        value: string;
      };
    };
  };
}

export interface ItemQueryResult {
  question: Question;
  answers: {
    children: {
      results: Answer[];
    };
  };
  results: {
    id: string;
    template:
      | {
          name: string;
        }
      | Recommendation;
  };
}
export type NextQuestionOrRecommendationByIdQueryResult = ItemQueryResult;

export interface GraphQLServiceConfig {
  sitecoreClient: AWSitecoreClient;
}

export class NextQuestionOrRecommendationsService {
  protected query(): string {
    return /* GraphQL */ `
    query GetNextQuestionOrRecommendation($after: String, $currentAnswerId:String, $language: String!){
      question:item(path: $currentAnswerId, language: $language){
        children (includeTemplateIDs: ["${SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Components.Tool.StormDoorChooseTool.Question.Id}", "${SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Components.Tool.StormDoorChooseTool.Recommendation.Id}"]
          after: $after
          ) {

          results{
            ... on AW_Question{
              id
              template{name}
            }
            ... on AW_Recommendation{
              id
              template{name}
              productItem{value}
              cta1Link{
                ...on LinkField
                {
                  text
                  target
                  url
                  anchor
                }
              }
              cta1Style{
                targetItem
                  {
                    ...on Enum
                    {
                      value{value}
                    }
                  }
              }
              cta1Icon{
              targetItem
                  {
                    ...on Enum
                    {
                      value{value}
                    }
                  }
              }
              cta2Link{
                ...on LinkField
                {
                  text
                  target
                  url
                  anchor
                }
              }
              cta2Style{
                targetItem
                  {
                    ...on Enum
                    {
                      value{value}
                    }
                  }
              }
              cta2Icon{
                targetItem
                  {
                    ...on Enum
                    {
                      value{value}
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
  constructor(public options: GraphQLServiceConfig) {}

  /**
   * Fetch list of products for the bazaarvoice ids
   * @param sourceIds {string[]} the product ids to item
   * @param productIds {string[]} the bazaarvoice product ids
   * @returns {NextQuestionOrRecommendationByIdQueryResult[]} list of products
   * @throws {Error} if the siteName is empty.
   */
  async fetch(
    currentAnswerId: string[],
    language = 'en'
  ): Promise<NextQuestionOrRecommendationByIdQueryResult> {
    const query = this.query();
    const fetchResult: Promise<NextQuestionOrRecommendationByIdQueryResult> =
      this.options.sitecoreClient.getData<NextQuestionOrRecommendationByIdQueryResult>(query, {
        currentAnswerId: currentAnswerId,
        language: language,
      });
    return fetchResult;
  }
}
