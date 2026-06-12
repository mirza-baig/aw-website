import { GraphQLRequestClientFactory } from '@sitecore-content-sdk/core';
import { SitecoreConfig } from '@sitecore-content-sdk/nextjs/config';
import { ProxyBase, ProxyBaseConfig } from '@sitecore-content-sdk/nextjs/proxy';
import config from 'aw.config.server';
import { Debug } from 'lib/constants/debug';
import { NextRequest, NextResponse } from 'next/server';
import regexParser from 'regex-parser';

// NOTE: More specific "source" entries should be listed before more generic one
const redirectConfig = [
  {
    source: '/media/AndersenWindows/Files',
    target: '/media/Project/AndersenCorporation/AndersenWindows/AndersenWindows/Files',
  },
  {
    source: '/media/AndersenWindows/images',
    target: '/media/Project/AndersenCorporation/AndersenWindows/AndersenWindows/Images',
  },
  {
    source: '/media/aw/files',
    target: '/media/Project/AndersenCorporation/AndersenWindows/AndersenWindows/Files',
  },
  {
    source: '/media/aw/images',
    target: '/media/Project/AndersenCorporation/AndersenWindows/AndersenWindows/Images',
  },

  {
    source: '/media/AHD/Files',
    target: '/media/Project/AndersenCorporation/AndersenWindows/AndersenHomeDepot/Files',
  },
  {
    source: '/media/AHD/images',
    target: '/media/Project/AndersenCorporation/AndersenWindows/AndersenHomeDepot/Images',
  },
  {
    source: '/media/AHD/PDFs',
    target: '/media/Project/AndersenCorporation/AndersenWindows/AndersenHomeDepot/PDFs',
  },

  {
    source: '/media/ALA/Files',
    target: '/media/Project/AndersenCorporation/AndersenWindows/AndersenHomeDepot/Files',
  },
  {
    source: '/media/ALA/images',
    target: '/media/Project/AndersenCorporation/AndersenWindows/AndersenHomeDepot/Images',
  },

  {
    source: '/media/Stormdoors/Files',
    target: '/media/Project/AndersenCorporation/AndersenWindows/AndersenHomeDepot/Files',
  },
  {
    source: '/media/Stormdoors/images',
    target: '/media/Project/AndersenCorporation/AndersenWindows/AndersenHomeDepot/Images',
  },

  {
    source: '/media/HW/files',
    target: '/media/Project/AndersenCorporation/AndersenWindows/AndersenWindows/Files',
  },
  {
    source: '/media/HW/images',
    target: '/media/Project/AndersenCorporation/AndersenWindows/AndersenWindows/Images/Heritage',
  },
  {
    source: '/media',
    target: '/media',
    redirectType: 'SERVER_TRANSFER',
  },
];

/**
 * Minimal redirect info shape used in this plugin
 */
type RedirectInfo = {
  pattern: string;
  target: string;
  redirectType: string;
  isQueryStringPreserved?: boolean;
  locale?: string;
};

export type MediaRedirectsMiddlewareConfig = ProxyBaseConfig & {
  api: SitecoreConfig['api'];
};

export class MediaRedirectsMiddleware extends ProxyBase {
  protected clientFactory: GraphQLRequestClientFactory;

  constructor(protected config: MediaRedirectsMiddlewareConfig) {
    super(config);

    this.clientFactory = this.getClientFactory({ api: this.config.api });
  }

  async handle(req: NextRequest, res?: NextResponse): Promise<NextResponse> {
    try {
      const pathname = req.nextUrl.pathname;
      const locale = req.nextUrl.locale;
      const host = req.headers.get('host') ?? this.defaultHostname;

      Debug.mediaRedirects('mediaRedirects plugin start: %o', { pathname, locale, host });

      // If AW_SITE_IGNORE_MEDIA_REDIRECT is set we skip certain media redirect patterns
      if (
        config.site.ignoreMediaRedirect &&
        (pathname.startsWith('/-/media') || pathname.startsWith('/~/media'))
      ) {
        Debug.mediaRedirects('skipped (AW_SITE_IGNORE_MEDIA_REDIRECT set) %s', pathname);
        return res || NextResponse.next();
      }

      // Only operate on media-like paths
      if (
        !(
          pathname.startsWith('/-/media') ||
          pathname.startsWith('/~/media') ||
          pathname.startsWith('/media')
        )
      ) {
        Debug.mediaRedirects('skipped (not a media path) %s', pathname);
        return res || NextResponse.next();
      }

      // Find the redirect from our static config
      const existsRedirect = this.getExistsRedirect(req);

      if (!existsRedirect) {
        Debug.mediaRedirects('skipped (redirect does not exist) %s', pathname);

        return res || NextResponse.next();
      }

      Debug.mediaRedirects('matched redirect rule: %o', {
        pattern: existsRedirect.pattern,
        target: existsRedirect.target,
        redirectType: existsRedirect.redirectType,
      });

      const url = req.nextUrl.clone();
      const targetPath = existsRedirect.target;

      let newUrl = url.pathname
        .replace(regexParser(existsRedirect.pattern), targetPath)
        .replace(/^\/\//, '/');

      // Extract the relative media item path
      const mediaPath = decodeURIComponent(
        newUrl.replace(
          /https:\/\/edge.sitecorecloud.io\/andersencorporation-.+\/media(\/.+)\..+/,
          '$1'
        )
      ).replace(' ', '-');

      // Query to get the real url with the revision id.
      const query = /* GraphQL*/ `
        query {
          item(
            path: "/sitecore/media library${mediaPath}"
            language: "en"
            ) {
              url {
                url
              }
            }
          }
        `;

      const client = this.clientFactory();
      const result = await client.request<{ item?: { url: { url: string } } }>(query, {});

      if (result.item?.url.url) {
        newUrl = result.item?.url.url;
        Debug.mediaRedirects('resolved media url via GraphQL: %s', newUrl);
      } else {
        Debug.mediaRedirects(
          `skipped (redirect target item does not exist) "/sitecore/media library${mediaPath}"`
        );
        return res || NextResponse.next();
      }

      // Customized to fix issue with query strings in the redirect target
      const [newPath, targetQueryString] = newUrl.split('?');
      const targetParams = new URLSearchParams(targetQueryString || '');

      const originalParams = new URLSearchParams(url.search || '');

      const newParams = new URLSearchParams({
        ...Object.fromEntries(targetParams),
        ...Object.fromEntries(originalParams),
      });

      url.href = newPath;

      // Set `search` after `href` otherwise `href` will override it.
      url.search = newParams.toString();

      const redirectUrl = decodeURIComponent(url.href);

      Debug.mediaRedirects('performing action for redirect: %o', {
        redirectUrl,
        redirectType: existsRedirect.redirectType,
      });

      // Return redirect/rewrite based on redirectType
      switch ((existsRedirect.redirectType || '').toUpperCase()) {
        case '301':
        case 'REDIRECT_301':
          return NextResponse.redirect(redirectUrl, 301);
        case '302':
        case 'REDIRECT_302':
          return NextResponse.redirect(redirectUrl, 302);
        case 'SERVER_TRANSFER':
        case 'REDIRECT_TYPE_SERVER_TRANSFER':
          return NextResponse.rewrite(redirectUrl);
        default:
          return NextResponse.next();
      }
    } catch (error) {
      console.error('Media redirect middleware failed:');
      console.error(error);
      return res || NextResponse.next();
    }
  }

  private getExistsRedirect(req: NextRequest): RedirectInfo | undefined {
    const targetUrl = req.nextUrl.pathname.replace(/\/$/, '');
    const targetQS = req.nextUrl.search || '';

    // Try each configured redirect and test common variants of the source path:
    // - plain '/media/..'
    // - prefixed with '/-/media/..' or '/~/media/..'
    // - locale prefixed '/en/media/..'
    for (const x of redirectConfig) {
      const candidates = [
        x.source, // '/media/aw/images'
        `/-${x.source}`, // '/-/media/aw/images' (note: keep single slash semantics)
        `/~${x.source}`, // '/~/media/aw/images'
        `/${req.nextUrl.locale}${x.source}`, // '/en/media/aw/images'
        `/${req.nextUrl.locale}/-${x.source}`,
        `/${req.nextUrl.locale}/~${x.source}`,
      ].map((s) => s.replace(/\/+/g, '/'));

      for (const candidate of candidates) {
        const normalizedCandidate = candidate.replace(/\/$/, '');
        // Test against the path with and without the original query string and with locale variants
        const tests = [
          targetUrl,
          `${targetUrl}${targetQS}`,
          `/${req.nextUrl.locale}${targetUrl}`,
          `/${req.nextUrl.locale}${targetUrl}${targetQS}`,
        ];

        for (const t of tests) {
          if (t.toLowerCase().startsWith(normalizedCandidate.toLowerCase())) {
            // Build a regex pattern string we can later pass to regex-parser for replacement
            // e.g. '/^\/media\/aw\/images\/(.*)?$/i'
            const escaped = normalizedCandidate.replace(/[-/\\^$*+?.()|[\]{}]/g, (m) => `\\${m}`);
            const pattern = `/^${escaped}\\/(.*)?$/i`;
            const target = `https://edge.sitecorecloud.io/andersencorporation-somefakeid${x.target}/$1`;

            return {
              pattern,
              target,
              redirectType: x.redirectType ?? '301',
              isQueryStringPreserved: true,
              locale: req.nextUrl.locale ?? '',
            };
          }
        }
      }
    }

    return undefined;
  }
}
