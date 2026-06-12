'use client';

import classNames from 'classnames';
import { Field, FormikValues, useFormikContext } from 'formik';
import { FieldWrapper } from 'helpers/GenericFormBuilder/FieldWrapper';
import { FormFieldsTheme } from 'helpers/GenericFormBuilder/FormFields.Theme';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';
import { JSX } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

function ZippopotamusZipCodeField_Default(
  props: ComponentProps &
    Sitecore.Forms.GenericFormBuilder.Fields.ZippopotamusZipCode.ZippopotamusZipCodeField
): JSX.Element | null {
  const { themeData } = useTheme(FormFieldsTheme);
  const { errors, touched, values, setFieldValue } = useFormikContext<FormikValues>();
  const { page } = props;

  if (props.fields == undefined) {
    return null;
  }

  const name = props.fields.fieldName.value;
  if (isNullOrWhitespace(name) && !page.mode.isEditing) {
    return null;
  }

  const isInvalid = touched[name] && errors[name];

  const cityFieldName = isNullOrWhitespace(props.fields.cityFieldName.value)
    ? `${name}-city`
    : props.fields.cityFieldName.value;
  const cityFieldId = isNullOrWhitespace(props.fields.cityFieldId.value)
    ? `${props.rendering.uid}-city`
    : props.fields.cityFieldId.value;

  const stateFieldName = isNullOrWhitespace(props.fields.stateFieldName.value)
    ? `${name}-state`
    : props.fields.stateFieldName.value;
  const stateFieldId = isNullOrWhitespace(props.fields.stateFieldId.value)
    ? `${props.rendering.uid}-city`
    : props.fields.stateFieldId.value;

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const zipValue = (e.target as HTMLInputElement).value;
    const isValidZip = /^\d{5}$/.test(zipValue);

    const zippopotamusCityStateFetcher = async (zipCode: string) => {
      try {
        const response = await fetch('/api/aw/generic-form-builder/zippopotam-us', {
          method: 'POST',
          body: JSON.stringify({ postalCode: zipCode }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();

        if (result && Object.keys(result).length > 0) {
          const postCity = result['places'][0]['place name'];
          if (postCity) {
            setFieldValue(cityFieldName, postCity);
          }

          const postState = result['places'][0]['state abbreviation'];
          if (postState) {
            setFieldValue(stateFieldName, postState);
          }
        }
      } catch (error) {
        console.error('Error fetching Zippopotum.US data:', error);
      }
    };

    setFieldValue(cityFieldName, '');
    setFieldValue(stateFieldName, '');

    if (zipValue && isValidZip) {
      zippopotamusCityStateFetcher(zipValue);
    }
  };

  return (
    <>
      <FieldWrapper {...props}>
        <Field
          id={props.rendering.uid}
          name={name}
          type={'text'}
          placeholder={props.fields?.placeholderText?.value ?? ''}
          className={classNames(
            themeData.classes.input,
            isInvalid ? themeData.classes.errorOutline : '',
            values[name] ? 'border-black' : '',
            page.mode.isEditing ? 'pointer-events-none' : ''
          )}
          onKeyUp={handleKeyUp}
        />
      </FieldWrapper>
      <div className="relative hidden" data-te-input-wrapper-init>
        <Field id={cityFieldId} name={cityFieldName} type="hidden" />
      </div>
      <div className="relative hidden" data-te-input-wrapper-init>
        <Field id={stateFieldId} name={stateFieldName} type="hidden" />
      </div>
    </>
  );
}

export const Default = withDatasourceCheck(ZippopotamusZipCodeField_Default);
