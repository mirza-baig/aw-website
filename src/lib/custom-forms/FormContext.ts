import { createContext, Dispatch, SetStateAction, useContext } from 'react';

import { FormFieldPropsCollection } from './FormFieldPropsService';
import { FormProps } from './FormProps';

export type FieldState = {
  value?: string;
  validator?: () => boolean;
};

export type FormExtendedProps = FormProps & {
  sessionId?: string;
  googleRecaptchaData?: {
    googleRecaptchaResponse?: Record<string, unknown>;
    googleRecaptchaActionId: string;
  };
};

export type FormStateProps = {
  pageIndex: number;
  formProps: FormExtendedProps;
  initialValues: Record<string, string>;
  setInitialValues: Dispatch<SetStateAction<Record<string, string>>>;
  updatePageIndex: (navigationStep: number) => void;
  isErrorOnSubmit: false | string;
  setIsErrorOnSubmit: Dispatch<SetStateAction<false | string>>;
  getBotCheckerField: () => {
    fieldName: string | null;
    setFieldName: React.Dispatch<React.SetStateAction<string | null>>;
  };
  isFormInteracted?: boolean;
  formFieldProps: FormFieldPropsCollection;
};

/**
 * Hook in order to get access to props related to specific form field. Data comes from FormsContext.
 * @param {string | undefined} fieldId form field id
 * @returns {FormFieldData | undefined} form field props
 */
export function useFormFieldProps<FormFieldData>(
  fieldId: string | undefined
): FormFieldData | undefined {
  const data = useContext(FormsContext).formFieldProps;

  if (!fieldId) {
    return undefined;
  }

  return data[fieldId] as FormFieldData;
}

export const FormsContext = createContext<FormStateProps>({} as FormStateProps);
