import { ProxyBase } from '@sitecore-content-sdk/nextjs/proxy';
import { Debug } from 'lib/constants/debug';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const KEY = 'x-draft-mode-search-params';

export class DraftModeWorkaroundMiddleware extends ProxyBase {
  async handle(req: NextRequest, res?: NextResponse): Promise<NextResponse> {
    const response = res || NextResponse.next();
    const startTimestamp = Date.now();

    Debug.draftModeWorkaround('draft-mode-workaround plugin start');

    if (!this.isPreview(req)) {
      Debug.draftModeWorkaround(`skipped, not in preview mode`);
      return response;
    }

    const searchParams = Object.fromEntries(req.nextUrl.searchParams);

    response.headers.set(KEY, JSON.stringify(searchParams));

    Debug.draftModeWorkaround(
      'draft-mode-workaround end in %dms: %o',
      Date.now() - startTimestamp,
      {
        searchParams,
      }
    );
    return response;
  }

  public static async getSearchParams(): Promise<Record<string, string | string[] | undefined>> {
    const headerValues = await headers();
    const workaroundHeader = headerValues.get(KEY) ?? '{}';
    const searchParams = JSON.parse(workaroundHeader);
    return searchParams as Record<string, string | string[] | undefined>;
  }
}
