import type { SiteInfo } from '@sitecore-content-sdk/nextjs';
import { createSitecoreRevalidateRouteHandler } from '@sitecore-content-sdk/nextjs/route-handler';
import config from 'aw.config';
import environment from 'lib/environment';
import { NextRequest } from 'next/server';
import scConfig from 'sitecore.config';

import sites from '.sitecore/sites.json';

const SECRET_HEADER = 'x-revalidate-secret';

const { POST: scPOST } = createSitecoreRevalidateRouteHandler({
  defaultLocale: scConfig.defaultLanguage,
  sites: sites as SiteInfo[],
});

type SaveWebhookPayload = {
  EventName?: string;
  Item?: {
    Id?: string;
    Language?: string;
    Version?: number;
    Name?: string;
    TemplateId?: string;
  };
  WebhookItemId?: string;
  WebhookItemName?: string;
};

const toItemTags = (id: string, locale: string): string[] => {
  const hyphenated = id.replaceAll(/[{}]/g, '').toLowerCase();
  const compact = hyphenated.replaceAll('-', '');
  const lang = locale.toLowerCase();
  return [...new Set([hyphenated, compact])].map((itemId) => `sc:item:${itemId}:${lang}:latest`);
};

export async function POST(request: NextRequest) {
  // Only preview deployments to save events.
  if (!environment.isPreview()) {
    return new Response('Not Found', { status: 404 });
  }

  const providedSecret = request.headers.get(SECRET_HEADER);
  if (!providedSecret || providedSecret !== config.revalidation.secret) {
    console.error(
      `[REVALIDATE:SAVE] ${providedSecret ? 'Invalid' : 'Missing'} ${SECRET_HEADER} header`
    );
    return new Response('Unauthorized', { status: 401 });
  }

  let body: SaveWebhookPayload;
  try {
    body = (await request.json()) as SaveWebhookPayload;
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (body.EventName !== 'item:saved' || !body.Item?.Id) {
    return Response.json(
      { skipped: true, reason: `Unsupported event: ${body.EventName}` },
      { status: 202 }
    );
  }

  const tags = toItemTags(body.Item.Id, body.Item.Language || scConfig.defaultLanguage);
  console.log(`[REVALIDATE:SAVE] ${body.Item.Name ?? ''} ${body.Item.Id} -> ${tags.join(', ')}`);

  const forwarded = new NextRequest(request.url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      [SECRET_HEADER]: providedSecret,
    },
    body: JSON.stringify({ tags }),
  });

  const response = await scPOST(forwarded);
  console.log(`[REVALIDATE:SAVE] Status: ${response.status}`);
  return response;
}
