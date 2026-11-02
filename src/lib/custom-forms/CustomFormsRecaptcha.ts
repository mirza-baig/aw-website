const SCRIPT_ID = 'recaptcha-script';
const VERIFY_URL = '/api/aw/custom-forms/submit-actions/verify-recaptcha';
const SITE_KEY = process.env.NEXT_PUBLIC_AW_GOOGLE_RECAPTCHA_SITE_KEY ?? '';
const SCRIPT_TIMEOUT_MS = 10000;
const DEFAULT_ERROR_MESSAGE = 'Error while processing your request.';

type GrecaptchaEnterprise = {
  ready: (callback: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
};

const getGrecaptchaEnterprise = (): GrecaptchaEnterprise | undefined =>
  (globalThis as unknown as { grecaptcha?: { enterprise?: GrecaptchaEnterprise } }).grecaptcha
    ?.enterprise;

export type CustomFormRecaptchaResult = {
  success: boolean;
  isValid: boolean;
  verificationResult?: Record<string, unknown>;
};

function loadRecaptchaScript(): void {
  if (typeof document === 'undefined' || document.getElementById(SCRIPT_ID)) {
    return;
  }
  const script = document.createElement('script');
  script.src = `https://www.google.com/recaptcha/enterprise.js?render=${SITE_KEY}`;
  script.id = SCRIPT_ID;
  document.body.appendChild(script);
}

export function preloadCustomFormRecaptcha(): void {
  loadRecaptchaScript();
}

function getToken(userAction: string): Promise<string> {
  loadRecaptchaScript();

  return new Promise((resolve, reject) => {
    const startedAt = Date.now();

    const tryExecute = () => {
      const enterprise = getGrecaptchaEnterprise();
      if (typeof enterprise?.execute === 'function') {
        enterprise.ready(() => {
          enterprise.execute(SITE_KEY, { action: userAction }).then(resolve, reject);
        });
      } else if (Date.now() - startedAt > SCRIPT_TIMEOUT_MS) {
        // script blocked (ad blocker / CSP) — fail instead of hanging the form
        reject(new Error('reCAPTCHA script did not load'));
      } else {
        setTimeout(tryExecute, 100);
      }
    };

    tryExecute();
  });
}

export async function verifyCustomFormRecaptcha(
  userAction: string,
  minimumScore = 0.5
): Promise<CustomFormRecaptchaResult> {
  try {
    const token = await getToken(userAction);

    const response = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, userAction }),
    });

    if (!response.ok) {
      return { success: false, isValid: false };
    }

    const verificationResult = await response.json();

    const isValid = !(
      verificationResult.riskAnalysis?.score < minimumScore ||
      !verificationResult.tokenProperties?.valid ||
      verificationResult.tokenProperties?.action !== userAction
    );
    verificationResult.isValid = isValid;

    return { success: isValid, isValid, verificationResult };
  } catch (error) {
    console.error('Custom Forms reCAPTCHA verification failed:', error);
    return { success: false, isValid: false };
  }
}

export type CustomFormRecaptchaFields = {
  userAction?: { value?: string };
  minimumScoreValue?: { value?: number | string };
  errorMessage?: { value?: string };
};

export type CustomFormRecaptchaOutcome = CustomFormRecaptchaResult & {
  skipped: boolean;
  stopSubmit: boolean;
  errorMessage?: string;
  capturedValues: {
    isRecaptchaValid?: boolean;
    googleRecaptchaResponse?: string;
  };
};

const hasValue = (value?: string | number) =>
  value !== undefined && value !== null && String(value).trim() !== '';

export function isCustomFormRecaptchaEnabled(fields?: CustomFormRecaptchaFields): boolean {
  return hasValue(fields?.userAction?.value) && hasValue(fields?.minimumScoreValue?.value);
}

export function preloadCustomFormRecaptchaIfEnabled(fields?: CustomFormRecaptchaFields): void {
  if (isCustomFormRecaptchaEnabled(fields)) {
    preloadCustomFormRecaptcha();
  }
}

export async function runCustomFormRecaptcha(
  fields?: CustomFormRecaptchaFields
): Promise<CustomFormRecaptchaOutcome> {
  if (!isCustomFormRecaptchaEnabled(fields)) {
    return { success: true, isValid: true, skipped: true, stopSubmit: false, capturedValues: {} };
  }

  const userAction = String(fields?.userAction?.value).trim();
  const minimumScore = Number(fields?.minimumScoreValue?.value);
  const errorMessage = fields?.errorMessage?.value || DEFAULT_ERROR_MESSAGE;

  const result = await verifyCustomFormRecaptcha(userAction, minimumScore);

  return {
    ...result,
    skipped: false,
    stopSubmit: !result.success,
    errorMessage: result.success ? undefined : errorMessage,
    capturedValues: {
      isRecaptchaValid: result.isValid,
      googleRecaptchaResponse: result.verificationResult
        ? JSON.stringify(result.verificationResult)
        : undefined,
    },
  };
}
