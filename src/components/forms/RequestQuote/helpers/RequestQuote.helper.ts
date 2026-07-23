import config from 'aw.config.client';
import { FormikValues } from 'formik';
import { FormsConstants } from 'lib/constants/forms-constants';
import FIELD_IDS from 'lib/constants/salesforce-field-ids';
import { FormFieldProps } from 'lib/custom-forms/FormFieldProps';
import * as Yup from 'yup';

const simpleStringFields = [
  'about',
  'project_type',
  'first_name',
  'last_name',
  'reasonForContact',
  'address1',
  'city',
  'state',
  'product_usage',
  'projects_per_year',
  'project_name_location',
  'project_timing',
  'number_of_employees',
  'supplier',
  'trades',
  'company',
];

const zipValidationRegex: Record<string, string> = {
  USA: '^[0-9]{5}$',
  Canada:
    '^(?=.*\\d)(?=.*[a-zA-Z])[a-zA-Z\\d]{3} [a-zA-Z\\d]{3}$|^(?=.*\\d)(?=.*[a-zA-Z])[a-zA-Z\\d]{6}$',
  Mexico: '^[0-9]{5}$',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSimpleFieldsValues = (value: any) => {
  return simpleStringFields.reduce(
    // @ts-ignore field is just the key of simpleStringFields. We can ignore this type-error
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (acc, field: any): Record<string, unknown> => ((acc[field] = value), acc),
    {}
  );
};

export const requestQuoteInitialValues = {
  email: '',
  mobile_number: '',
  zip: '',
  title: '',
  additional_details: '',
  country: FormsConstants.Country.USA,
  estimated_windows: '',
  estimated_doors: '',
  preferred_product_series: '',
  ...getSimpleFieldsValues(''),
};

export const requestQuoteValidationSchema = {
  ...getSimpleFieldsValues(Yup.string().required('This field is required')),
  email: Yup.string()
    .transform((value) => (value ? value.trim() : value))
    .required('This field is required')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid address.'),

  mobile_number: Yup.string()
    .required('This field is required')
    .matches(/^(1\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, 'Please enter a valid mobile number.'),
  title: Yup.string(),
  additional_details: Yup.string(),
  estimated_windows: Yup.string(),
  estimated_doors: Yup.string(),
  preferred_product_series: Yup.string(),
  address1: Yup.string().when('about', ([about], schema) => {
    return about === 'professional' ? schema.required('This field is required') : schema;
  }),
  city: Yup.string().required('This field is required'),
  state: Yup.string().required('This field is required'),
  zip: Yup.string().when('country', ([country], schema) => {
    if (country !== FormsConstants.Country.Other) {
      return schema
        .required('This field is required')
        .matches(new RegExp(zipValidationRegex[country]), 'Please enter a valid zip code.');
    } else {
      return schema;
    }
  }),
  supplier_name: Yup.string().when('supplier', ([supplier], schema) => {
    if (supplier === 'Yes') {
      return schema.required('This field is required');
    } else {
      return schema;
    }
  }),
};

const personalInformation = [
  {
    label: 'First name',
    placeholder: 'Enter First Name',
    name: 'first_name',
    id: 'requestQuote-first-name',
    type: 'text',
    columnClasses: 'md:col-span-10 md:col-start-2',
    isRequired: true,
    maxLength: 25,
  },
  {
    label: 'Last name',
    placeholder: 'Enter Last Name',
    name: 'last_name',
    id: 'requestQuote-last-name',
    type: 'text',
    columnClasses: 'md:col-span-10 md:col-start-2',
    isRequired: true,
    maxLength: 25,
  },
  {
    label: 'Email address',
    placeholder: 'Enter Valid Email Address',
    name: 'email',
    id: 'requestQuote-email',
    type: 'email',
    columnClasses: 'md:col-span-10 md:col-start-2',
    isRequired: true,
    maxLength: 50,
  },
];

export const requestQuoteFlow = {
  userTypes: [
    {
      value: 'homeowner',
      title: "I'm a homeowner",
    },
    {
      value: 'professional',
      title: "I'm a trade professional",
    },
  ],
  homeowner: {
    projectInformation: [
      {
        value: 'Windows or door replacement only',
      },
      {
        value: 'New Construction',
      },
      {
        value: 'Remodeling',
      },
      /** AWEB-171: Removing service option commenting to add in the future.
      {
        value: 'Service',
        title: 'Service or repair',
        subtitle: 'I need to fix a window or door',
      },
      */
    ],
    businessInformation: [
      ...personalInformation,
      {
        label: 'Mobile number',
        placeholder: 'Mobile Number',
        name: 'mobile_number',
        id: 'requestQuote-mobile-number',
        type: 'tel',
        columnClasses: 'col-span-6 md:col-span-5 md:col-start-2!',
      },
      // adding a hidden country field for validation purposes
      {
        label: '',
        placeholder: '',
        name: 'country',
        id: 'requestQuote-country',
        type: 'hidden',
        columnClasses: 'hidden',
        value: FormsConstants.Country.USA,
      },
    ],
  },
  professional: {
    projectInformation: [
      ...personalInformation,
      {
        id: 'requestQuote-project-type',
        name: 'project_type',
        options: [
          { label: 'New Construction', value: 'New Construction' },
          { label: 'Remodeling', value: 'Remodeling' },
          { label: 'Windows or door replacement only', value: 'Windows or door replacement only' },
        ],
        label: 'Project Type',
        isRequired: 'true',
        columnClasses: 'md:col-span-10 md:col-start-2',
      },
      {
        id: 'requestQuote-estimated-windows',
        name: 'estimated_windows',
        options: [
          { label: '1-2', value: '1-2' },
          { label: '3-5', value: '3-5' },
          { label: '6-8', value: '6-8' },
          { label: '9-11', value: '9-11' },
          { label: '12+', value: '12+' },
        ],
        label: '# of Windows',
        columnClasses: 'md:col-span-5 md:col-start-2!',
      },
      {
        id: 'requestQuote-estimated-doors',
        name: 'estimated_doors',
        options: [
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3' },
          { label: '4+', value: '4+' },
        ],
        label: '# of Doors',
        columnClasses: 'md:col-span-5',
      },
    ],
    businessInformation: [
      {
        id: 'requestQuote-trades',
        name: 'trades',
        options: [
          { label: 'Architect or Designer', value: 'Architect or Designer' },
          { label: 'Builder', value: 'Builder' },
          { label: 'Commercial Contractor', value: 'Commercial Contractor' },
          { label: 'Other', value: 'Other' },
          { label: 'Remodeler', value: 'Remodeler' },
          { label: 'Window/Door Replacer', value: 'Window/Door Replacer' },
        ],
        label: 'Type of Business',
        isRequired: 'true',
        columnClasses: 'col-span-12 md:col-span-10 md:col-start-2',
      },
      {
        id: 'requestQuote-company',
        name: 'company',
        label: 'Business Name',
        placeholder: 'Enter Business Name',
        type: 'text',
        columnClasses: 'col-span-12 md:col-span-10 md:col-start-2',
        isRequired: true,
        maxLength: 100,
      },
      {
        id: 'requestQuote-supplier',
        name: 'supplier',
        options: [
          { label: 'Yes', value: 'Yes' },
          { label: 'No', value: 'No' },
        ],
        label: 'Do you have a supplier you currently purchase from?',
        isRequired: 'true',
        columnClasses: 'md:col-span-10 md:col-start-2',
      },
      {
        id: 'requestQuote-supplier-name',
        name: 'supplier_name',
        label: 'Please tell us the name of the supplier you currently purchase from.',
        placeholder: 'Supplier Name',
        type: 'text',
        columnClasses: 'md:col-span-10 md:col-start-2',
        isRequired: true,
        maxLength: 255,
      },
      {
        id: 'requestQuote-project-timing',
        name: 'project_timing',
        options: [
          { label: 'Immediately', value: 'Immediately' },
          { label: 'Within the next 3 months', value: 'Within the next 3 months' },
          { label: '3 - 6 months', value: '3 - 6 months' },
          { label: '6 - 12 months', value: '6 - 12 months' },
          { label: 'Future Project', value: 'Future Project' },
          { label: 'General Interest', value: 'General Interest' },
        ],
        label: 'Project Timing',
        columnClasses: 'md:col-span-10 md:col-start-2',
      },
      {
        label: 'Mobile number',
        placeholder: 'Mobile Number',
        name: 'mobile_number',
        id: 'requestQuote-mobile-number',
        type: 'tel',
        columnClasses: 'col-span-12 md:col-span-10 md:col-start-2!',
        isRequired: true,
      },
    ],
  },
};

type FlowFields = {
  [pageIndex: number]: string[]; // allows fieldsToValidatePerPage[flow][number]
};

export const fieldsToValidatePerPage: Record<'homeowner' | 'professional', FlowFields> = {
  homeowner: {
    0: ['about'],
    1: ['project_type'],
    2: ['first_name', 'last_name', 'email', 'mobile_number', 'zip', 'city', 'state'],
  },
  professional: {
    0: ['about'],
    1: ['first_name', 'last_name', 'email', 'project_type'],
    2: [
      'trades',
      'company',
      'supplier',
      'supplier_name',
      'mobile_number',
      'address1',
      'zip',
      'country',
      'state',
      'city',
    ],
  },
};

export const requestQuoteSteps: Array<Pick<FormFieldProps, 'fields'>> = [
  {
    fields: {
      label: {
        value: 'Step 1',
      },
      hideStepper: {
        value: false,
      },
      includeInSteps: {
        value: true,
      },
    },
  },
  {
    fields: {
      label: {
        value: 'Step 2',
      },
      hideStepper: {
        value: false,
      },
      includeInSteps: {
        value: true,
      },
    },
  },
  {
    fields: {
      label: {
        value: 'Step 3',
      },
      hideStepper: {
        value: false,
      },
      includeInSteps: {
        value: true,
      },
    },
  },
];

export const getRequestQuotePayload = (
  values: FormikValues,
  campaignIds: string | undefined,
  leadsource: string | undefined,
  originalSourceValue: unknown,
  _injectedFields: { DESIGNSPECS: string; DESIGNTOOLSERIES: string }
) => {
  const isHomeOwner = values['about'] === 'homeowner';
  const isDealer = !isHomeOwner && values['trades'] === 'Dealer or Distributor';
  const today = new Date();

  // conditional field Id
  let recordType: string;

  if (isHomeOwner) {
    recordType = FIELD_IDS.HOMEOWNER;
  } else if (isDealer) {
    recordType = FIELD_IDS.DEALER;
  } else {
    recordType = FIELD_IDS.TRADEPROFESSIONAL;
  }

  // conditional values
  const userType = isHomeOwner ? 'Homeowner' : values['trades'];

  let country = values['country'];

  if (values['country'] === 'Other') {
    country = values['location'];
    values['state'] = '';
  }

  const mappedValues: Record<string, unknown> = {};

  //#region Contact Details
  mappedValues[FIELD_IDS.FIRSTNAME] = values['first_name'];
  mappedValues[FIELD_IDS.LASTNAME] = values['last_name'];
  mappedValues[FIELD_IDS.EMAIL] = values['email'];
  mappedValues[FIELD_IDS.MOBILE] = values['mobile_number'];
  mappedValues[FIELD_IDS.ADDRESS1] = !isHomeOwner ? values['address1'] : 'Address';
  mappedValues[FIELD_IDS.CITY] = values['city'];
  mappedValues[FIELD_IDS.STATE] = values['state'];
  mappedValues[FIELD_IDS.ZIPCODE] = values['zip'];
  mappedValues[FIELD_IDS.COUNTRY] = country;
  mappedValues[FIELD_IDS.SMSOPTINID] = true;
  //#endregion

  //#region Project Details
  mappedValues[FIELD_IDS.TITLE] = values['title'];
  mappedValues[FIELD_IDS.HOWOFTENUSEAW] = values['product_usage'];
  mappedValues[FIELD_IDS.PROJECTSPERYEAR] = values['projects_per_year'];
  mappedValues[FIELD_IDS.PROJECTNAMEANDLOCATION] = values['project_name_location'];
  mappedValues[FIELD_IDS.PROJECTTYPE] = values['project_type'];
  mappedValues[FIELD_IDS.PROJECTTIMING] = values['project_timing'];
  mappedValues[FIELD_IDS.NUMBEROFEMPLOYEES] = values['number_of_employees'];
  mappedValues[FIELD_IDS.ESTIMATEDWINDOWS] = values['estimated_windows'];
  mappedValues[FIELD_IDS.ESTIMATEDDOORS] = values['estimated_doors'];
  mappedValues[FIELD_IDS.PREFERREDPRODUCTSERIES] = values['preferred_product_series'];
  mappedValues[FIELD_IDS.WORKINGWITHDEALER] = values['supplier'];
  mappedValues[FIELD_IDS.DEALERNAME] = values['supplier_name'] ?? '';
  mappedValues[FIELD_IDS.QUESTIONCOMMENT] = `Request a Quote: ${values['additional_details']}`;
  //#endregion

  //#region Misc Details
  mappedValues[FIELD_IDS.COMPANYNAME] = values['company'];
  mappedValues[FIELD_IDS.RECORDTYPE] = recordType;
  mappedValues[FIELD_IDS.ORGID] = config.salesforce.salesCloud.orgIds.aw;
  mappedValues[FIELD_IDS.CAMPAIGNIDS] = campaignIds;
  mappedValues[FIELD_IDS.LEADSOURCE] = leadsource;
  mappedValues[FIELD_IDS.USERTYPE] = userType;
  mappedValues[FIELD_IDS.INTERACTIONDATE] =
    ('0' + (today.getMonth() + 1)).slice(-2) +
    '/' +
    ('0' + today.getDate()).slice(-2) +
    '/' +
    today.getFullYear();
  mappedValues[FIELD_IDS.SESSIONDATA] =
    today + ' /// ' + today.getTime() + ' /// ' + navigator.userAgent;

  //#region Static Values
  mappedValues[FIELD_IDS.ORIGINALSOURCE] = originalSourceValue;
  mappedValues[FIELD_IDS.DESIGNSPECS] = _injectedFields?.DESIGNSPECS ?? '';
  mappedValues[FIELD_IDS.DESIGNTOOLSERIES] = _injectedFields?.DESIGNTOOLSERIES ?? '';
  mappedValues[FIELD_IDS.VISITSHOWROOM] = 0;
  mappedValues[FIELD_IDS.INSTALLATIONSERVICES] = 0;
  mappedValues[FIELD_IDS.FINANCING] = 0;
  mappedValues[FIELD_IDS.PROCESSSTATE] = 'New';
  //#endregion

  return mappedValues;
};
