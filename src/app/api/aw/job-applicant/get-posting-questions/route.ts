import leverService from 'lib/lever';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPostingQuestionsResponse(data: any) {
  return {
    id: data.id,
    text: data.text,

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    customQuestions: data.customQuestions.map((q: any) => ({
      id: q.id,
      text: q.text,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fields: q.fields.map((f: any) => ({
        id: f.id,
        text: f.text,
        type: f.type,
        description: f.description,
        prompt: f.prompt,
        required: f.required,
        value: f.value,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        options: f.options.map((o: any) => ({
          optionId: o.optionId,
          text: o.text,
        })),
      })),
    })),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    personalInformation: data.personalInformation.map((p: any) => ({
      name: p.name,
      type: p.type,
      required: p.required,
      text: p.text,
      value: p.value,
    })),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    urls: data.urls.map((u: any) => ({
      name: u.name,
      type: u.type,
      required: u.required,
      text: u.text,
      value: u.value,
    })),
  };
}

export async function GET(req: NextRequest): Promise<Response> {
  if (req.method !== 'GET') {
    return new Response('Bad Request', { status: 405 });
  }

  const postingId = req.nextUrl.searchParams.get('postingId');
  if (!postingId || typeof postingId !== 'string') {
    return Response.json({ message: 'postingId is required' }, { status: 400 });
  }

  try {
    const data = await leverService.getPostingApplicationQuestions(postingId);
    const mapped = mapPostingQuestionsResponse(data);
    return Response.json(mapped, { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response('Bad Request', { status: 500 });
  }
}
