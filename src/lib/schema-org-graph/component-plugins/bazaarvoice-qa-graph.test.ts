import { ComponentRendering, Item, SiteInfo } from '@sitecore-content-sdk/nextjs';
import { fetchProductQuestions } from 'lib/bazaarvoice/fetch-product-questions';
import { Product, Thing, WebPage } from 'schema-dts';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ComponentPluginParams } from '../plugin-types';
import { plugin } from './bazaarvoice-qa-graph';
import { Sitecore } from '.sitecore/AndersenWindows.model';

vi.mock('lib/bazaarvoice/fetch-product-questions', () => ({
  fetchProductQuestions: vi.fn(),
}));

type BazaarvoiceQAFields =
  Sitecore.Components.General.BazaarvoiceQuestionAnswer.BazaarvoiceQuestionAnswer['fields'];

const siteInfo: SiteInfo = {
  hostName: '*',
  language: 'en',
  name: 'AndersenWindows',
  targetHostName: 'www.andersenwindows.com',
  canonicalHostName: 'https://www.andersenwindows.com',
};

function componentParams(
  fields: BazaarvoiceQAFields,
  graph: Thing[]
): ComponentPluginParams<BazaarvoiceQAFields> {
  return {
    graph,
    fields,
    rendering: { componentName: 'BazaarvoiceQuestionAnswer' } as ComponentRendering,
    page: {
      customProps: { siteInfo },
      layout: { sitecore: {} },
    } as unknown as ComponentPluginParams<BazaarvoiceQAFields>['page'],
  };
}

function fields(productId: string): BazaarvoiceQAFields {
  return {
    productItem: {
      fields: {
        bazaarvoiceProductId: { value: productId },
      },
    } as unknown as Item,
  } as BazaarvoiceQAFields;
}

const product: Product = {
  '@type': 'Product',
  '@id': 'https://www.andersenwindows.com/#/schema/Product/100-AWN',
  name: '100 Series Awning Window',
};

const webPage: WebPage = {
  '@type': 'WebPage',
  '@id': 'https://www.andersenwindows.com/windows/awning',
  url: 'https://www.andersenwindows.com/windows/awning',
};

describe('schema-org-graph > component-plugins > bazaarvoice-qa-graph', () => {
  beforeEach(() => {
    vi.mocked(fetchProductQuestions).mockReset();
  });

  it('emits one QAPage per Question inside Product.subjectOf', async () => {
    vi.mocked(fetchProductQuestions).mockResolvedValue([
      {
        Id: 'q1',
        QuestionSummary: 'Can this window be installed on the second floor?',
        QuestionDetails: 'Wondering about safety and code compliance.',
        SubmissionTime: '2026-09-01T10:00:00.000+00:00',
        UserNickname: 'Homeowner',
        TotalPositiveFeedbackCount: 3,
        AnswerIds: ['a1', 'a2'],
        Answers: [
          {
            Id: 'a1',
            QuestionId: 'q1',
            AnswerText: 'Yes, follow local code.',
            SubmissionTime: '2026-09-02T10:00:00.000+00:00',
            UserNickname: 'Contractor',
            TotalPositiveFeedbackCount: 5,
            TotalNegativeFeedbackCount: 0,
          },
          {
            Id: 'a2',
            QuestionId: 'q1',
            AnswerText: 'Absolutely.',
            SubmissionTime: '2026-09-03T10:00:00.000+00:00',
            UserNickname: 'Andersen Support',
            IsFeatured: true,
            TotalPositiveFeedbackCount: 2,
          },
        ],
      },
    ]);

    const result = await plugin(componentParams(fields('100-AWN'), [webPage, product]));

    expect(fetchProductQuestions).toHaveBeenCalledWith('100-AWN');
    expect(result).toEqual([
      webPage,
      {
        ...product,
        subjectOf: [
          {
            '@type': 'QAPage',
            '@id': 'https://www.andersenwindows.com/#/schema/QAPage/Bazaarvoice/100-AWN/q1',
            mainEntity: {
              '@type': 'Question',
              '@id': 'https://www.andersenwindows.com/#/schema/Question/Bazaarvoice/q1',
              name: 'Can this window be installed on the second floor?',
              text: 'Wondering about safety and code compliance.',
              dateCreated: '2026-09-01T10:00:00.000+00:00',
              answerCount: 2,
              upvoteCount: 3,
              author: { '@type': 'Person', name: 'Homeowner' },
              acceptedAnswer: {
                '@type': 'Answer',
                '@id': 'https://www.andersenwindows.com/#/schema/Answer/Bazaarvoice/a2',
                text: 'Absolutely.',
                dateCreated: '2026-09-03T10:00:00.000+00:00',
                upvoteCount: 2,
                downvoteCount: 0,
                author: { '@type': 'Person', name: 'Andersen Support' },
              },
              suggestedAnswer: [
                {
                  '@type': 'Answer',
                  '@id': 'https://www.andersenwindows.com/#/schema/Answer/Bazaarvoice/a1',
                  text: 'Yes, follow local code.',
                  dateCreated: '2026-09-02T10:00:00.000+00:00',
                  upvoteCount: 5,
                  downvoteCount: 0,
                  author: { '@type': 'Person', name: 'Contractor' },
                },
              ],
            },
          },
        ],
      },
    ]);
  });

  it('puts all answers in suggestedAnswer when none are marked as accepted by Bazaarvoice', async () => {
    vi.mocked(fetchProductQuestions).mockResolvedValue([
      {
        Id: 'q-no-featured',
        QuestionSummary: 'What is the lifespan?',
        SubmissionTime: '2026-09-01T10:00:00.000+00:00',
        AnswerIds: ['a1', 'a2'],
        Answers: [
          {
            Id: 'a1',
            QuestionId: 'q-no-featured',
            AnswerText: 'About 20 years with proper maintenance.',
            SubmissionTime: '2026-09-02T10:00:00.000+00:00',
            TotalPositiveFeedbackCount: 10,
          },
          {
            Id: 'a2',
            QuestionId: 'q-no-featured',
            AnswerText: 'Ours lasted 25 years.',
            SubmissionTime: '2026-09-03T10:00:00.000+00:00',
            TotalPositiveFeedbackCount: 3,
          },
        ],
      },
    ]);

    const result = await plugin(componentParams(fields('100-AWN'), [product]));
    const productWithQA = result[0] as {
      subjectOf?: Array<{
        mainEntity?: {
          acceptedAnswer?: unknown;
          suggestedAnswer?: unknown;
          answerCount?: number;
        };
      }>;
    };
    const question = productWithQA.subjectOf?.[0]?.mainEntity;

    expect(question?.acceptedAnswer).toBeUndefined();
    expect(question?.answerCount).toBe(2);
    expect(question?.suggestedAnswer).toEqual([
      {
        '@type': 'Answer',
        '@id': 'https://www.andersenwindows.com/#/schema/Answer/Bazaarvoice/a1',
        text: 'About 20 years with proper maintenance.',
        dateCreated: '2026-09-02T10:00:00.000+00:00',
        upvoteCount: 10,
        downvoteCount: 0,
        author: undefined,
      },
      {
        '@type': 'Answer',
        '@id': 'https://www.andersenwindows.com/#/schema/Answer/Bazaarvoice/a2',
        text: 'Ours lasted 25 years.',
        dateCreated: '2026-09-03T10:00:00.000+00:00',
        upvoteCount: 3,
        downvoteCount: 0,
        author: undefined,
      },
    ]);
  });

  it('emits multiple QAPages when the product has multiple questions', async () => {
    vi.mocked(fetchProductQuestions).mockResolvedValue([
      {
        Id: 'q-unanswered',
        QuestionSummary: 'test',
        SubmissionTime: '2017-01-01T10:00:00.000+00:00',
        UserNickname: 'test',
        AnswerIds: [],
        Answers: [],
      },
      {
        Id: 'q-rejected-only',
        QuestionSummary: 'Question with only rejected answers?',
        SubmissionTime: '2026-09-01T10:00:00.000+00:00',
        AnswerIds: ['a-rej'],
        Answers: [
          {
            Id: 'a-rej',
            QuestionId: 'q-rejected-only',
            AnswerText: 'Rejected answer',
            IsRejected: true,
          },
        ],
      },
    ]);

    const result = await plugin(componentParams(fields('100-AWN'), [product]));

    expect(result).toEqual([
      {
        ...product,
        subjectOf: [
          {
            '@type': 'QAPage',
            '@id':
              'https://www.andersenwindows.com/#/schema/QAPage/Bazaarvoice/100-AWN/q-unanswered',
            mainEntity: {
              '@type': 'Question',
              '@id': 'https://www.andersenwindows.com/#/schema/Question/Bazaarvoice/q-unanswered',
              name: 'test',
              text: 'test',
              dateCreated: '2017-01-01T10:00:00.000+00:00',
              answerCount: 0,
              upvoteCount: 0,
              author: { '@type': 'Person', name: 'test' },
              acceptedAnswer: undefined,
              suggestedAnswer: undefined,
            },
          },
          {
            '@type': 'QAPage',
            '@id':
              'https://www.andersenwindows.com/#/schema/QAPage/Bazaarvoice/100-AWN/q-rejected-only',
            mainEntity: {
              '@type': 'Question',
              '@id':
                'https://www.andersenwindows.com/#/schema/Question/Bazaarvoice/q-rejected-only',
              name: 'Question with only rejected answers?',
              text: 'Question with only rejected answers?',
              dateCreated: '2026-09-01T10:00:00.000+00:00',
              answerCount: 0,
              upvoteCount: 0,
              author: undefined,
              acceptedAnswer: undefined,
              suggestedAnswer: undefined,
            },
          },
        ],
      },
    ]);
  });

  it('does not fetch questions when the component has no product id or Product graph node', async () => {
    expect(await plugin(componentParams(fields(''), [product]))).toEqual([product]);
    expect(await plugin(componentParams(fields('100-AWN'), []))).toEqual([]);
    expect(fetchProductQuestions).not.toHaveBeenCalled();
  });
});
