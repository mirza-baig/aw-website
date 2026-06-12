import config from 'aw.config.server';

export async function handler(): Promise<Response> {
  // Validate environment variables
  const authApi = config.paradigm.authApiUrl;
  const username = config.paradigm.authUsername;
  const password = config.paradigm.authPassword;
  const systemId = config.paradigm.authSystemId;

  if (!authApi || !username || !password || !systemId) {
    return Response.json({ error: 'Missing required environment variables' }, { status: 500 });
  }

  try {
    const tokenParams = new URLSearchParams({
      grant_type: 'password',
      username: username,
      password: password,
      system_key: systemId,
    });

    const tokenResponse = await fetch(`${authApi}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenParams.toString(),
    });

    if (!tokenResponse.ok) {
      const details = await tokenResponse.json();
      return Response.json(
        { error: 'bmc - Failed to fetch config access token', details },
        { status: tokenResponse.status }
      );
    }

    const tokenData = await tokenResponse.json();
    const configToken = tokenData.access_token;
    if (!configToken) {
      return Response.json({ error: 'No access_token returned from auth API' }, { status: 502 });
    }

    const expireDateTime = tokenData['.expires'] ?? '';

    return Response.json({ access_token: configToken, expires: expireDateTime });
  } catch (error) {
    return Response.json({ error: 'Internal Server Error', details: error }, { status: 500 });
  }
}

export const POST = handler;
