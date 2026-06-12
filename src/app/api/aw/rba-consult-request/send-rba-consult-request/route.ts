import config from 'aw.config.server';
import { NextRequest } from 'next/server';
const rbaSubmitFormEndpointUrl = config.rba.submitFormEndpointUrl;
const rbaAuthorizationKey = config.rba.authorizationKey;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sendRbaConsultRequest = async (reqBody: any) => {
  const parsed = JSON.parse(reqBody);

  const form_data = new FormData();
  form_data.append('FirstName', parsed.FirstName);
  form_data.append('LastName', parsed.LastName);
  form_data.append('EmailAddress', parsed.EmailAddress);
  form_data.append('PhoneNumber', parsed.PhoneNumber);
  form_data.append('Zipcode', parsed.Zip);
  form_data.append('FormType', parsed.FormType);
  form_data.append('ConsultationType', parsed.ConsultationType);
  form_data.append('RbASource', parsed.RbASource);
  form_data.append('RbABreakdown', parsed.RbABreakdown);
  form_data.append('Sender', parsed.Sender);

  const requestOptions = {
    method: 'POST',
    headers: {
      Authorization: `${rbaAuthorizationKey}`,
    },
    body: form_data,
  };

  const endPointUrl = `${rbaSubmitFormEndpointUrl}`;
  const response = await fetch(endPointUrl, requestOptions);
  const data = await response.json();
  return data;
};

export async function POST(req: NextRequest): Promise<Response> {
  if (req.method !== 'POST') {
    return Response.json({ status: 405 });
  }
  const requestBody = await req.json();
  const results = await sendRbaConsultRequest(JSON.stringify(requestBody));
  const resStatus = results.status === 'OK' ? 200 : 400;
  return Response.json(results, { status: resStatus });
}
