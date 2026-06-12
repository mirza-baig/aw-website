'use client';

import { Autocomplete, Libraries, useJsApiLoader } from '@react-google-maps/api';
import { Page } from '@sitecore-content-sdk/nextjs';
import config from 'aw.config.client';
import classNames from 'classnames';
import { Field, FormikValues, useFormikContext } from 'formik';
import { FieldWrapper } from 'helpers/GenericFormBuilder/FieldWrapper';
import { FormFieldsTheme } from 'helpers/GenericFormBuilder/FormFields.Theme';
import { Spinner } from 'helpers/Spinner';
import { ComponentProps } from 'lib/component-props';
import { FormsConstants } from 'lib/constants/forms-constants';
import { useTheme } from 'lib/context/ThemeContext';
import { getWidthClass } from 'lib/generic-form-builder/utils/get-width-class';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';
import { JSX, useEffect, useRef, useState } from 'react';

import {
  buildHandlePlaceChanged,
  ControlState,
  CountryItem,
  StateItem,
} from './helpers/address-field-utils';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export type AddressProps = ComponentProps &
  Sitecore.Forms.GenericFormBuilder.Fields.Address.AddressField & {
    countryAndStateOptions: CountryItem[];
    stateOptions: StateItem[];
    paeg: Page;
  };

function GetLabels(
  country: string | undefined,
  props: AddressProps
): {
  cityLabel: string;
  stateLabel: string;
  zipCodeLabel: string;
  cityPlaceholder: string;
  zipCodePlaceholder: string;
} {
  let cityLabel = props.fields?.cityLabel.value ?? 'City';
  let stateLabel = props.fields?.stateLabel.value ?? 'State';
  let zipCodeLabel = props.fields?.zipCodeLabel.value ?? 'Zip Code';
  let cityPlaceholder = props.fields?.cityPlaceholderText.value ?? 'City';
  let zipCodePlaceholder = props.fields?.zipCodePlaceholderText.value ?? 'Zip Code';
  if (country === FormsConstants.Country.USA || country === FormsConstants.Country.Mexico) {
    cityLabel = props.fields?.cityUSLabel.value ?? 'City';
    stateLabel = props.fields?.stateUSLabel.value ?? 'State';
    zipCodeLabel = props.fields?.zipCodeUSLabel.value ?? 'Zip Code';
    cityPlaceholder = props.fields?.cityUSPlaceholderText.value ?? 'City';
    zipCodePlaceholder = props.fields?.zipCodeUSPlaceholderText.value ?? 'Zip Code';
  } else if (country === FormsConstants.Country.Canada) {
    cityLabel = props.fields?.cityCALabel.value ?? 'Municipality';
    stateLabel = props.fields?.stateCALabel.value ?? 'Province';
    zipCodeLabel = props.fields?.zipCodeCALabel.value ?? 'Postal Code';
    cityPlaceholder = props.fields?.cityCAPlaceholderText.value ?? 'Municipality';
    zipCodePlaceholder = props.fields?.zipCodeCAPlaceholderText.value ?? 'Postal Code';
  } else if (country === FormsConstants.Country.Other) {
    cityLabel = props.fields?.cityOtherLabel.value ?? 'City';
    stateLabel = props.fields?.stateOtherLabel.value ?? 'Location';
    zipCodeLabel = props.fields?.zipCodeOtherLabel.value ?? 'Zip Code';
    cityPlaceholder = props.fields?.cityOtherPlaceholderText.value ?? 'City';
    zipCodePlaceholder = props.fields?.zipCodeOtherPlaceholderText.value ?? 'Zip Code';
  }
  return { cityLabel, stateLabel, zipCodeLabel, cityPlaceholder, zipCodePlaceholder };
}

// We need to keep this outside of the functional component in order to avoid "False performance warning about libraries"
// Please refer https://github.com/JustFly1984/react-google-maps-api/issues/238 for more info
const googleLibrariesToLoad: Libraries = ['places'];

function AddressField_Default(props: AddressProps): JSX.Element | null {
  const { page } = props;
  const { themeName, themeData } = useTheme(FormFieldsTheme);
  const { errors, touched, values, setFieldValue } = useFormikContext<FormikValues>();

  const countryContainerRef = useRef<HTMLDivElement>(null);

  let initialCountryFieldValue = '';
  let initialStateOptions: StateItem[] = [];
  if (props.fields != undefined && !isNullOrWhitespace(props.fields.countryFieldName.value)) {
    initialCountryFieldValue = values[props.fields.countryFieldName.value];
    initialCountryFieldValue ??=
      props.countryAndStateOptions.length > 0 ? props.countryAndStateOptions[0].value : '';
    if (initialCountryFieldValue != undefined) {
      const countryOption = props.countryAndStateOptions.find(
        // @ts-ignore Once type generation is fixed, then type is inferred correctly
        (option) => option.value === initialCountryFieldValue
      );
      initialStateOptions = countryOption?.states || [];
    }
  } else {
    // @ts-ignore Once type generation is fixed, then type is inferred correctly
    const countryOption = props.countryAndStateOptions.find((option) => option.value === 'USA');
    initialStateOptions = countryOption?.states || [];
  }

  const { cityLabel, stateLabel, zipCodeLabel, cityPlaceholder, zipCodePlaceholder } = GetLabels(
    initialCountryFieldValue,
    props
  );

  const [formState, setFormState] = useState<ControlState>({
    cityLabel,
    stateLabel,
    zipCodeLabel,
    cityPlaceholder,
    zipCodePlaceholder,
    stateOptions: initialStateOptions,
    stateOrLocation: 'state',
    lastCountryValue: '',
  });

  useEffect(() => {
    if (props.fields == undefined || isNullOrWhitespace(props.fields?.countryFieldName.value)) {
      return;
    }
    if (values[props.fields.countryFieldName.value] === formState.lastCountryValue) {
      return;
    }

    const currentCountry = values[props.fields.countryFieldName.value];
    const { cityLabel, stateLabel, zipCodeLabel, cityPlaceholder, zipCodePlaceholder } = GetLabels(
      currentCountry,
      props
    );
    let stateOrLocation = formState.stateOrLocation;
    const stateOptions =
      // @ts-ignore Once type generation is fixed, then type is inferred correctly
      props.countryAndStateOptions.find((option) => option.value === currentCountry)?.states ??
      formState.stateOptions;
    if (
      currentCountry === FormsConstants.Country.USA ||
      currentCountry === FormsConstants.Country.Mexico ||
      currentCountry === FormsConstants.Country.Canada
    ) {
      stateOrLocation = 'state';
      setFieldValue(props.fields.stateFieldName.value, stateOptions[0].value);
    } else if (currentCountry === FormsConstants.Country.Other) {
      stateOrLocation = 'location';
      setFieldValue(props.fields.stateFieldName.value, '');
    }

    setFormState((prevState) => ({
      ...prevState,
      lastCountryValue: currentCountry,
      cityLabel,
      stateLabel,
      zipCodeLabel,
      cityPlaceholder,
      zipCodePlaceholder,
      stateOrLocation,
      stateOptions,
    }));
  }, [values, formState, props, setFieldValue]);

  // Ggoogle maps places Autocomplete
  const addressInputRef = useRef<google.maps.places.Autocomplete>(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: config.google.apiKey,
    libraries: googleLibrariesToLoad as unknown as Libraries,
  });
  const allowedCountries = ['us', 'ca', 'mx']; //Restrict google autocomplete to show only US and Mexico

  const isInvalid = {
    address1:
      props.fields?.address1FieldName == undefined
        ? false
        : touched[props.fields.address1FieldName.value] &&
          errors[props.fields.address1FieldName.value],
    address2:
      props.fields?.address2FieldName == undefined
        ? false
        : touched[props.fields.address2FieldName.value] &&
          errors[props.fields.address2FieldName.value],
    city:
      props.fields?.cityFieldName == undefined
        ? false
        : touched[props.fields.cityFieldName.value] && errors[props.fields.cityFieldName.value],
    state:
      props.fields?.stateFieldName == undefined
        ? false
        : touched[props.fields.stateFieldName.value] && errors[props.fields.stateFieldName.value],
    zipCode:
      props.fields?.zipCodeFieldName == undefined
        ? false
        : touched[props.fields.zipCodeFieldName.value] &&
          errors[props.fields.zipCodeFieldName.value],
    country:
      props.fields?.countryFieldName == undefined
        ? false
        : touched[props.fields.countryFieldName.value] &&
          errors[props.fields.countryFieldName.value],
  };
  return isLoaded ? (
    <>
      {props.fields?.address1FieldName && (
        <div className={classNames('relative mb-s', getWidthClass(props.fields.address1Width))}>
          {/* address1 text input */}
          <Autocomplete
            onLoad={(ref) => (addressInputRef.current = ref)}
            onPlaceChanged={buildHandlePlaceChanged(
              {
                address1: props.fields.address1FieldName.value,
                city: props.fields.cityFieldName?.value,
                state: props.fields.stateFieldName?.value,
                zipCode: props.fields.zipCodeFieldName?.value,
                country: props.fields.countryFieldName?.value,
              },
              addressInputRef,
              setFieldValue,
              setFormState
            )}
            restrictions={{ country: allowedCountries }}
          >
            <FieldWrapper
              {...{
                fields: {
                  fieldName: props.fields.address1FieldName,
                  label: props.fields.address1Label,
                  subLabel: props.fields.address1SubLabel,
                  minLength: props.fields.address1MinLength,
                  maxLength: props.fields.address1MaxLength,
                  validations: props.fields.address1Validations,
                },
              }}
            >
              <Field
                id={props.fields.address1FieldId.value}
                name={props.fields.address1FieldName.value}
                type="text"
                placeholder={props.fields.address1PlaceholderText.value}
                minLength={props.fields.address1MinLength.value}
                maxLength={props.fields.address1MaxLength.value}
                className={classNames(themeData.classes.input, {
                  [themeData.classes.errorOutline]: isInvalid.address1,
                  'border-black': values[props.fields.address1FieldName.value],
                  'pointer-events-none': page.mode.isEditing,
                })}
              />
            </FieldWrapper>
          </Autocomplete>
        </div>
      )}

      {props.fields?.address2FieldName && (
        <FieldWrapper
          {...{
            fields: {
              fieldName: props.fields.address2FieldName,
              label: props.fields.address2Label,
              subLabel: props.fields.address2SubLabel,
              minLength: props.fields.address2MinLength,
              maxLength: props.fields.address2MaxLength,
              width: props.fields.address2Width,
              validations: props.fields.address2Validations,
            },
          }}
        >
          <Field
            id={props.fields.address2FieldId.value}
            name={props.fields.address2FieldName.value}
            type="text"
            placeholder={props.fields.address2PlaceholderText.value}
            minLength={props.fields.address2MinLength.value}
            maxLength={props.fields.address2MaxLength.value}
            className={classNames(themeData.classes.input, {
              [themeData.classes.errorOutline]: isInvalid.address2,
              'border-black': values[props.fields.address2FieldName.value],
              'pointer-events-none': page.mode.isEditing,
            })}
          />
        </FieldWrapper>
      )}
      {props.fields?.countryFieldName && (
        <FieldWrapper
          {...{
            fields: {
              fieldName: props.fields.countryFieldName,
              label: props.fields.countryLabel,
              subLabel: props.fields.countrySubLabel,
              width: props.fields.countryWidth,
              validations: props.fields.countryValidations,
            },
          }}
        >
          <div className="relative" ref={countryContainerRef}>
            <Field
              id={props.fields.countryFieldId.value}
              name={props.fields.countryFieldName.value}
              as="select"
              value={values[props.fields.countryFieldName.value]}
              className={classNames(themeData.classes.input, {
                [themeData.classes.errorOutline]: isInvalid.country,
                'border-black': values[props.fields.countryFieldName.value],
                'pointer-events-none': page.mode.isEditing,
              })}
            >
              {props.countryAndStateOptions.map((option: CountryItem) => (
                <option
                  key={option.id}
                  value={option.value}
                  disabled={themeName === 'aw' && option.value === ''}
                >
                  {option.title}
                </option>
              ))}
              {!props.countryAndStateOptions.some(
                ((value) => {
                  // @ts-ignore Once type generation is fixed, then type is inferred correctly
                  return (option) => option.value === value;
                })(values[props.fields.countryFieldName.value])
              ) && (
                <option value={values[props.fields.countryFieldName.value]}>
                  {values[props.fields.countryFieldName.value]}
                </option>
              )}
            </Field>
          </div>
        </FieldWrapper>
      )}

      {props.fields?.cityFieldName && (
        <FieldWrapper
          {...{
            fields: {
              fieldName: props.fields.cityFieldName,
              label: { value: formState.cityLabel },
              subLabel: props.fields.citySubLabel,
              minLength: props.fields.cityMinLength,
              maxLength: props.fields.cityMaxLength,
              width: props.fields.cityWidth,
              validations: props.fields.cityValidations,
            },
          }}
        >
          <Field
            id={props.fields.cityFieldId.value}
            name={props.fields.cityFieldName.value}
            type="text"
            placeholder={formState.cityPlaceholder}
            minLength={props.fields.cityMinLength.value}
            maxLength={props.fields.cityMaxLength.value}
            className={classNames(themeData.classes.input, {
              [themeData.classes.errorOutline]: isInvalid.city,
              'border-black': values[props.fields.cityFieldName.value],
              'pointer-events-none': page.mode.isEditing,
            })}
          />
        </FieldWrapper>
      )}

      {props.fields?.stateFieldName && formState.stateOrLocation === 'state' && (
        <FieldWrapper
          {...{
            fields: {
              fieldName: props.fields.stateFieldName,
              label: { value: formState.stateLabel },
              subLabel: props.fields.stateSubLabel,
              width: props.fields.stateWidth,
              validations: props.fields.stateValidations,
            },
          }}
        >
          <Field
            id={props.fields?.stateFieldId.value}
            name={props.fields.stateFieldName.value}
            as="select"
            value={values[props.fields.stateFieldName.value]}
            className={classNames(themeData.classes.input, {
              [themeData.classes.errorOutline]: isInvalid.state,
              'border-black': values[props.fields.stateFieldName.value],
              'pointer-events-none': page.mode.isEditing,
            })}
          >
            {formState.stateOptions.map((option) => (
              <option
                key={option.id}
                value={option.value}
                disabled={themeName === 'aw' && option.value === ''}
              >
                {option.title}
              </option>
            ))}
            {!formState.stateOptions.some(
              ((value) => {
                return (option) => option.value === value;
              })(values[props.fields.stateFieldName.value])
            ) && (
              <option value={values[props.fields.stateFieldName.value]}>
                {values[props.fields.stateFieldName.value]}
              </option>
            )}
          </Field>
        </FieldWrapper>
      )}
      {props.fields?.stateFieldName && formState.stateOrLocation === 'location' && (
        <FieldWrapper
          {...{
            fields: {
              fieldName: props.fields.stateFieldName,
              label: { value: formState.stateLabel },
              subLabel: props.fields.stateSubLabel,
              width: props.fields.stateWidth,
              validations: [],
            },
          }}
        >
          <Field
            id={props.fields?.stateFieldId.value}
            name={props.fields.stateFieldName.value}
            type="text"
            placeholder={props.fields.stateOtherPlaceholderText.value}
            maxLength="25"
            className={classNames(themeData.classes.input, {
              [themeData.classes.errorOutline]: isInvalid.state,
              'border-black': values[props.fields.stateFieldName.value],
              'pointer-events-none': page.mode.isEditing,
            })}
          />
        </FieldWrapper>
      )}

      {props.fields?.zipCodeFieldName && (
        <FieldWrapper
          {...{
            fields: {
              fieldName: props.fields.zipCodeFieldName,
              label: { value: formState.zipCodeLabel },
              subLabel: props.fields.zipCodeSubLabel,
              width: props.fields.zipCodeWidth,
              validations:
                formState.stateOrLocation === 'location' ? [] : props.fields.zipCodeValidations,
            },
          }}
        >
          <Field
            id={props.fields.zipCodeFieldId.value}
            name={props.fields.zipCodeFieldName.value}
            type="text"
            placeholder={formState.zipCodePlaceholder}
            className={classNames(themeData.classes.input, {
              [themeData.classes.errorOutline]: isInvalid.zipCode,
              'border-black': values[props.fields.zipCodeFieldName.value],
              'pointer-events-none': page.mode.isEditing,
            })}
          />
        </FieldWrapper>
      )}
    </>
  ) : (
    <div className="relative col-span-12 flex min-h-[375px] items-center justify-center md:min-h-[150px]">
      <Spinner size={48} />
    </div>
  );
}

export const Default = withDatasourceCheck(AddressField_Default);
