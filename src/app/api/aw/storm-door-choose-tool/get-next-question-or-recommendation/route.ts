import sitecoreClient from 'lib/sitecore-client';
import { NextRequest } from 'next/server';

import { NextQuestionOrRecommendationsService } from './next-question-or-recommendations-service';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const currentAnswerId = body.currentAnswerId;
  const language = body.language ?? 'en';
  const service = new NextQuestionOrRecommendationsService({ sitecoreClient });

  const results = await service.fetch(currentAnswerId, language);

  return Response.json({ results });
}
