import { Page } from '@sitecore-content-sdk/nextjs';
import { ItemFieldResult } from 'lib/graphql/types/item-field-result';
import sitecoreClient from 'lib/sitecore-client';
import { WebsiteStaticState } from 'lib/website/website-state';
import { JSX } from 'react';
import { Graph, Thing } from 'schema-dts';

import { componentFactory } from './component-registry';
import { factory } from './factory';
import { getAllRenderings } from './get-all-renderings';
import { ComponentPlugin } from './plugin-types';
import * as Article from './plugins/article-graph';
import * as Breadcrumb from './plugins/breadcrumb-graph';
import * as PagePrimaryImage from './plugins/page-primary-image-graph';
import * as WebPage from './plugins/webpage-graph';
import { SchemaOrgGraphService } from './schema-org-graph-service';
import { Sitecore } from '.sitecore/AndersenWindows.model';

// Normalizes integrated GraphQL rendering fields to the standard field-map shape
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeSitecoreFields(fields: ItemFieldResult[]): Record<string, any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: Record<string, any> = {};
  fields.forEach((field) => {
    if (!field.name) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fieldResult = field as any;
    if (fieldResult.__typename === 'MultilistField' && fieldResult.targetItems) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result[field.name] = fieldResult.targetItems.map((item: any) => ({
        id: item.id,
        name: item.name,
        url: item.url?.path ?? item.url,
        fields: normalizeSitecoreFields(item.fields || []),
      }));
    } else if (fieldResult.__typename === 'ImageField') {
      result[field.name] = {
        value: {
          src: fieldResult.src,
          alt: fieldResult.alt,
          width: fieldResult.width,
          height: fieldResult.height,
        },
      };
    } else {
      const value =
        fieldResult.value ??
        fieldResult.numberValue ??
        fieldResult.intValue ??
        fieldResult.boolValue ??
        fieldResult.jsonValue;
      result[field.name] = { value };
    }
  });
  return result;
}

type SchemaOrgGraphProps = Readonly<{
  page: Page & {
    customProps: WebsiteStaticState;
  };
}>;

export async function SchemaOrgGraph(props: SchemaOrgGraphProps): Promise<JSX.Element | null> {
  const { page } = props;
  if (page === undefined) {
    return null;
  }

  if (!page.customProps.featureFlags.releaseSchemaOrgGraph) {
    return null;
  }

  const pageLevelData = (page.layout.sitecore.route?.fields?.schemaOrgGraph ??
    []) as unknown as Sitecore.BaseTemplates.BaseSchemaOrgGraph[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let settingsLevelData: any[] = [];
  const rootPath = page.customProps.siteInfo?.rootPath as string | undefined;

  if (rootPath) {
    const service = new SchemaOrgGraphService(sitecoreClient);
    const rawSettingsData = await service.getSettingsSchemaOrgGraph(rootPath, page.locale);
    settingsLevelData = rawSettingsData.map((item) => ({
      ...item,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fields: normalizeSitecoreFields((item as any).fields || []),
    }));
  }

  const templateMap = new Map<string, Sitecore.BaseTemplates.BaseSchemaOrgGraph>();
  [...settingsLevelData, ...pageLevelData].forEach((data) => {
    const fields = data.fields;
    const templateId = fields?._AW_TemplateId?.value ?? fields?._AW_TemplateId;
    if (typeof templateId === 'string') {
      templateMap.set(templateId, data);
    }
  });

  const automaticPlugins = [
    WebPage.plugin,
    Breadcrumb.plugin,
    Article.plugin,
    PagePrimaryImage.plugin,
  ];

  const pagePluginGraph = Array.from(templateMap.entries()).reduce(
    (graph, [templateId, data]) => {
      const plugin = factory(templateId);
      if (plugin) {
        graph = plugin({ graph, page, data: data.fields });
      }
      return graph;
    },
    automaticPlugins.reduce((g, p) => p({ graph: g, page, data: undefined }), [] as Thing[])
  );

  const renderings = getAllRenderings(page.layout.sitecore.route?.placeholders);
  let graph = pagePluginGraph;
  for (const rendering of renderings) {
    const componentPlugin: ComponentPlugin<unknown> | undefined = componentFactory(
      rendering.componentName
    );
    if (componentPlugin) {
      graph = await Promise.resolve(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        componentPlugin({ graph, rendering, fields: rendering.fields as any, page })
      );
    }
  }

  const jsonLd: Graph = {
    '@context': 'https://schema.org',
    '@graph': graph,
  };

  return (
    <script
      id="schema-org-graph"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replaceAll('<', String.raw`\u003c`),
      }}
    />
  );
}
