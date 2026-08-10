import config from 'aw.config.server';
import type { Debugger } from 'debug';
import marlimarService from 'lib/marlimar';
import { SuccessResponse } from 'lib/utils/request-response-utils/responses/success-response';
import { object, string } from 'yup';

export const shareARLinkSchema = object({
  phoneNumber: string()
    .trim()
    .required()
    .matches(/^\d{10,11}$/, 'Phone number must be 10 or 11 digits'),
  link: string().required(),
});

export type ShareARLinkBody = {
  phoneNumber: string;
  link: string;
};

export function createShareARLinkHandler(logger: Debugger) {
  return async function handler(body: ShareARLinkBody): Promise<Response> {
    logger('processing request: %o', body);
    const payload = {
      hashKey: config.marlimar.hashKeys.shareAR,
      mobileNumber: body.phoneNumber.trim(),
      custom: body.link.trim(),
    };

    logger('sending marlimar payload: %o', payload);

    await marlimarService.sendOutboundMessage(payload);

    return SuccessResponse.Ok('Message Sent');
  };
}
