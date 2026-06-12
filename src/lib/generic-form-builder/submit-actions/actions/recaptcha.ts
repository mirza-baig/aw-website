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

export class Recaptcha extends BaseSubmitAction<Sitecore.Forms.GenericFormBuilder.SubmitActions.Recaptcha> {
  private readonly scriptId = 'recaptcha-script';

  constructor(
    protected readonly props: SubmitActionProps<Sitecore.Forms.GenericFormBuilder.SubmitActions.Recaptcha>
  ) {
    super(props);
    this.loadRecaptchaScript();
  }

  private async executeRecaptcha(userAction: string): Promise<string | undefined> {
    return new Promise((resolve) => {
      const checkGrecaptcha = () => {
        if (window.grecaptcha && typeof window.grecaptcha.enterprise.execute === 'function') {
          window.grecaptcha.enterprise
            .execute(config.google.recaptcha.siteKey, {
              action: userAction,
            })
            .then(resolve);
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

    if (!response.ok) {
      return { success: false, errorMessage: this.props.submitAction.fields?.errorMessage.value };
    }

    const verificationResult = await response.json();
    const minimumScoreValue = this.props.submitAction.fields?.minimumScoreValue.value ?? 0.1;

    props.context['GoogleRecaptchaResponse'] = {
      id: this.props.submitAction.id,
      name: 'googleRecaptchaResponse',
      type: 'GoogleRecaptchaResponse',
      value: JSON.stringify(verificationResult),
    };

    if (
      verificationResult.riskAnalysis?.score <= minimumScoreValue ||
      !verificationResult.tokenProperties?.valid ||
      verificationResult.tokenProperties?.action !== userAction
    ) {
      return {
        success: false,
        errorMessage: this.props.submitAction.fields?.errorMessage.value,
        verificationResult: verificationResult,
      };
    }

    return {
      success: true,
      errorMessage: this.props.submitAction.fields?.errorMessage.value,
      verificationResult: verificationResult,
    };
  }

  private async initializeRecaptcha(): Promise<void> {
    const userAction = this.props.submitAction.fields?.userAction.value ?? '';
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
    const errorMessage = this.props.submitAction.fields?.errorMessage.value;
    const userAction = this.props.submitAction.fields?.userAction.value ?? '';

    try {
      const token = (await this.executeRecaptcha(userAction)) as string;
      return this.verifyRecaptcha(token, userAction, props);
    } catch {
      return { success: false, errorMessage: errorMessage };
    }
  }
}
