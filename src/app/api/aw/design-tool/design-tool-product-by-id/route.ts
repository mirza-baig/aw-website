import sitecoreClient from 'lib/sitecore-client';
import { NextRequest } from 'next/server';

import { defaultQueryResultItem, GraphQLDesignToolProductByIdService } from './get-product-by-id';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const itemId = body?.itemId ?? '';
    const language = body?.language ?? 'en';

    // Maintain current behavior: return an empty shape when itemId is missing.
    if (itemId === '') {
      return Response.json(defaultQueryResultItem, { status: 200 });
    }

    const service = new GraphQLDesignToolProductByIdService({ sitecoreClient });
    const designToolOption = await service.fetchItem(itemId, language);

    return Response.json(designToolOption, { status: 200 });
  } catch (err) {
    // You can log err for observability if desired
    return Response.json(
      { message: 'Failed to fetch design tool option by id' + err },
      { status: 500 }
    );
  }
}
