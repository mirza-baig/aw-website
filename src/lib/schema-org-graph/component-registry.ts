import * as ContentBlockWithMedia from './component-plugins/content-block-with-media-graph';
import * as GenericCard from './component-plugins/generic-card-video-graph';
import * as ProductIntro from './component-plugins/product-intro-graph';
import * as PromoGeneric from './component-plugins/promo-generic-graph';
import { ComponentPlugin } from './plugin-types';

const componentPlugins = new Map<string, ComponentPlugin<unknown>>();

componentPlugins.set(
  ContentBlockWithMedia.componentName,
  ContentBlockWithMedia.plugin as ComponentPlugin<unknown>
);
componentPlugins.set(GenericCard.componentName, GenericCard.plugin as ComponentPlugin<unknown>);
componentPlugins.set(ProductIntro.componentName, ProductIntro.plugin as ComponentPlugin<unknown>);
componentPlugins.set(PromoGeneric.componentName, PromoGeneric.plugin as ComponentPlugin<unknown>);

export function componentFactory<TFields = unknown>(
  name: string
): ComponentPlugin<TFields> | undefined {
  const plugin = componentPlugins.get(name);
  return plugin as ComponentPlugin<TFields> | undefined;
}
