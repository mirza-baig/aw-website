import config from 'aw.config';

import { BaseSubmitAction, BaseSubmitProps, ExecutionResult } from '../BaseSubmitAction';
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

type ExtendedActionFieldProps = Sitecore.Forms.GenericFormBuilder.SubmitActions.Recaptcha['fields'];

export class Recaptcha extends BaseSubmitAction {
  private readonly scriptId = 'recaptcha-script';

  constructor(params: BaseSubmitProps) {
    super(params);
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
                console.info('[reCAPTCHA] token received:', !!token);
                resolve(token);
              },
              (error: unknown) => {
                console.error('reCAPTCHA execute failed:', error);
                resolve(undefined);
              }
            );
        } else if (Date.now() - startedAt > maxWaitMs) {
          resolve(undefined);
        } else {
          setTimeout(checkGrecaptcha, 100);
        }
      };
      checkGrecaptcha();
    });
  }

  private async verifyRecaptcha(token: string, userAction: string): Promise<ExecutionResult> {
    const response = await fetch('/api/aw/custom-forms/submit-actions/verify-recaptcha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, userAction }),
    });

    if (!response.ok) {
      return { success: false, errorMessage: this.actionFieldsProps?.errorMessage?.value };
    }

    const verificationResult = await response.json();
    console.info('[reCAPTCHA] verify response', {
      status: response.status,
      valid: verificationResult.tokenProperties?.valid,
      invalidReason: verificationResult.tokenProperties?.invalidReason,
      action: verificationResult.tokenProperties?.action,
      score: verificationResult.riskAnalysis?.score,
    });
    const minimumScoreValue = this.actionFieldsProps?.minimumScoreValue?.value ?? 0.1;
    this.formData['googleRecaptchaResponse'] = verificationResult;

    if (
      verificationResult.riskAnalysis?.score < minimumScoreValue ||
      !verificationResult.tokenProperties?.valid ||
      verificationResult.tokenProperties?.action !== userAction
    ) {
      verificationResult.isValid = false;
      this.formData['isRecaptchaValid'] = false; // needs to be on the form data for multi-step forms to grab
      return {
        success: false,
        errorMessage: this.actionFieldsProps?.errorMessage?.value,
        verificationResult: verificationResult,
      };
    }

    verificationResult.isValid = true;
    this.formData['isRecaptchaValid'] = true;
    return {
      success: true,
      errorMessage: this.actionFieldsProps?.errorMessage?.value,
      verificationResult: verificationResult,
    };
  }

  private async initializeRecaptcha(): Promise<void> {
    const userAction = this.actionFieldsProps?.userAction?.value as string;
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

      window.initializeRecaptcha = () => {
        this.initializeRecaptcha(); // Call async function but don't return the promise
      };
    }
  }
  override actionFieldsProps: ExtendedActionFieldProps = this.actionFieldsProps;

  override async executeAction(): Promise<ExecutionResult> {
    const errorMessage = this.actionFieldsProps?.errorMessage?.value;
    const userAction = this.actionFieldsProps?.userAction?.value as string;

    try {
      const token = await this.executeRecaptcha(userAction);
      if (!token) {
        this.formData['isRecaptchaValid'] = false;
        return { success: false, errorMessage: errorMessage };
      }
      return this.verifyRecaptcha(token, userAction);
    } catch (error) {
      console.error('Caught error:', error);
      return { success: false, errorMessage: errorMessage ?? 'An unknown error occurred.' };
    }
  }
}
