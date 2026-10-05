import * as BazaarvoiceQuestionAnswer from './component-plugins/bazaarvoice-qa-graph';
import * as BazaarvoiceReviews from './component-plugins/bazaarvoice-reviews-graph';
import * as ContentBlockWithMedia from './component-plugins/content-block-with-media-graph';
import * as GenericCard from './component-plugins/generic-card-video-graph';
import * as PrimaryImage from './component-plugins/primary-image-graph';
import * as ProductIntro from './component-plugins/product-intro-graph';
import * as PromoGeneric from './component-plugins/promo-generic-graph';
import { ComponentPlugin } from './plugin-types';

const componentPlugins = new Map<string, ComponentPlugin<unknown>>();

componentPlugins.set(
  BazaarvoiceQuestionAnswer.componentName,
  BazaarvoiceQuestionAnswer.plugin as ComponentPlugin<unknown>
);
componentPlugins.set(
  BazaarvoiceReviews.componentName,
  BazaarvoiceReviews.plugin as ComponentPlugin<unknown>
);
componentPlugins.set(
  ContentBlockWithMedia.componentName,
  ContentBlockWithMedia.plugin as ComponentPlugin<unknown>
);
componentPlugins.set(GenericCard.componentName, GenericCard.plugin as ComponentPlugin<unknown>);
componentPlugins.set(ProductIntro.componentName, ProductIntro.plugin as ComponentPlugin<unknown>);
componentPlugins.set(PromoGeneric.componentName, PromoGeneric.plugin as ComponentPlugin<unknown>);

export function componentFactory<TFields = unknown>(name: string): ComponentPlugin<TFields> {
  const componentPlugin = componentPlugins.get(name);

  return async (params) => {
    let graph = PrimaryImage.plugin({
      ...params,
      fields: params.fields as PrimaryImage.PrimaryImageFields,
    });

    if (componentPlugin) {
      graph = await componentPlugin({ ...params, graph });
    }

    return graph;
  };
}
