import { ProxyBase } from '@sitecore-content-sdk/nextjs/proxy';
import { precompute } from 'flags/next';
import { Debug } from 'lib/constants/debug';
import * as flags from 'lib/feature-flags/flags';
import { NextRequest, NextResponse } from 'next/server';

export function getFlagsRewrite(pathname: string, flags: string): string {
  const path = pathname.startsWith('/') ? pathname : '/' + pathname;

  return `/${flags}${path}`;
}

export class FeatureFlagsProxy extends ProxyBase {
  async handle(req: NextRequest, res: NextResponse): Promise<NextResponse> {
    const pathname = res?.headers.get('x-sc-rewrite') || req.nextUrl.pathname;
    const startTimestamp = Date.now();

    Debug.proxy.featureFlags('feature-flags proxy start: %o', {
      pathname,
    });

    if (this.disabled(req, res)) {
      Debug.proxy.featureFlags('skipped (feature-flags proxy is disabled)');
      return res;
    }

    const featureFlags = await precompute(Object.values(flags));

    const rewritePath = getFlagsRewrite(pathname, featureFlags);
    const response = this.rewrite(rewritePath, req, res);

    Debug.proxy.featureFlags('feature-flags end in %dms: %o', Date.now() - startTimestamp, {
      rewritePath,
      featureFlags,
    });

    return response;
  }

  protected disabled(req: NextRequest, res: NextResponse): boolean | undefined {
    // ignore files
    return req.nextUrl.pathname.includes('.') || super.disabled(req, res);
  }
}
