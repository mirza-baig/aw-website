import { NextRequest } from 'next/server';

const renoworksGetProductOptions = async (parsed: {
  ApiHost: string;
  Rwd: string;
  Settings: string;
}) => {
  const apiHost = parsed.ApiHost;
  const rwd = parsed.Rwd;
  const settings = parsed.Settings;

  const url = `${apiHost}/_rwapi/?function=ProductOptions&mode=json&rwd=${rwd}&settings=${settings}`;
  const requestOptions = { method: 'GET' };
  const response = await fetch(url, requestOptions);
  const data = await response.json();
  return data;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const results = await renoworksGetProductOptions(body);
    return Response.json({ results }, { status: 200 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Failed to fetch Renoworks product options';
    return Response.json({ message }, { status: 500 });
  }
}
