import type { Debugger } from 'debug';
import { object, string } from 'yup';

export const zippopotamSchema = object({
  country: string().required().oneOf(['ca', 'us']),
  postalCode: string()
    .trim()
    .required()
    .matches(
      /(^[A-Za-z]\d[A-Za-z]$)|(^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$)|(^\d{5}$)/,
      'Must be a valid CA postal code or US ZIP code'
    ),
});

export type ZippopotamBody = {
  country: 'ca' | 'us';
  postalCode: string;
};

export function createZippopotamHandler(logger: Debugger) {
  return async function handler(body: ZippopotamBody): Promise<Response> {
    logger('processing request: %o', body);

    const response = await fetch(
      `https://api.zippopotam.us/${body.country}/${encodeURIComponent(body.postalCode.trim())}`,
      {
        method: 'GET',
        headers: {
          accept: 'text/plain',
        },
      }
    );

    if (!response.ok) {
      const resText = await response.text();

      return Response.json(
        {
          message: 'Zippopotam request failed',
          error: resText || response.statusText,
        },
        {
          status: 500,
        }
      );
    }

    const data = await response.json();

    return Response.json(data);
  };
}
