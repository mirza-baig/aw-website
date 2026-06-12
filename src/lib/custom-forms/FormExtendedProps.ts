import { FormProps } from './FormProps';

export type FormExtendedProps = FormProps & {
  sessionId?: string;
  googleRecaptchaData?: {
    googleRecaptchaResponse?: Record<string, unknown>;
    googleRecaptchaActionId: string;
  };
};
