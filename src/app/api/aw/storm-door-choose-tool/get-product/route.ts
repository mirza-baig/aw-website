import sitecoreClient from 'lib/sitecore-client';
import { NextRequest } from 'next/server';

import { ProductsService } from './products-service';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const recommendationProductIds = body.recommendationProductIds;
  const language = body.language ?? 'en';
  const service = new ProductsService({ sitecoreClient });

  const results = await service.fetch(recommendationProductIds, language);

  return Response.json({ results });
}
