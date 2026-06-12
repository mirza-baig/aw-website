import classNames from 'classnames';
import { Field, FormikValues, useFormikContext } from 'formik';
import { FormsConstants } from 'lib/constants/forms-constants';
import { useTheme } from 'lib/context/ThemeContext';
import { FormFieldProps } from 'lib/custom-forms/FormFieldProps';
import { getValidatonSchema, getValueProviderValue } from 'lib/custom-forms/FormFieldUtils';
import React, { JSX } from 'react';
import * as yup from 'yup';

import FieldWrapper from './FieldWrapper';
import { FormFieldsTheme } from './FormFields.Theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export type ZippopotamusZipCodeProps =
  Sitecore.Forms.GenericFormBuilder.Fields.ZippopotamusZipCode.ZippopotamusZipCodeField &
    FormFieldProps;

export const getInitialValue = (props: ZippopotamusZipCodeProps) => {
  const valueProvider = getValueProviderValue(props);
  if (valueProvider) {
    return valueProvider;
  } else if (props?.fields?.defaultValue) {
    return props?.fields?.defaultValue?.value ?? '';
  }
};

export const getValidationSchema = (props: ZippopotamusZipCodeProps, schema: yup.AnyObject) => {
  const { validations } = props?.fields ?? {};
  if (validations) {
    const validator = getValidatonSchema('string', props);
    if (validator) {
      schema[props?.fields?.fieldName.value] = validator;
    }
  }
  return schema;
};

const ZippopotamusZipCode = (props: ZippopotamusZipCodeProps): JSX.Element => {
  const { themeData } = useTheme(FormFieldsTheme);
  const { errors, touched, values, setFieldValue } = useFormikContext<FormikValues>();

  const isInvalid =
    touched[props?.fields?.fieldName.value] && errors[props?.fields?.fieldName.value];

  const cityFieldName =
    props?.fields?.cityField?.fields?.fieldName?.value ?? `${props?.fields?.fieldName.value}-city`;
  const cityIdValue = props?.fields?.cityField?.fields?.id ?? `${props.id}-city`;

  const stateFieldName =
    props?.fields?.stateField?.fields?.fieldName?.value ??
    `${props?.fields?.fieldName.value}-state`;
  const stateIdValue = props?.fields?.stateField?.fields?.id ?? `${props.id}-state`;

  const lastFetchedZipCode = React.useRef<string | null>(null);

  const handleZipBlur = (
    e: React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>
  ) => {
    const zipValue = (e.target as HTMLInputElement).value;

    if (zipValue === lastFetchedZipCode.current) {
      return;
    }

    const isUSZip = /^\d{5}$/.test(zipValue);
    const isCanadianPostal = /^[a-z]\d[a-z] ?\d[a-z]\d$/i.test(zipValue);

    if (!isUSZip && !isCanadianPostal) {
      if (lastFetchedZipCode.current !== null) {
        setFieldValue(cityFieldName, '');
        setFieldValue(stateFieldName, '');
        lastFetchedZipCode.current = null;
      }
      return;
    }

    const zippopotamusCityStateFetcher = async (zipCode: string, country: 'us' | 'ca') => {
      try {
        // For Canadian postal codes, zippopotam API only accepts first 3 characters (FSA)
        const lookupCode = country === 'ca' ? zipCode.replace(/\s/g, '').substring(0, 3) : zipCode;
        const apiEndpoint =
          country === 'us'
            ? '/api/aw/custom-forms/zippopotam-us'
            : '/api/aw/custom-forms/zippopotam-ca';

        const response = await fetch(apiEndpoint, {
          method: 'POST',
          body: JSON.stringify({ postalCode: lookupCode }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();

        if (result['places']?.length > 0) {
          const postCity = result['places'][0]['place name'];
          if (postCity) {
            setFieldValue(cityFieldName, postCity);
          }

          const postState = result['places'][0]['state abbreviation'];
          if (postState) {
            setFieldValue(stateFieldName, postState);
          }

          // Update country field based on detected format
          setFieldValue(
            'country',
            country === 'us' ? FormsConstants.Country.USA : FormsConstants.Country.Canada
          );
        }
      } catch (error) {
        console.error('Error fetching Zippopotum data:', error);
      }
    };

    setFieldValue(cityFieldName, '');
    setFieldValue(stateFieldName, '');
    lastFetchedZipCode.current = zipValue;

    if (zipValue && isUSZip) {
      zippopotamusCityStateFetcher(zipValue, 'us');
    } else if (zipValue && isCanadianPostal) {
      zippopotamusCityStateFetcher(zipValue, 'ca');
    }
  };

  return (
    <>
      <FieldWrapper {...props}>
        <Field
          id={props.id}
          name={props?.fields?.fieldName.value}
          type={'text'}
          placeholder={props.fields?.placeholderText?.value ?? ''}
          className={classNames(
            themeData.classes.input,
            isInvalid ? themeData.classes.errorOutline : '',
            values[props?.fields?.fieldName.value] ? 'border-black' : ''
          )}
          onKeyUp={handleZipBlur}
          onBlur={handleZipBlur}
        />
      </FieldWrapper>
      {props.fields?.cityField && (
        <div className="relative hidden" data-te-input-wrapper-init>
          <Field id={cityIdValue} name={cityFieldName} type="hidden" />
        </div>
      )}
      {props.fields?.stateField && (
        <div className="relative hidden" data-te-input-wrapper-init>
          <Field id={stateIdValue} name={stateFieldName} type="hidden" />
        </div>
      )}
    </>
  );
};

export default ZippopotamusZipCode;
