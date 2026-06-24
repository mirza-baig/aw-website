import sitecoreClient from 'lib/sitecore-client';
import { NextRequest } from 'next/server';

import { SwatchesService } from './swatches-service';

/**
 * POST /api/aw/product-compare-chart/resolve-swatches
 * Body: { ids: string[]; language?: string }
 * Response: { results: { [id: string]: ResolvedSwatchCollection | null } }
 *
 * Used by ProductCompareChart to resolve per-product `AW_SwatchCollection`
 * references that Sitecore's layout service returns as unresolved
 * pipe-delimited GUID strings (single-hop resolution limit).
 */
export async function POST(req: NextRequest) {
  const body = (await req.json()) as { ids?: string[]; language?: string };
  const ids = Array.isArray(body?.ids) ? body.ids : [];
  const language = body?.language ?? 'en';

  if (ids.length === 0) {
    return Response.json({ results: {} });
  }

  const service = new SwatchesService({ sitecoreClient });
  const results = await service.resolve(ids, language);

  return Response.json({ results });
}
