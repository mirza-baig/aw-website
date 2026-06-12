'use client';

import { FormikValues, useFormikContext } from 'formik';
import { BodyCopy } from 'helpers/BodyCopy/BodyCopy';
import { useGenericFormBuilderContext } from 'helpers/GenericFormBuilder/GenericFormBuilderContext';
import { FormsConstants } from 'lib/constants/forms-constants';
import { JSX, ReactNode, useEffect } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type FormPageProps = Sitecore.Forms.GenericFormBuilder.Structure.FormPage.FormPage & {
  classes: string;
  placeholder: ReactNode;
};

export function FormPageClient(props: FormPageProps): JSX.Element {
  const { isErrorOnSubmit } = useGenericFormBuilderContext();
  const { values, setFieldValue } = useFormikContext<FormikValues>();

  useEffect(() => {
    function handleOpenFormEvent(e: CustomEvent) {
      if (e.detail?.form !== undefined) {
        Object.keys(e.detail.form).forEach((key) => {
          if (key in values) {
            // only set field value if the field exists
            setFieldValue(key, e.detail.form[key]);
          }
        });
      }
    }
    document.addEventListener(FormsConstants.Enterprise.openFormEvent, handleOpenFormEvent);
    return () => {
      document.removeEventListener(FormsConstants.Enterprise.openFormEvent, handleOpenFormEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {props.placeholder}
      {isErrorOnSubmit && (
        <BodyCopy
          fields={{ body: { value: isErrorOnSubmit } }}
          classes="relative mb-s col-span-12 text-[#F14343] text-small"
        />
      )}
    </>
  );
}
