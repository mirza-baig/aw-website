import { ComponentRendering, Field } from '@sitecore-content-sdk/nextjs';
import { FAQPage, Question, Thing } from 'schema-dts';

import { ComponentPluginParams } from '../plugin-types';

export const componentName = 'Accordion';

type AccordionFields = {
  generateFaqSchema?: Field<boolean>;
};

type AccordionSectionRendering = ComponentRendering & {
  fields?: {
    sectionTitle?: Field<string>;
  };
};

type ContentBlockRendering = ComponentRendering & {
  fields?: {
    body?: Field<string>;
  };
};

const ACCORDION_SECTION_COMPONENT = 'AccordionSection';
const CONTENT_BLOCK_COMPONENT = 'ContentBlock';

const stripHtml = (value: string | null | undefined): string =>
  (value ?? '')
    .replaceAll(/<[^>]*>/g, '')
    .replaceAll(/\s+/g, ' ')
    .trim();

function readStringField(field: Field<string> | undefined): string {
  const value = field?.value;
  return typeof value === 'string' ? value : '';
}

function readBooleanField(field: Field<boolean> | undefined): boolean {
  return field?.value === true;
}

function childRenderings(rendering: ComponentRendering): ComponentRendering[] {
  if (!rendering.placeholders) {
    return [];
  }
  const children: ComponentRendering[] = [];
  for (const items of Object.values(rendering.placeholders)) {
    for (const item of items) {
      if ('componentName' in item) {
        children.push(item);
      }
    }
  }
  return children;
}

function extractAnswerText(section: AccordionSectionRendering): string {
  const contentBlocks = childRenderings(section).filter(
    (child) => child.componentName === CONTENT_BLOCK_COMPONENT
  ) as ContentBlockRendering[];

  const parts: string[] = [];
  for (const block of contentBlocks) {
    const text = stripHtml(readStringField(block.fields?.body));
    if (text) {
      parts.push(text);
    }
  }
  return parts.join(' ').trim();
}

function toFaqQuestion(section: AccordionSectionRendering): Question | null {
  const question = stripHtml(readStringField(section.fields?.sectionTitle));
  const answer = extractAnswerText(section);
  if (!question || !answer) {
    return null;
  }
  return {
    '@type': 'Question',
    name: question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: answer,
    },
  };
}

export function plugin({
  graph,
  rendering,
  fields,
  page,
}: ComponentPluginParams<AccordionFields>): Thing[] {
  if (!readBooleanField(fields?.generateFaqSchema)) {
    return graph;
  }

  const sections = childRenderings(rendering).filter(
    (child) => child.componentName === ACCORDION_SECTION_COMPONENT
  ) as AccordionSectionRendering[];

  const questions = sections.map(toFaqQuestion).filter((q): q is Question => q !== null);

  if (!questions.length) {
    return graph;
  }

  const canonicalHostName = (page.customProps.siteInfo?.canonicalHostName ?? '') as string;
  const renderingId = (rendering.uid ?? rendering.dataSource ?? '').toString();

  const faqPage: FAQPage = {
    '@type': 'FAQPage',
    '@id': `${canonicalHostName}/#/schema/FAQPage/${renderingId}`,
    mainEntity: questions,
  };

  return [...graph, faqPage];
}
