import config from 'aw.config.server';

import { ActionProps, ActionResult, SubmitActionProps } from '..';
import { BaseSubmitAction } from '../base-submit-action';
import { Sitecore } from '.sitecore/AndersenWindows.model';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    grecaptcha: any;
    initializeRecaptcha: () => void;
  }
}

type GrecaptchaEnterprise = {
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
};

const getGrecaptchaEnterprise = (): GrecaptchaEnterprise | undefined =>
  (globalThis as unknown as { grecaptcha?: { enterprise?: GrecaptchaEnterprise } }).grecaptcha
    ?.enterprise;

export class Recaptcha extends BaseSubmitAction<Sitecore.Forms.GenericFormBuilder.SubmitActions.Recaptcha> {
  private readonly scriptId = 'recaptcha-script';

  constructor(
    protected readonly props: SubmitActionProps<Sitecore.Forms.GenericFormBuilder.SubmitActions.Recaptcha>
  ) {
    super(props);
    this.loadRecaptchaScript();
  }

  private async executeRecaptcha(userAction: string): Promise<string | undefined> {
    const maxWaitMs = 10000;
    const startedAt = Date.now();

    return new Promise((resolve) => {
      const checkGrecaptcha = () => {
        const enterprise = getGrecaptchaEnterprise();
        if (typeof enterprise?.execute === 'function') {
          enterprise
            .execute(config.google.recaptcha.siteKey, {
              action: userAction,
            })
            .then(
              (token: string) => {
                console.info('[reCAPTCHA] GFB token received:', !!token);
                resolve(token);
              },
              (error: unknown) => {
                console.error('reCAPTCHA execute failed:', error);
                resolve(undefined);
              }
            );
        } else if (Date.now() - startedAt > maxWaitMs) {
          console.error('reCAPTCHA script did not load');
          resolve(undefined);
        } else {
          setTimeout(checkGrecaptcha, 100);
        }
      };
      checkGrecaptcha();
    });
  }

  private async verifyRecaptcha(
    token: string,
    userAction: string,
    props: ActionProps
  ): Promise<ActionResult> {
    const response = await fetch('/api/aw/generic-form-builder/submit-actions/verify-recaptcha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, userAction }),
    });

    console.info('[reCAPTCHA] GFB verify status:', response.status);
    if (!response.ok) {
      return { success: false, errorMessage: this.props.submitAction.fields?.errorMessage?.value };
    }

    const verificationResult = await response.json();
    const minimumScoreValue = Number(
      this.props.submitAction.fields?.minimumScoreValue?.value ?? 0.1
    );
    console.info('[reCAPTCHA] GFB verify response', {
      valid: verificationResult.tokenProperties?.valid,
      invalidReason: verificationResult.tokenProperties?.invalidReason,
      action: verificationResult.tokenProperties?.action,
      score: verificationResult.riskAnalysis?.score,
      minimumScoreValue,
    });

    const isValid = !(
      verificationResult.riskAnalysis?.score < minimumScoreValue ||
      !verificationResult.tokenProperties?.valid ||
      verificationResult.tokenProperties?.action !== userAction
    );
    verificationResult.isValid = isValid;

    props.context['GoogleRecaptchaResponse'] = {
      id: this.props.submitAction.id,
      name: 'googleRecaptchaResponse',
      type: 'GoogleRecaptchaResponse',
      value: JSON.stringify(verificationResult),
    };
    // Equivalent of EnterpriseWeb's formData['isRecaptchaValid'] for multi-step forms / downstream actions
    props.context['IsRecaptchaValid'] = {
      id: this.props.submitAction.id,
      name: 'isRecaptchaValid',
      type: 'IsRecaptchaValid', // if `type` is a string-literal union in ActionProps, add this value to it
      value: String(isValid),
    };

    return {
      success: isValid,
      errorMessage: this.props.submitAction.fields?.errorMessage?.value,
      verificationResult: verificationResult,
    };
  }

  private async initializeRecaptcha(): Promise<void> {
    const userAction = this.props.submitAction.fields?.userAction?.value ?? '';
    await this.executeRecaptcha(userAction);
  }

  private loadRecaptchaScript(): void {
    const existingScript = document.getElementById(this.scriptId);

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/enterprise.js?render=${config.google.recaptcha.siteKey}`;
      script.id = this.scriptId;

      script.onload = async () => {
        // If the script has loaded, trigger the initial execution
        await this.initializeRecaptcha();
      };

      document.body.appendChild(script);

      window.initializeRecaptcha = async () => {
        await this.initializeRecaptcha();
      };
    }
  }

  async execute(props: ActionProps): Promise<ActionResult> {
    const fields = this.props.submitAction.fields;
    const errorMessage = fields?.errorMessage?.value;
    const userAction = fields?.userAction?.value ?? '';
    console.info('[reCAPTCHA] GFB execute', {
      userAction,
      minimumScoreValue: fields?.minimumScoreValue?.value,
      stopOnError: fields?.stopOnError?.value,
      fieldNames: fields ? Object.keys(fields) : 'NO FIELDS',
    });

    try {
      const token = await this.executeRecaptcha(userAction);
      if (!token) {
        return { success: false, errorMessage: errorMessage };
      }
      const result = await this.verifyRecaptcha(token, userAction, props);
      console.info('[reCAPTCHA] GFB result', result);
      return result;
    } catch (error) {
      console.error('[reCAPTCHA] GFB execute error', error);
      return { success: false, errorMessage: errorMessage };
    }
  }
}
