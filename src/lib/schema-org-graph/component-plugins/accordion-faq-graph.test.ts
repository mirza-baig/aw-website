import { ComponentRendering, Field, SiteInfo } from '@sitecore-content-sdk/nextjs';
import { Thing } from 'schema-dts';
import { describe, expect, it } from 'vitest';

import { ComponentPluginParams } from '../plugin-types';
import { plugin } from './accordion-faq-graph';

const siteInfo: SiteInfo = {
  hostName: '*',
  language: 'en',
  name: 'AndersenWindows',
  targetHostName: 'www.andersenwindows.com',
  canonicalHostName: 'https://www.andersenwindows.com',
};

type AccordionFields = { generateFaqSchema?: Field<boolean> };

function params(
  fields: AccordionFields,
  rendering: ComponentRendering,
  graph: Thing[] = []
): ComponentPluginParams<AccordionFields> {
  return {
    graph,
    fields,
    rendering,
    page: {
      customProps: { siteInfo },
      layout: { sitecore: {} },
    } as unknown as ComponentPluginParams<AccordionFields>['page'],
  };
}

function accordionWithSections(
  uid: string,
  sections: Array<{ title: string; answers: string[] }>
): ComponentRendering {
  return {
    uid,
    componentName: 'Accordion',
    placeholders: {
      [`accordion-1`]: sections.map((s, i) => ({
        uid: `section-${i}`,
        componentName: 'AccordionSection',
        fields: { sectionTitle: { value: s.title } },
        placeholders: {
          [`section-1`]: s.answers.map((answer, j) => ({
            uid: `block-${i}-${j}`,
            componentName: 'ContentBlock',
            fields: { body: { value: answer } },
          })),
        },
      })),
    },
  } as unknown as ComponentRendering;
}

describe('schema-org-graph > component-plugins > accordion-faq-graph', () => {
  it('emits a FAQPage with one Question per AccordionSection when generateFaqSchema is true', () => {
    const rendering = accordionWithSections('acc-123', [
      {
        title: 'How long is the Andersen warranty?',
        answers: ['<p>We offer multiple warranties for our products.</p>'],
      },
      {
        title: 'How do I make a claim?',
        answers: ['Contact Andersen support with your product serial number.'],
      },
    ]);

    const result = plugin(params({ generateFaqSchema: { value: true } }, rendering));

    expect(result).toEqual([
      {
        '@type': 'FAQPage',
        '@id': 'https://www.andersenwindows.com/#/schema/FAQPage/acc-123',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How long is the Andersen warranty?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We offer multiple warranties for our products.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do I make a claim?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Contact Andersen support with your product serial number.',
            },
          },
        ],
      },
    ]);
  });

  it('does nothing when generateFaqSchema is false or missing', () => {
    const rendering = accordionWithSections('acc-x', [{ title: 'Q', answers: ['A'] }]);

    expect(plugin(params({}, rendering))).toEqual([]);
    expect(plugin(params({ generateFaqSchema: { value: false } }, rendering))).toEqual([]);
  });

  it('joins multiple ContentBlocks under one section into a single answer', () => {
    const rendering = accordionWithSections('acc-multi', [
      {
        title: 'Multi-part question',
        answers: ['First paragraph.', '<p>Second paragraph.</p>'],
      },
    ]);

    const result = plugin(
      params({ generateFaqSchema: { value: true } }, rendering)
    ) as unknown as Array<{
      mainEntity: Array<{ acceptedAnswer: { text: string } }>;
    }>;

    expect(result[0].mainEntity[0].acceptedAnswer.text).toBe('First paragraph. Second paragraph.');
  });

  it('skips sections that are missing a question or an answer', () => {
    const rendering = {
      uid: 'acc-partial',
      componentName: 'Accordion',
      placeholders: {
        'accordion-1': [
          {
            uid: 's1',
            componentName: 'AccordionSection',
            fields: { sectionTitle: { value: 'Has an answer' } },
            placeholders: {
              'section-1': [
                {
                  uid: 'b1',
                  componentName: 'ContentBlock',
                  fields: { body: { value: 'Here is the answer.' } },
                },
              ],
            },
          },
          {
            uid: 's2',
            componentName: 'AccordionSection',
            fields: { sectionTitle: { value: 'No answer section' } },
            placeholders: { 'section-1': [] },
          },
          {
            uid: 's3',
            componentName: 'AccordionSection',
            fields: { sectionTitle: { value: '' } },
            placeholders: {
              'section-1': [
                {
                  uid: 'b3',
                  componentName: 'ContentBlock',
                  fields: { body: { value: 'Answer with no question.' } },
                },
              ],
            },
          },
        ],
      },
    } as unknown as ComponentRendering;

    const result = plugin(
      params({ generateFaqSchema: { value: true } }, rendering)
    ) as unknown as Array<{
      mainEntity: Array<{ name: string }>;
    }>;

    expect(result).toHaveLength(1);
    expect(result[0].mainEntity).toHaveLength(1);
    expect(result[0].mainEntity[0].name).toBe('Has an answer');
  });

  it('emits nothing when the Accordion has no AccordionSection children', () => {
    const rendering = {
      uid: 'empty-acc',
      componentName: 'Accordion',
      placeholders: { 'accordion-1': [] },
    } as unknown as ComponentRendering;

    expect(plugin(params({ generateFaqSchema: { value: true } }, rendering))).toEqual([]);
  });
});
