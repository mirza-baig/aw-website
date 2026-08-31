import { Debug } from 'lib/constants/debug';

import { Plugin } from './plugin-types';
import * as Article from './plugins/article-graph';
import * as Brand from './plugins/brand-graph';
import * as Breadcrumb from './plugins/breadcrumb-graph';
import * as Organization from './plugins/organization-graph';
import * as Product from './plugins/product-graph';
import * as Website from './plugins/website-graph';

const plugins = new Map<string, Plugin<unknown>>();

plugins.set(Organization.pluginId, Organization.plugin);
plugins.set(Product.pluginId, Product.plugin);
plugins.set(Website.pluginId, Website.plugin);
plugins.set(Breadcrumb.pluginId, Breadcrumb.plugin);
plugins.set(Article.pluginId, Article.plugin);
plugins.set(Brand.pluginId, Brand.plugin);

/**
 * @function factory
 * @param  id: string - Identifier for the plugin to retrieve
 * @returns Plugin<unknown> | undefined - The plugin corresponding to the given id, or undefined if not found
 */
export function factory<TData = unknown>(id: string): Plugin<TData> | undefined {
  const normalizedId = id.replaceAll(/[{}]/g, '');
  const plugin = plugins.get(normalizedId);

  if (plugin != undefined) {
    return plugin;
  }

  Debug.schemaOrgGraph(`No plugin defined for ${id}`);

  return undefined;
}
