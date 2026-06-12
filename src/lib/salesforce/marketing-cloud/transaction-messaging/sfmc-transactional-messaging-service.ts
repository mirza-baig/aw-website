import { Environment } from 'lib/environment/environment';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';

type SFMCOptions = {
  authBaseUrl: string;
  restBaseUrl: string;
  clientId: string;
  clientSecret: string;
  accountIds: {
    AW: string;
  };
  tokenTtlMinutes: number;
  cacheEnabled: boolean;
};

type TokenResponse = {
  access_token: string;
  expires_in: number;
};

type SendEmailRequest = {
  account: 'AW';
  definitionKey: string;
  recipient: {
    contactKey?: string;
    to: string;
    attributes?: Record<string, unknown>;
  };
};

export class SFMCTransactionalMessagingService {
  private readonly tokenCache = new Map<string, { token: string; exp: number }>();

  constructor(
    private readonly options: SFMCOptions,
    private readonly environment: Environment
  ) {}

  private cacheKey(account: string): string {
    return `SFMC:transactional:${account}`;
  }

  private async getAuthToken(account: 'AW'): Promise<string> {
    const key = this.cacheKey(account);

    if (this.options.cacheEnabled) {
      const cached = this.tokenCache.get(key);
      if (cached && Date.now() < cached.exp) {
        return cached.token;
      }
    }

    const accountId = this.options.accountIds[account];

    const res = await fetch(`${this.options.authBaseUrl}/v2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        account_id: accountId,
        client_id: this.options.clientId,
        client_secret: this.options.clientSecret,
      }),
    });

    const data = (await res.json()) as TokenResponse;

    if (!res.ok) {
      throw new Error(`SFMC auth failed: ${JSON.stringify(data)}`);
    }

    const ttlMs =
      data.expires_in && data.expires_in > 60
        ? (data.expires_in - 60) * 1000
        : this.options.tokenTtlMinutes * 60 * 1000;

    if (this.options.cacheEnabled) {
      this.tokenCache.set(key, {
        token: data.access_token,
        exp: Date.now() + ttlMs,
      });
    }

    return data.access_token;
  }

  async sendEmailToSingleRecipient(request: SendEmailRequest): Promise<void> {
    if (isNullOrWhitespace(request.recipient.contactKey)) {
      request.recipient.contactKey = undefined;
    }

    request.recipient.contactKey ??= this.environment.isProduction()
      ? crypto.randomUUID().replaceAll('-', '')
      : 'b94391ef2c764b3fa8283934b42f90f6';

    let token = await this.getAuthToken(request.account);

    const payload = {
      definitionKey: request.definitionKey,
      recipient: request.recipient,
    };

    const url = `${this.options.restBaseUrl}/messaging/v1/email/messages/${crypto.randomUUID()}`;

    const send = async (bearer: string) =>
      fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${bearer}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

    let response = await send(token);

    if (response.status === 401) {
      console.warn('SFMC token expired, refreshing...');

      if (this.options.cacheEnabled) {
        this.tokenCache.delete(this.cacheKey(request.account));
      }

      token = await this.getAuthToken(request.account);
      response = await send(token);
    }

    if (response.status >= 500) {
      throw new Error(`SFMC server error: ${response.status}`);
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`SFMC client error (${response.status}): ${text}`);
    }

    console.log('SFMC email sent successfully');
  }
}
