import { ComponentType } from 'react';
import * as yup from 'yup';

import { GetServerSideFormFieldProps, GetStaticFormFieldProps } from './FormFieldProps';

/**
 * Represents a form field module (file)
 */
export type FormFieldModule = {
  /**
   * Default Next.js export
   */
  default?: ComponentType;
  /**
   * Get field initial value
   */
  getInitialValue?: (
    props: unknown,
    additionalDetails?: Record<string, unknown> | undefined
  ) => string | number | boolean | Array<string | number | boolean>;
  /**
   * Get field validation
   */
  getValidationSchema?: (props: unknown, schema: yup.AnyObject) => yup.AnyObject;
  /**
   * function for field level data fetching in SSR mode
   */
  getServerSideProps?: GetServerSideFormFieldProps;
  /**
   * function for field level data fetching in SSG mode
   */
  getStaticProps?: GetStaticFormFieldProps;
};

export type FormFieldModuleFactory = (
  fieldName: string
) => FormFieldModule | Promise<FormFieldModule> | null;
