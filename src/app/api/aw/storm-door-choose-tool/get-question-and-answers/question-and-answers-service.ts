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

export interface ItemQueryResult {
  question: Question;
  answers: {
    children: {
      results: Answer[];
    };
  };
}

export type QuestionAndAnswersnByIdQueryResult = ItemQueryResult;

export interface GraphQLServiceConfig {
  sitecoreClient: AWSitecoreClient;
}

export class QuestionAndAnswersService {
  protected query(): string {
    return /* GraphQL */ `
    query GetQuestionAndAnswers($after: String $questionId:String $language: String!){
      question:item(path: $questionId, language: $language){
            ... on  AW_Question{
              id
              template{name}
              questionText{value}
              answeredText{value}
              breadcrumbText{value}
              errorText{value}
            }
          }
      answers:item(path: $questionId, language: $language){
        children (includeTemplateIDs: ["${SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Components.Tool.StormDoorChooseTool.Answer.Id}"]after: $after){
          results{
            ... on  AW_Answer{
              id
              answerText{value}
              answerDescription{value}
              primaryImage{
                ... on ImageField
                {
                  title
                  src
                  height
                  width
                  alt
                }
              }
              primaryImageMobile{
                ... on ImageField
                {
                  title
                  src
                  height
                  width
                  alt
                }
              }
              primaryImageMobileFocusArea{
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
   * @returns {QuestionAndAnswersnByIdQueryResult[]} list of products
   * @throws {Error} if the siteName is empty.
   */

  async fetch(questionId: string[], language = 'en'): Promise<QuestionAndAnswersnByIdQueryResult> {
    const query = this.query();
    const fetchResult =
      await this.options.sitecoreClient.getData<QuestionAndAnswersnByIdQueryResult>(query, {
        questionId: questionId,
        language: language,
      });
    return fetchResult;
  }
}
