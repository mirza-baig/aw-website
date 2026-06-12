import sitecoreClient from 'lib/sitecore-client';
import { NextRequest } from 'next/server';

import { FavoriteProductsService } from './favorite-products-service';

type RequestBody = {
  favoriteProducts?: string[];
  language?: string;
};

export async function POST(req: NextRequest): Promise<Response> {
  const body: RequestBody = await req.json();
  const favoriteProductIDs = Array.isArray(body.favoriteProducts) ? body.favoriteProducts : [];
  const language = typeof body.language === 'string' && body.language.trim() ? body.language : 'en';
  const favoriteProductsService = new FavoriteProductsService({ sitecoreClient });
  const productData = await favoriteProductsService.fetch(favoriteProductIDs, language);
  return Response.json({ productData }, { status: 200 });
}
