import type { Debugger } from 'debug';
import transactionalMessagingService from 'lib/salesforce/marketing-cloud/transaction-messaging';
import { SuccessResponse } from 'lib/utils/request-response-utils/responses/success-response';
import { object, string } from 'yup';

export const sfmcTransactionalMessagingSendEmailSchema = object({
  account: string().oneOf(['AW']).required(),
  definitionKey: string().required(),
  recipient: object({
    contactKey: string().optional(),
    to: string().email().required(),
    attributes: object().optional(),
  }).required(),
});

export type SfmcTransactionalMessagingSendEmailBody = {
  account: 'AW';
  definitionKey: string;
  recipient: {
    contactKey?: string;
    to: string;
    attributes?: Record<string, unknown>;
  };
};

export function createSfmcTransactionalMessagingSendEmailHandler(logger: Debugger) {
  return async function handler(body: SfmcTransactionalMessagingSendEmailBody): Promise<Response> {
    logger('processing request: %o', body);

    await transactionalMessagingService.sendEmailToSingleRecipient({
      account: body.account,
      definitionKey: body.definitionKey,
      recipient: {
        contactKey: body.recipient.contactKey,
        to: body.recipient.to,
        attributes: body.recipient.attributes,
      },
    });

    logger('email sent successfully');

    return SuccessResponse.Ok('Email Sent', 200);
  };
}
