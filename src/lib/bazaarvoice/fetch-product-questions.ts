import config from 'aw.config.server';

const QUESTION_LIMIT = 100;

export type BazaarvoiceAnswerData = {
  Id?: string;
  QuestionId?: string;
  AnswerText?: string | null;
  SubmissionTime?: string;
  UserNickname?: string | null;
  TotalPositiveFeedbackCount?: number;
  TotalNegativeFeedbackCount?: number;
  IsRejected?: boolean;
  IsFeatured?: boolean;
  ContextDataValues?: Record<string, { Value?: string; ValueLabel?: string }>;
};

export type BazaarvoiceQuestionData = {
  Id?: string;
  ProductId?: string;
  QuestionSummary?: string | null;
  QuestionDetails?: string | null;
  SubmissionTime?: string;
  UserNickname?: string | null;
  TotalAnswerCount?: number;
  TotalPositiveFeedbackCount?: number;
  AnswerIds?: string[];
  Answers?: BazaarvoiceAnswerData[]; // normalized in this module from Includes
};

type BazaarvoiceQuestionsResponse = {
  Errors?: {
    Code?: string;
    Message?: string;
  }[];
  Results?: BazaarvoiceQuestionData[];
  Includes?: {
    Answers?: Record<string, BazaarvoiceAnswerData>;
  };
};

export async function fetchProductQuestions(
  bazaarvoiceProductId: string
): Promise<BazaarvoiceQuestionData[]> {
  const sanitizedId = bazaarvoiceProductId.trim();
  if (!sanitizedId) {
    return [];
  }

  if (!config.bazaarvoice.apiUrl || !config.bazaarvoice.apiKey) {
    console.error('[fetch-product-questions] Bazaarvoice API configuration is missing');
    return [];
  }
  const questionsUrl = config.bazaarvoice.apiUrl.replace('reviews.json', 'questions.json');
  const apiUrl = `${questionsUrl}${config.bazaarvoice.apiKey}&Filter=ProductId:${encodeURIComponent(
    sanitizedId
  )}&Include=Answers&Sort=SubmissionTime:desc&Limit=${QUESTION_LIMIT}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      console.error('[fetch-product-questions] API error:', response.status, response.statusText);
      return [];
    }

    const data = (await response.json()) as BazaarvoiceQuestionsResponse;
    if (data.Errors?.length) {
      console.error('[fetch-product-questions] API response errors:', data.Errors);
      return [];
    }

    const questions = Array.isArray(data.Results) ? data.Results : [];
    if (!questions.length) {
      return [];
    }

    const answersById = data.Includes?.Answers ?? {};
    return questions.map((q) => ({
      ...q,
      Answers: (q.AnswerIds ?? [])
        .map((id) => answersById[id])
        .filter((a): a is BazaarvoiceAnswerData => Boolean(a)),
    }));
  } catch (error) {
    console.error('[fetch-product-questions] Fetch failed:', error);
    return [];
  }
}
