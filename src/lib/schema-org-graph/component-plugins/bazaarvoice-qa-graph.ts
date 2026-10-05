import { Field } from '@sitecore-content-sdk/nextjs';
import {
  BazaarvoiceAnswerData,
  BazaarvoiceQuestionData,
  fetchProductQuestions,
} from 'lib/bazaarvoice/fetch-product-questions';
import { Answer, Person, Question, Thing } from 'schema-dts';

import { hasGraphNode, updateGraphNode } from '../graph-utils';
import { ComponentPluginParams } from '../plugin-types';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export const componentName = 'BazaarvoiceQuestionAnswer';

type BazaarvoiceQAFields =
  Sitecore.Components.General.BazaarvoiceQuestionAnswer.BazaarvoiceQuestionAnswer['fields'];

const stripHtml = (value: string | null | undefined): string =>
  (value ?? '')
    .replaceAll(/<[^>]*>/g, '')
    .replaceAll(/\s+/g, ' ')
    .trim();

function pickAcceptedAnswer(answers: BazaarvoiceAnswerData[]): BazaarvoiceAnswerData | undefined {
  return answers.find((a) => a.IsFeatured || a.ContextDataValues?.ClientResponse);
}

function toSchemaAnswer(answer: BazaarvoiceAnswerData, canonicalHostName: string): Answer | null {
  const id = answer.Id?.trim();
  const text = stripHtml(answer.AnswerText);
  if (!id || !text) {
    return null;
  }

  const nickname = answer.UserNickname?.trim();
  const author: Person | undefined = nickname
    ? { '@type': 'Person', name: nickname.slice(0, 100) }
    : undefined;

  return {
    '@type': 'Answer',
    '@id': `${canonicalHostName}/#/schema/Answer/Bazaarvoice/${id}`,
    text,
    dateCreated: answer.SubmissionTime || undefined,
    upvoteCount: answer.TotalPositiveFeedbackCount ?? 0,
    downvoteCount: answer.TotalNegativeFeedbackCount ?? 0,
    author,
  };
}

function toSchemaQuestion(
  question: BazaarvoiceQuestionData,
  canonicalHostName: string
): Question | null {
  const id = question.Id?.trim();
  const summary = stripHtml(question.QuestionSummary);
  if (!id || !summary) {
    return null;
  }

  const rawAnswers = (question.Answers ?? []).filter((a) => !a.IsRejected && a.AnswerText);
  const acceptedRaw = pickAcceptedAnswer(rawAnswers);
  const suggestedRaw = rawAnswers.filter((a) => a.Id !== acceptedRaw?.Id);

  const acceptedAnswer = acceptedRaw ? toSchemaAnswer(acceptedRaw, canonicalHostName) : null;
  const suggestedAnswers = suggestedRaw
    .map((a) => toSchemaAnswer(a, canonicalHostName))
    .filter((a): a is Answer => a !== null);

  const totalAnswers = (acceptedAnswer ? 1 : 0) + suggestedAnswers.length;

  const nickname = question.UserNickname?.trim();
  const author: Person | undefined = nickname
    ? { '@type': 'Person', name: nickname.slice(0, 100) }
    : undefined;

  return {
    '@type': 'Question',
    '@id': `${canonicalHostName}/#/schema/Question/Bazaarvoice/${id}`,
    name: summary,
    text: stripHtml(question.QuestionDetails) || summary,
    dateCreated: question.SubmissionTime || undefined,
    answerCount: totalAnswers,
    upvoteCount: question.TotalPositiveFeedbackCount ?? 0,
    author,
    acceptedAnswer: acceptedAnswer ?? undefined,
    suggestedAnswer: suggestedAnswers.length ? suggestedAnswers : undefined,
  };
}

export async function plugin({
  graph,
  fields,
  page,
}: ComponentPluginParams<BazaarvoiceQAFields>): Promise<Thing[]> {
  const bazaarvoiceProductId = (
    fields?.productItem?.fields?.bazaarvoiceProductId as Field<string> | undefined
  )?.value?.trim();

  if (!bazaarvoiceProductId || !hasGraphNode(graph, 'Product')) {
    return graph;
  }

  const questionData = await fetchProductQuestions(bazaarvoiceProductId);
  if (!questionData.length) {
    return graph;
  }

  const canonicalHostName = (page.customProps.siteInfo?.canonicalHostName ?? '') as string;

  const questions = questionData
    .map((q) => toSchemaQuestion(q, canonicalHostName))
    .filter((q): q is Question => q !== null);

  if (!questions.length) {
    return graph;
  }

  const qaPages = questions.map((question) => ({
    '@type': 'QAPage',
    '@id': `${canonicalHostName}/#/schema/QAPage/Bazaarvoice/${bazaarvoiceProductId}/${
      (question['@id'] as string).split('/').pop() ?? ''
    }`,
    mainEntity: question,
  }));

  return updateGraphNode(graph, 'Product', (node) => ({
    ...node,
    subjectOf: qaPages,
  }));
}
