import config from 'aw.config.server';
import { NextRequest } from 'next/server';

type ClientBody = {
  configId: string;
  questionId: string;
  questionClassification: string;
  selectedAnswerId: string;
};

export async function handler(req: NextRequest): Promise<Response> {
  const authHeader = req.headers.get('authorization') ?? '';
  const bearerToken = authHeader?.replace('Bearer ', '');
  if (!bearerToken) {
    return Response.json(
      {
        error: 'Missing bearer token. Provide Authorization: Bearer <token> header.',
      },
      { status: 400 }
    );
  }

  const paradigmConfigCookie = req.headers.get('x-paradigm-cookie') ?? '';
  if (!paradigmConfigCookie) {
    return Response.json(
      {
        error: 'Missing configuration cookie. Provide Cookie: <cookie> header.',
      },
      { status: 400 }
    );
  }

  const { configId, questionId, questionClassification, selectedAnswerId } = ((await req.json()) ??
    {}) as ClientBody;

  if (!configId || !questionId || !questionClassification || !selectedAnswerId) {
    return Response.json({ message: 'Missing required fields' }, { status: 400 });
  }

  const paradigmConfigApiUrl = config.paradigm.configApiUrl;
  if (!paradigmConfigApiUrl) {
    return Response.json({ error: 'Missing required environment variables' }, { status: 400 });
  }

  const externalPayload = {
    ID: questionId,
    QuestionClassification: questionClassification,
    UsingDifferentAnswers: false,
    UnitIndex: 0,
    SelectedAnswerID: selectedAnswerId,
  };

  try {
    const response = await fetch(`${paradigmConfigApiUrl}/${configId}/questions/${questionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
        Cookie: paradigmConfigCookie,
      },
      body: JSON.stringify(externalPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return Response.json(
        {
          error: 'Failed to update question',
          details: errorData,
        },
        { status: response.status }
      );
    }

    const responseData = await response.json();
    if (!responseData) {
      return Response.json({ error: 'Failed to retrieve updated question' }, { status: 502 });
    }

    return Response.json(responseData, { status: response.status });
  } catch (error) {
    return Response.json({ message: 'Internal Server Error: ' + error }, { status: 500 });
  }
}

export const PUT = handler;
