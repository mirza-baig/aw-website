import { FormsConstants } from 'lib/constants/forms-constants';
import { debounceFunction } from 'lib/utils/debounce-utils';
import * as Yup from 'yup';

export const warrantyRegistrationInitialValues = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address1: '',
  city: '',
  state: '',
  zip: '',
  country: FormsConstants.Country.USA,
  warranty_products: [
    {
      producttype: '',
      productseries: '',
      quantity: '',
      serialnumber: '',
      installationdate: '',
      productid: '',
    },
  ],
};

const zipValidationRegex: Record<string, string> = {
  USA: '^[0-9]{5}$',
  Canada:
    '^(?=.*\\d)(?=.*[a-zA-Z])[a-zA-Z\\d]{3} [a-zA-Z\\d]{3}$|^(?=.*\\d)(?=.*[a-zA-Z])[a-zA-Z\\d]{6}$',
  Mexico: '^[0-9]{5}$',
};

export const warrantyRegistrationValidationSchema = {
  first_name: Yup.string().required('This field is required'),
  last_name: Yup.string().required('This field is required'),
  email: Yup.string()
    .required('This field is required')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid address.'),
  phone: Yup.string()
    .required('This field is required')
    .matches(/^(1\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, 'Please enter a valid mobile number.'),
  address1: Yup.string().required('This field is required'),
  city: Yup.string().required('This field is required'),
  state: Yup.string().required('This field is required'),
  zip: Yup.string().when('country', ([country], schema) => {
    if (country !== 'Other') {
      return schema
        .required('This field is required')
        .matches(new RegExp(zipValidationRegex[country]), 'Please enter a valid zip code.');
    } else {
      return schema;
    }
  }),
  warranty_products: Yup.array()
    .of(
      Yup.object().shape({
        producttype: Yup.string().required('Yoo! This field is required'),
        productseries: Yup.string().when('producttype', ([productType], schema) => {
          if (productType !== 'Storm Doors') {
            return schema.required('This field is required');
          } else {
            return schema;
          }
        }),
        quantity: Yup.string().when('producttype', ([productType], schema) => {
          if (productType !== 'Storm Doors') {
            return schema.required('This field is required');
          } else {
            return schema;
          }
        }),
        serialnumber: Yup.string().when('producttype', ([productType], schema) => {
          if (productType === 'Storm Doors') {
            return schema
              .required('This field is required')
              .matches(/^\d+$/, 'Serial number must contain digits only')
              .test(
                'serialnumber',
                'The serial number you entered was not found.',
                (value, { createError, path }) => {
                  // Skip API call if value is empty or non-numeric
                  if (!value || !/^\d+$/.test(value)) {
                    return true;
                  }

                  return new Promise((resolve) => {
                    debouncedValidateSerialNumber(
                      value,
                      () => resolve(true),
                      () =>
                        resolve(
                          createError({
                            path,
                            message: 'The serial number you entered was not found.',
                          })
                        )
                    );
                  });
                }
              );
          } else {
            return schema;
          }
        }),
        installationdate: Yup.string().required('This field is required'),
      })
    )
    .min(1)
    .max(50),
};

const debouncedValidateSerialNumber = debounceFunction(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (value: string, onSuccess: any, onError: any) => {
    try {
      const isValid = await validateStormDoorSerialNumber(value);
      return isValid ? onSuccess() : onError();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      onError();
    }
  },
  500
);

const validateStormDoorSerialNumber = async (value: string): Promise<boolean> => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      serialNumber: value,
    }),
  };
  const response = await fetch('/api/aw/validate-stormdoor-serialnumber', requestOptions);

  const data = await response.json();

  return data?.error_message === 'Success';
};

export const windowsTypes = [
  {
    label: 'Awning',
    value: 'Awning',
  },
  {
    label: 'Awning Push-Out',
    value: 'Awning Push-Out',
  },
  { label: 'Bay or Bow', value: 'Bay or Bow' },
  { label: 'Casement', value: 'Casement' },
  { label: 'Casement, French', value: 'Casement French' },
  { label: 'Casement, Push-Out', value: 'Casement Push-Out' },
  { label: 'Double-Hung', value: 'Double-Hung' },
  { label: 'Gliding', value: 'Gliding' },
  { label: 'Picture', value: 'Picture' },
  { label: 'Single-Hung', value: 'Single-Hung' },
  { label: 'Specialty Shapes', value: 'Specialty Shapes' },
];

export const doorsTypes = [
  { label: 'Big Doors', value: 'Big Doors' },
  { label: 'Entry Doors', value: 'Entry Doors' },
  { label: 'Hinged Patio Doors', value: 'Hinged Patio Doors' },
  { label: 'Gliding Patio Doors', value: 'Gliding Patio Doors' },
  { label: 'Storm Doors', value: 'Storm Doors' },
];

export const productSeriesMappings = {
  Awning: {
    options: [
      {
        label: '100 Series',
        value: '100 Series',
        displayName: '100 Series',
        productId: '100-AWN',
      },
      {
        label: '400 Series',
        value: '400 Series',
        displayName: '400 Series',
        productId: '400-AWN',
      },
      {
        label: 'A-Series',
        value: 'A-Series',
        displayName: 'A-Series',
        productId: 'AS-AWN',
      },
      {
        label: 'E-Series',
        value: 'E-Series',
        displayName: 'E-Series',
        productId: 'ES-AWN',
      },
    ],
  },
  'Awning Push-Out': {
    options: [
      {
        label: 'E-Series',
        value: 'E-Series',
        displayName: 'E-Series',
        productId: 'ES-POAWN',
      },
    ],
  },
  'Bay or Bow': {
    options: [
      {
        label: '400 Series',
        value: '400 Series',
        displayName: '400 Series',
        productId: '400-BAY',
      },
      {
        label: 'E-Series',
        value: 'E-Series',
        displayName: 'E-Series',
        productId: 'ES-BAY',
      },
    ],
  },
  Casement: {
    options: [
      {
        label: '100 Series',
        value: '100 Series',
        displayName: '100 Series',
        productId: '100-CAS',
      },
      {
        label: '400-Series',
        value: '400-Series',
        displayName: '400-Series',
        productId: '400-CAS',
      },
      {
        label: 'A-Series',
        value: 'A-Series',
        displayName: 'A-Series',
        productId: 'AS-CAS',
      },
      {
        label: 'E-Series',
        value: 'E-Series',
        displayName: 'E-Series',
        productId: 'ES-CAS',
      },
    ],
  },
  'Casement French': {
    options: [
      {
        label: 'E Series',
        value: 'E Series',
        displayName: 'E Series',
        productId: 'ES-CAS',
      },
    ],
  },
  'Casement Push-Out': {
    options: [
      {
        label: 'E Series',
        value: 'E Series',
        displayName: 'E Series',
        productId: 'ES-POCAS',
      },
    ],
  },
  'Double-Hung': {
    options: [
      {
        label: '100 Series',
        value: '100 Series',
        displayName: '100 Series',
        productId: '100-DH',
      },
      {
        label: '200 Series',
        value: '200 Series',
        displayName: '200 Series',
        productId: '200-DH',
      },
      {
        label: '400-Series',
        value: '400-Series',
        displayName: '400-Series',
        productId: '400-TWDH',
      },
      {
        label: '400 Series Woodwright®',
        value: '400 Series Woodwright',
        displayName: '400 Series Woodwright®',
        productId: '400-WWDH',
      },
      {
        label: 'A-Series',
        value: 'A-Series',
        displayName: 'A-Series',
        productId: 'AS-DH',
      },
      {
        label: 'E-Series',
        value: 'E-Series',
        displayName: 'E-Series',
        productId: 'ES-DH',
      },
    ],
  },
  Gliding: {
    options: [
      {
        label: '100 Series',
        value: '100 Series',
        displayName: '100 Series',
        productId: '100-GW',
      },
      {
        label: '200-Series',
        value: '200-Series',
        displayName: '200-Series',
        productId: '200-GW',
      },
      {
        label: '400-Series',
        value: '400-Series',
        displayName: '400-Series',
        productId: '400-GW',
      },
      {
        label: 'E-Series',
        value: 'E-Series',
        displayName: 'E-Series',
        productId: 'ES-GW',
      },
    ],
  },
  Picture: {
    options: [
      {
        label: '100 Series',
        value: '100 Series',
        displayName: '100 Series',
        productId: '100-PIC',
      },
      {
        label: '200-Series',
        value: '200-Series',
        displayName: '200-Series',
        productId: '200-PW',
      },
      {
        label: '400-Series',
        value: '400-Series',
        displayName: '400-Series',
        productId: '400-PW',
      },
      {
        label: 'A-Series',
        value: 'A-Series',
        displayName: 'A-Series',
        productId: 'AS-PW',
      },
      {
        label: 'E-Series',
        value: 'E-Series',
        displayName: 'E-Series',
        productId: 'ES-PIC',
      },
    ],
  },
  'Single-Hung': {
    options: [
      {
        label: '100 Series',
        value: '100 Series',
        displayName: '100 Series',
        productId: '100-SH',
      },
    ],
  },
  'Specialty Shapes': {
    options: [
      {
        label: '100 Series',
        value: '100 Series',
        displayName: '100 Series',
        productId: '100-SS',
      },
      {
        label: '400-Series',
        value: '400-Series',
        displayName: '400-Series',
        productId: '400-SS',
      },
      {
        label: 'A-Series',
        value: 'A-Series',
        displayName: 'A-Series',
        productId: 'AS-SS',
      },
      {
        label: 'E-Series',
        value: 'E-Series',
        displayName: 'E-Series',
        productId: 'ES-SS',
      },
    ],
  },
  'Big Doors': {
    options: [
      {
        label: 'Architectural Collection MultiGlide™',
        value: 'Architectural Collection MultiGlide',
        displayName: 'Architectural Collection MultiGlide™',
        productId: 'BD-MG',
      },
      {
        label: 'Architectural Collection Folding Outswing Door',
        value: 'Architectural Collection Folding Outswing Door',
        displayName: 'Architectural Collection Folding Outswing Door',
        productId: 'BD-FO',
      },
    ],
  },
  'Gliding Patio Doors': {
    options: [
      {
        label: '100 Series',
        value: '100 Series',
        displayName: '100 Series',
        productId: '100-GPD',
      },
      {
        label: '200 Series Narroline®',
        value: '200 Series Narroline',
        displayName: '200 Series Narroline®',
        productId: '200-NLGPD',
      },
      {
        label: '200 Series Perma-Shield®',
        value: '200 Series Perma-Shield',
        displayName: '200 Series Perma-Shield®',
        productId: '200-PSGPD',
      },
      {
        label: '400 Series Frenchwood®',
        value: '400 Series Frenchwood',
        displayName: '400 Series Frenchwood®',
        productId: '400-GPD',
      },
      {
        label: 'A-Series',
        value: 'A-Series',
        displayName: 'A-Series',
        productId: 'AS-GPD',
      },
      {
        label: 'E-Series',
        value: 'E-Series',
        displayName: 'E-Series',
        productId: 'ES-GPD',
      },
    ],
  },
  'Entry Doors': {
    options: [
      {
        label: 'Residential Entry Door',
        value: 'Residential Entry Door',
        displayName: 'Residential Entry Door',
        productId: 'ED-RES',
      },
    ],
  },
  'Hinged Patio Doors': {
    options: [
      {
        label: '200-Series',
        value: '200-Series',
        displayName: '200-Series',
        productId: '200-HPD',
      },
      {
        label: '400-Series',
        value: '400-Series',
        displayName: '400-Series',
        productId: '400-HPD',
      },
      {
        label: 'A-Series',
        value: 'A-Series',
        displayName: 'A-Series',
        productId: 'AS-HPD',
      },
      {
        label: 'E-Series',
        value: 'E-Series',
        displayName: 'E-Series',
        productId: 'ES-HPD',
      },
    ],
  },
};
