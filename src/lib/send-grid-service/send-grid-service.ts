import sgMail from '@sendgrid/mail';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';
import { environment } from 'startup/environment';

export interface SendEmailRequest {
  to: string[];
  from: string;
  subject: string;
  body: string;
  isHtml?: boolean;
}

interface SendGridConfig {
  apiKey: string;
}

export class SendGridService {
  constructor(config: SendGridConfig) {
    if (isNullOrWhitespace(config?.apiKey)) {
      console.warn('SendGrid API key is missing');
    }

    sgMail.setApiKey(config.apiKey);
  }

  async sendEmail(email: SendEmailRequest): Promise<void> {
    let subject = email.subject;
    const isHtml = email.isHtml ?? false;

    if (!environment.isProduction) {
      const cleanSubject = subject?.replaceAll('\\', '') || 'Generic Email';
      const prefix = `${environment.environmentName.toUpperCase()} - `;
      subject = `${prefix}${cleanSubject}`;
    }

    const message: sgMail.MailDataRequired = {
      from: email.from,
      to: email.to,
      subject,
      ...(isHtml ? { html: email.body } : { text: email.body }),
    };

    const response = await sgMail.sendMultiple(message);

    if (!response[0]?.statusCode || response[0].statusCode >= 400) {
      throw new Error('SendGrid failed to send email');
    }
  }
}
