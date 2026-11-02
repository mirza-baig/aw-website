'use client';

import { useEffect, useRef, useState } from 'react';

import { Recaptcha } from './SubmitActions/Actions/Recaptcha';
import { BaseSubmitProps } from './SubmitActions/BaseSubmitAction';

const DEFAULT_ERROR_MESSAGE = 'Error while processing your request.';

type RecaptchaSettingsFields = {
  userAction?: { value?: string };
  minimumScoreValue?: { value?: number | string };
  errorMessage?: { value?: string };
};

export type CustomFormRecaptchaResult = {
  success: boolean;
  errorMessage?: string;
};

export function useCustomFormRecaptcha(fields: unknown, formName = 'CustomForm') {
  const settings = fields as RecaptchaSettingsFields | undefined;
  const isRecaptchaEnabled =
    String(settings?.userAction?.value ?? '').trim() !== '' &&
    String(settings?.minimumScoreValue?.value ?? '').trim() !== '';

  const recaptchaRef = useRef<Recaptcha | null>(null);
  const [recaptchaError, setRecaptchaError] = useState<string | false>(false);

  const getRecaptchaAction = (): Recaptcha => {
    recaptchaRef.current ??= new Recaptcha({
      formData: {},
      actionFieldsProps: fields as BaseSubmitProps['actionFieldsProps'],
    });
    return recaptchaRef.current;
  };
  useEffect(() => {
    console.info(`[reCAPTCHA] ${formName} mount`, {
      userAction: settings?.userAction?.value,
      minimumScoreValue: settings?.minimumScoreValue?.value,
      isRecaptchaEnabled,
    });
    if (isRecaptchaEnabled) {
      getRecaptchaAction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecaptchaEnabled]);

  const runRecaptcha = async (): Promise<CustomFormRecaptchaResult> => {
    setRecaptchaError(false);
    console.info(`[reCAPTCHA] ${formName} submit — enabled:`, isRecaptchaEnabled);

    if (!isRecaptchaEnabled) {
      return { success: true };
    }

    let errorMessage = settings?.errorMessage?.value || DEFAULT_ERROR_MESSAGE;
    try {
      const action = getRecaptchaAction();
      action.formData = {};
      const result = await action.executeAction();
      console.info(`[reCAPTCHA] ${formName} result`, result);

      if (result.success) {
        return { success: true };
      }
      errorMessage = result.errorMessage || errorMessage;
    } catch (error) {
      console.error(`[reCAPTCHA] ${formName} error`, error);
    }

    setRecaptchaError(errorMessage);
    return { success: false, errorMessage };
  };

  return { isRecaptchaEnabled, runRecaptcha, recaptchaError };
}
