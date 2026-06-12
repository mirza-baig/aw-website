import { SiteInfo } from '@sitecore-content-sdk/nextjs';
import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { SearchQueryService } from 'lib/graphql/search-query-service';
import { AWSitecoreClient } from 'lib/sitecore-client';
import { environment } from 'startup/environment';
import { create } from 'xmlbuilder2';

const sitemapQuery = /* GraphQL */ `
  query SitemapPaths($rootItemId: String!, $language: String!, $pageSize: Int = 100, $after: String) {
    search(
      where:{
        AND: [
          { name: "_hasLayout", value: "true" }
          { name: "_path", value: $rootItemId, operator: CONTAINS }
          { name: "_templates", value: "${SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.BaseTemplates._BasePage.Id}", operator: CONTAINS }
          { name: "changefrequency", value: "${SitecoreIds.System.Settings.Foundation.ExperienceAccelerator.SiteMetadata.Enums.SitemapChangeFrequency.doNotInclude.Id}", operator: NEQ }
          { name: "_language", value: $language }
        ]
      }
      first: $pageSize
      after: $after
  ) {
      total
      pageInfo {
        endCursor
        hasNext
      }
      results {
        id
        name
        url {
          path
        }
        changeFrequency: field(name: "ChangeFrequency") {
          value
        }
      }
    }
  }
`;

type SitemapQueryResult = {
  url: {
    path: string;
  };
  changeFrequency: {
    value: string;
  };
};

// The query for fetching a product with no children
const layoutRenderedQuery = /* GraphQL */ `
  query LayoutRendered($site: String!, $routePath: String!, $language: String!) {
    layout(site: $site, routePath: $routePath, language: $language) {
      item {
        rendered
      }
    }
  }
`;

type LayoutRenderedQueryResult = {
  layout: {
    item: {
      rendered: unknown;
    };
  };
};

const siteRootIdQuery = /* GraphQL */ `
  query HomePageIdQuery($siteName: String!, $language: String!) {
    layout(site: $siteName, routePath: "/", language: $language) {
      homePage: item {
        parent {
          id
        }
      }
    }
  }
`;

type SiteRootIdQueryResult = {
  layout: {
    homePage: {
      parent: {
        id: string;
      };
    };
  };
};

export type ImageSitemapServiceConfig = {
  /**
   * A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
   * This factory function is used to create and configure GraphQL clients for making GraphQL API requests.
   */
  sitecoreClient: AWSitecoreClient;
};

/**
 * Service that fetches the rendered layout for a specific page.
 */
export class ImageSitemapService {
  private readonly sitemapPathQueryService: SearchQueryService;

  protected get query(): string {
    return layoutRenderedQuery;
  }

  constructor(public options: ImageSitemapServiceConfig) {
    this.sitemapPathQueryService = new SearchQueryService({
      sitecoreClient: this.options.sitecoreClient,
    });
  }

  // Generate a sitemap of sitemap URLs which would be used to fetch the actual image sitemap XMLs.
  async generateImageSitemapIndex(site: SiteInfo, hostName: string): Promise<string> {
    const paths = await this.fetchPaths(site);
    const root = create({ encoding: 'UTF-8' }).ele(
      'http://www.sitemaps.org/schemas/sitemap/0.9',
      'sitemapindex'
    );
    paths.forEach((path) => {
      if (!path) {
        return;
      }
      root.ele('sitemap').ele('loc').txt(`https://${hostName}/image-sitemap.xml?path=${path}`);
    });

    const xml = root.end({ prettyPrint: true });

    return xml;
  }

  // Generate the actual image sitemap XML for a given set of paths.
  async generateImageSitemap(site: SiteInfo, path: string, hostName: string): Promise<string> {
    const root = create({ encoding: 'UTF-8' })
      .ele('urlset')
      .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
      .att('xmlns:xhtml', 'http://www.w3.org/TR/xhtml11/xhtml11_schema.html')
      .att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
      .att('xmlns:image', 'http://www.google.com/schemas/sitemap-image/1.1')
      .att(
        'xsi:schemaLocation',
        'http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.w3.org/TR/xhtml11/xhtml11_schema.html http://www.w3.org/2002/08/xhtml/xhtml1-strict.xsd'
      );

    const layout = await this.fetchLayoutRendered(site.name, path, site.language);

    const defaultUrl = `https://${hostName}${path}`;

    const url = root.ele('url');

    url.ele('loc').txt(defaultUrl);

    const stringifiedLayout = JSON.stringify(layout.layout.item.rendered);

    // Replace all \n with a space to break apart any urls within rich text content.
    // Replace all edge.sitecorecloud.io/andersencor{environment}-* media URLs with the site target hostname
    const replacedLayout = stringifiedLayout
      .replaceAll('\\n', ' ')
      .replace(
        /https:\/\/edge\.sitecorecloud\.io\/andersencor[^/]+(\/media\/[^\s"'\\)]+)/g,
        `https://${hostName}/-$1`
      );

    const mediaLibraryRegex =
      /https?:\/\/[^"' ]*\/-\/media\/[^"' ]+\.(jpg|jpeg|png|gif|bmp|webp|svg)(\?[^"' ]*)?(#[^"' ]*)?\b/gi;
    const matches = replacedLayout.match(mediaLibraryRegex);

    if (matches) {
      matches.forEach((match) => {
        // --- STRIP TIME LIMIT PARAMETERS ---
        const imageUrl = new URL(match);
        imageUrl.searchParams.delete('tt');
        imageUrl.searchParams.delete('ttc');
        match = imageUrl.toString();

        url.ele('image:image').ele('image:loc').txt(match);
      });
    }

    const xml = root.end({ prettyPrint: true });

    return xml;
  }

  /**
   * Fetch the requested page layout rendered as JSON.
   * @throws {Error} if the formatted itemId returns nothing.
   */
  protected async fetchLayoutRendered(
    site: string,
    routePath: string,
    language = 'en'
  ): Promise<LayoutRenderedQueryResult> {
    const result = await this.options.sitecoreClient.getData<LayoutRenderedQueryResult>(
      this.query,
      {
        site,
        routePath,
        language,
      }
    );

    return result;
  }

  protected async fetchPaths(site: SiteInfo): Promise<string[]> {
    const rootItemId = await this.options.sitecoreClient.getData<SiteRootIdQueryResult>(
      siteRootIdQuery,
      { siteName: site.name, language: site.language }
    );

    let results = await this.sitemapPathQueryService.fetchAllResults<SitemapQueryResult>(
      sitemapQuery,
      {
        rootItemId: rootItemId.layout.homePage.parent.id,
        language: site.language,
      }
    );

    // Experience Edge peforms the query correctly, but XMC does not, so filter out for them
    if (environment.isPreview()) {
      results = results.filter(
        (path) =>
          path.changeFrequency.value !=
          `{${SitecoreIds.System.Settings.Foundation.ExperienceAccelerator.SiteMetadata.Enums.SitemapChangeFrequency.doNotInclude.Id}}`
      );
    }

    const paths = results.map((path) => path.url.path);

    return paths;
  }
}
