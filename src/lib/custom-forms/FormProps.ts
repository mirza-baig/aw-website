import { Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

import { FormFieldProps } from './FormFieldProps';

export type FormProps = ComponentProps & {
  [key: string]: unknown;
  fields: {
    children: Array<FormFieldProps>;
    formName: Field<string>;
    inputPadding?: {
      fields: {
        Value: {
          value: string;
        };
      };
    };
  };
  classes?: string;
};
