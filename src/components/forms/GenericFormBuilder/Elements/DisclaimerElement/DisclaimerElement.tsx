'use client';

import classNames from 'classnames';
import { FormikValues, useFormikContext } from 'formik';
import DisclaimerText from 'helpers/DisclaimerText/DisclaimerText';
import { FormFieldsTheme } from 'helpers/GenericFormBuilder/FormFields.Theme';
import { useGenericFormBuilderContext } from 'helpers/GenericFormBuilder/GenericFormBuilderContext';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type alignmentStatus = 'left' | 'center' | 'right';

function DisclaimerElement_Default(
  props: ComponentProps & Sitecore.Forms.GenericFormBuilder.Elements.Disclaimer.DisclaimerElement
): JSX.Element | null {
  const { themeData } = useTheme(FormFieldsTheme);
  const { touched } = useFormikContext<FormikValues>();
  const { isFormInteracted } = useGenericFormBuilderContext();

  if (props.fields == undefined) {
    return null;
  }

  if (
    props.fields.hideFieldOnLoad.value &&
    !isFormInteracted &&
    Object.keys(touched)?.length <= 0
  ) {
    return null;
  }

  const disclaimerAlignment: Record<alignmentStatus, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <DisclaimerText
      {...props}
      disclaimerLayoutClasses="relative col-span-12"
      disclaimerClasses={classNames(
        disclaimerAlignment[getEnum<alignmentStatus>(props?.fields?.alignment) || 'left'],
        themeData.classes.disclaimerText
      )}
    />
  );
}

export const Default = withDatasourceCheck(DisclaimerElement_Default);
