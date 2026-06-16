import type { Debugger } from 'debug';
import { SuccessResponse } from 'lib/utils/request-response-utils/responses/success-response';
import { object, string } from 'yup';

export const renoworksGetProductOptionsSchema = object({
  ApiHost: string().required(),
  Rwd: string().required(),
  Settings: string().default(''),
});

export type RenoworksGetProductOptionsBody = {
  ApiHost: string;
  Rwd: string;
  Settings: string;
};

export function createRenoworksGetProductOptionsHandler(logger: Debugger) {
  return async function handler(body: RenoworksGetProductOptionsBody): Promise<Response> {
    logger('processing request: %o', body);

    const url = `${body.ApiHost}/_rwapi/?function=ProductOptions&mode=json&rwd=${body.Rwd}&settings=${body.Settings}`;

    const response = await fetch(url, { method: 'GET' });
    const responseBody = await response.text();

    if (responseBody.startsWith('<error>')) {
      const errorMessage = responseBody.replace('<error>', '').replace('</error>', '');
      throw new Error(errorMessage);
    }

    const results = JSON.parse(responseBody);

    logger('product options retrieved successfully');

    return SuccessResponse.Data(results, 'Product Options', 200);
  };
}
