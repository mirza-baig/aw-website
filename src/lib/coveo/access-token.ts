import { getCookie, setCookie } from 'cookies-next';

const coveoAccessTokenCookieName = 'ew_coveoAccessToken';

export const getAccessToken = async (organizationId: string): Promise<string> => {
  const requestOptions = {
    method: 'POST',
  };

  const response = await fetch(
    `/api/aw/coveo/access-token?organizationid=${organizationId}`,
    requestOptions
  );

  const data = await response.json();

  return data.token;
};

export const currentAccessToken = async (organizationId: string): Promise<string> => {
  let accessToken = getCookie(coveoAccessTokenCookieName)?.toString();

  if (!accessToken) {
    accessToken = await getAccessToken(organizationId);
    setCookie(coveoAccessTokenCookieName, accessToken);
  }

  return accessToken;
};

export const renewAccessToken = async (organizationId: string): Promise<string> => {
  const accessToken = await getAccessToken(organizationId);

  setCookie(coveoAccessTokenCookieName, accessToken);
  return accessToken;
};
