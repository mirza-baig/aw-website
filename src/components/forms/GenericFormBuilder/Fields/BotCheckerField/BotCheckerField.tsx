'use client';

import classNames from 'classnames';
import { Field, FormikValues, useFormikContext } from 'formik';
import { FormFieldsTheme } from 'helpers/GenericFormBuilder/FormFields.Theme';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

function BotChecker_Default(
  props: ComponentProps & Sitecore.Forms.GenericFormBuilder.Fields.BotChecker.BotCheckerField
): JSX.Element | null {
  const { themeData } = useTheme(FormFieldsTheme);
  const { errors, touched, values } = useFormikContext<FormikValues>();
  const { page } = props;

  if (page.mode.isEditing) {
    return (
      <div className="col-span-12 p-3 bg-light-gray border border-gray">Bot Checker Field</div>
    );
  }

  if (props.fields == undefined) {
    return null;
  }

  const isInvalid = touched[props.fields.fieldName.value] && errors[props.fields.fieldName.value];

  return (
    <div aria-hidden={true} className="absolute col-span-12 m-0 h-0 overflow-hidden">
      <label htmlFor={props.rendering.uid}>Do not Fill this field</label>

      <Field
        id={props.rendering.uid}
        name={props.fields?.fieldName.value}
        placeholder="Do not fill this field"
        autoComplete="off"
        tabIndex="-1"
        maxLength="50"
        className={classNames(
          themeData.classes.input,
          isInvalid ? themeData.classes.errorOutline : '',
          values[props?.fields?.fieldName?.value] ? 'border-black' : ''
        )}
      />
    </div>
  );
}

export const Default = withDatasourceCheck(BotChecker_Default);
