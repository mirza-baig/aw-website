import sitecoreClient from 'lib/sitecore-client';
import { NextRequest } from 'next/server';

import { QuestionAndAnswersService } from './question-and-answers-service';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const questionID = body.questionID;
  const language = body.language ?? 'en';
  const service = new QuestionAndAnswersService({ sitecoreClient });

  const results = await service.fetch(questionID, language);

  return Response.json({ results });
}
