import type { Debugger } from 'debug';
import sendGridService from 'lib/send-grid-service';
import { SuccessResponse } from 'lib/utils/request-response-utils/responses/success-response';
import { array, object, string } from 'yup';

export const sendEmailSchema = object({
  to: array().of(string().email().required()).min(1).required(),
  from: string().email().required(),
  subject: string().required(),
  body: string().required(),
});

export type SendEmailBody = {
  to: string[];
  from: string;
  subject: string;
  body: string;
};

export function createSendEmailHandler(logger: Debugger) {
  return async function handler(body: SendEmailBody): Promise<Response> {
    logger('processing request: %o', body);

    const sanitizedPayload = {
      to: body.to.map((email) => email.trim().toLowerCase()),
      from: body.from.trim().toLowerCase(),
      subject: body.subject.trim(),
      body: body.body.trim(),
      isHtml: true,
    };

    logger('sending email: %o', sanitizedPayload);

    await sendGridService.sendEmail(sanitizedPayload);

    return SuccessResponse.Ok('Email Send Accepted');
  };
}
