import { FormikHelpers, FormikValues } from 'formik';
import { RefObject } from 'react';

import { ControlState } from './address-field-types';

export function buildHandlePlaceChanged(
  fieldNames: {
    address1: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  },
  addressInputRef: RefObject<google.maps.places.Autocomplete | null>,
  setFieldValue: FormikHelpers<FormikValues>['setFieldValue'],
  setFormState: (value: React.SetStateAction<ControlState>) => void
) {
  return () => {
    if (addressInputRef.current) {
      const { address_components } = addressInputRef.current.getPlace();

      // Prepare full address to show on address1 field
      let fullStreetAddress = '';
      address_components?.forEach((component) => {
        if (component.types.includes('street_number') || component.types.includes('route')) {
          fullStreetAddress += (fullStreetAddress ? ' ' : '') + component.long_name;
        } else if (fullStreetAddress === '') {
          if (
            component.types.includes('locality') ||
            component.types.includes('sublocality') ||
            component.types.includes('administrative_area_level_1') ||
            component.types.includes('country')
          ) {
            fullStreetAddress += (fullStreetAddress ? ', ' : '') + component.long_name;
          }
        }
      });
      fullStreetAddress = fullStreetAddress.replace(/^, /, '');
      setFieldValue(fieldNames.address1, fullStreetAddress);

      const selectedStateFullName = address_components?.find((component) =>
        component.types.includes('administrative_area_level_1')
      )?.long_name;

      let selectedCountry = address_components?.find((component) =>
        component.types.includes('country')
      )?.long_name;
      // If the selected country is 'United States', set it as 'USA'
      if (selectedCountry === 'United States') {
        selectedCountry = 'USA';
      }

      address_components?.forEach((component) => {
        if (fieldNames.city && component.types.includes('locality')) {
          setFieldValue(fieldNames.city, component.long_name);
        } else if (fieldNames.zipCode && component.types.includes('postal_code')) {
          setFieldValue(fieldNames.zipCode, component.long_name);
        }
      });

      if (fieldNames.country && selectedCountry) {
        setFieldValue(fieldNames.country, selectedCountry);
        setFormState((prevState) => ({
          ...prevState,
          lastCountryValue: selectedCountry,
        }));
      }

      if (fieldNames.state && selectedStateFullName) {
        setFieldValue(fieldNames.state, selectedStateFullName);
      }
    }
  };
}
