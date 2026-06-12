import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const message = body.message ?? 'Test API error';

  throw new Error(`Error from API: ${message}`);
}
