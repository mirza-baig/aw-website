import { FormikHelpers, FormikValues } from 'formik';
import { ItemChildrenService } from 'lib/graphql/item-children-service';
import sitecoreClient from 'lib/sitecore-client';
import { RefObject } from 'react';

export type ControlState = {
  cityLabel: string;
  stateLabel: string;
  zipCodeLabel: string;
  cityPlaceholder: string;
  zipCodePlaceholder: string;
  stateOptions: StateItem[];
  stateOrLocation: 'state' | 'location';
  lastCountryValue: string;
};

export type CountryItem = {
  id: string;
  title: string;
  value: string;
  states: StateItem[];
};

export type StateItem = {
  id: string;
  title: string;
  value: string;
};

type DatasourceResult = {
  id: string;
  title: {
    value: string;
  };
  value: {
    value: string;
  };
};

const query = /* GraphQL */ `
  query DatasourceQuery(
    $parentId: String!
    $titleName: String!
    $valueName: String!
    $pageSize: Int = 50
    $after: String
  ) {
    item(path: $parentId, language: "en") {
      children(first: $pageSize, after: $after) {
        total
        pageInfo {
          hasNext
          endCursor
        }
        results {
          id
          title: field(name: $titleName) {
            value
          }
          value: field(name: $valueName) {
            value
          }
        }
      }
    }
  }
`;

export async function getCountryStateOptions(
  parentId: string,
  titleName: string,
  valueName: string
): Promise<CountryItem[]> {
  const itemChildrenService = new ItemChildrenService<DatasourceResult>({ sitecoreClient });
  const results = await itemChildrenService.fetchAllResults(query, {
    parentId,
    titleName,
    valueName,
  });

  const countries = results.map(async (item) => {
    const results2 = await itemChildrenService.fetchAllResults(query, {
      parentId: item.id,
      titleName,
      valueName,
    });

    const states: StateItem[] = results2.map((stateItem) => ({
      id: stateItem.id,
      title: stateItem.title.value,
      value: stateItem.value.value,
    }));

    return {
      id: item.id,
      title: item.title.value,
      value: item.value.value,
      states: states,
    };
  });

  return await Promise.all(countries);
}

export async function getStateOptions(
  parentId: string,
  titleName: string,
  valueName: string
): Promise<StateItem[]> {
  const itemChildrenService = new ItemChildrenService<DatasourceResult>({ sitecoreClient });
  const results = await itemChildrenService.fetchAllResults(query, {
    parentId,
    titleName,
    valueName,
  });

  const states = results.map((item) => ({
    id: item.id,
    title: item.title.value,
    value: item.value.value,
  }));

  return states;
}

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
