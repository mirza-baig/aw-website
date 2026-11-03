import sitecoreClient from 'lib/sitecore-client';
import { NextRequest } from 'next/server';

import { GraphQLProductByBVIdService } from './product-by-bv-id-service';

export const dynamic = 'force-dynamic';

type ProductRequestBody = {
  sourceIds?: string[];
  productIds?: string[];
  language?: string;
};

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body: ProductRequestBody = await req.json();

    const sourceIds = Array.isArray(body.sourceIds) ? body.sourceIds : [];
    const productIds = Array.isArray(body.productIds) ? body.productIds : [];
    const language =
      typeof body.language === 'string' && body.language.trim() ? body.language : 'en';

    const graphQLProductByBVIdService = new GraphQLProductByBVIdService({
      sitecoreClient,
    });

    const products = await graphQLProductByBVIdService.fetch(sourceIds, productIds, language);
    return Response.json({ products }, { status: 200 });
  } catch (err) {
    console.error('POST /product-by-bv-id error:', err);
    return Response.json({ message: 'Invalid request body' }, { status: 400 });
  }
}
