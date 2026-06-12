import { articlePropertiesPlugin } from './plugins/article-properties';
import { awPagePropertiesPlugin } from './plugins/aw-page-properties';
import { awPhotoPropertiesPlugin } from './plugins/aw-photo-properties';
import { pagePropertiesPlugin } from './plugins/page-properties';
import { photoPropertiesPlugin } from './plugins/photo-properties';
import { productPropertiesPlugin } from './plugins/product-properties';
import { projectShowcasePropertiesPlugin } from './plugins/project-showcase-properties';
import { sitecorePropertiesPlugin } from './plugins/sitecore-properties';
import { techDocumentPropertiesPlugin } from './plugins/tech-document-properties';
import { videoPropertiesPlugin } from './plugins/video-properties';

const plugins = [
  articlePropertiesPlugin,
  awPagePropertiesPlugin,
  awPhotoPropertiesPlugin,
  pagePropertiesPlugin,
  photoPropertiesPlugin,
  productPropertiesPlugin,
  projectShowcasePropertiesPlugin,
  sitecorePropertiesPlugin,
  techDocumentPropertiesPlugin,
  videoPropertiesPlugin,
];

import { IndexableItem, SitemapItem } from '../';

export interface Plugin {
  /**
   * Detect order when the plugin should be called, e.g. 0 - will be called first (can be a plugin which data is required for other plugins)
   */
  order: number;
  /**
   * A function which will be called during page props generation
   */
  exec(siteMapItem: SitemapItem, indexableItem: IndexableItem, host?: string): Promise<SitemapItem>;
}

export class CoveoIndexingItemProcessor {
  /**
   * Create SitecorePageProps for given context (SSR / GetServerSidePropsContext or SSG / GetStaticPropsContext)
   * @param {IndexableItem} indexableItem
   * @see SiteMapItem
   */
  public async process(indexableItem: IndexableItem, host?: string): Promise<SitemapItem> {
    const extendedProps = await (Object.values(plugins) as Plugin[])
      .sort((p1, p2) => p1.order - p2.order)
      .reduce(async (result, plugin) => {
        const props = await result;
        const newProps = await plugin.exec(props, indexableItem, host);
        return newProps;
      }, Promise.resolve(new SitemapItem()));

    return extendedProps;
  }
}

export const coveoIndexingItemProcessor = new CoveoIndexingItemProcessor();
