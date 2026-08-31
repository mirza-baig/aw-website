import { ComponentRendering, Page } from '@sitecore-content-sdk/nextjs';
import { WebsiteStaticState } from 'lib/website/website-state';
import type { Thing } from 'schema-dts';

export type PluginParams<T> = {
  graph: Thing[];
  data: T;
  page: Page & {
    customProps: WebsiteStaticState;
  };
};

export type Plugin<TData> = (params: PluginParams<TData>) => Thing[];

export type ComponentPluginParams<TFields> = {
  graph: Thing[];
  rendering: ComponentRendering;
  fields: TFields;
  page: Page & {
    customProps: WebsiteStaticState;
  };
};

export type ComponentPlugin<TFields = unknown> = (
  params: ComponentPluginParams<TFields>
) => Thing[] | Promise<Thing[]>;
