'use client';

import config from 'aw.config.client';
import classNames from 'classnames';
import { Formik, FormikValues } from 'formik';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import AddressGroup from 'helpers/CustomForms/AddressGroup/AddressGroup';
import { CustomTextArea } from 'helpers/CustomForms/CustomTextArea';
import Dropdown from 'helpers/CustomForms/Dropdown';
import { FormFieldsTheme } from 'helpers/CustomForms/FormFields.Theme';
import { InputPhone } from 'helpers/CustomForms/InputPhone';
import { InputText } from 'helpers/CustomForms/InputText';
import NavigationButton from 'helpers/CustomForms/NavigationButton.Helper';
import RadioGroup from 'helpers/CustomForms/RadioGroup';
import DisclaimerText from 'helpers/DisclaimerText/DisclaimerText';
import { Eyebrow } from 'helpers/Eyebrow';
import Headline from 'helpers/Headline/Headline';
import { Subheadline } from 'helpers/Subheadline';
import { FormsConstants } from 'lib/constants/forms-constants';
import FIELD_IDS from 'lib/constants/salesforce-field-ids';
import { useTheme } from 'lib/context/ThemeContext';
import { getCookie } from 'lib/utils/client-storage-utils/get-cookie';
import { hashCode } from 'lib/utils/string-utils/hash-code';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import TagManager from 'react-gtm-module';
import * as Yup from 'yup';

import { Sitecore } from '.sitecore/AndersenWindows.model';
import { formActionFactory } from '.sitecore/aw-form-action-factory';

type ContactUsProps = Sitecore.Forms.Custom.ContactUs.ContactUs;

const zipValidationRegex: Record<string, string> = {
  USA: '^[0-9]{5}$',
  Canada: String.raw`^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z\d]{3} [a-zA-Z\d]{3}$|^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z\d]{6}$`,
  Mexico: '^[0-9]{5}$',
};

export function ContactUsClient(props: ContactUsProps) {
  const { themeData } = useTheme(FormFieldsTheme);
  const searchParams = useSearchParams();
  const [showThankYou, setShowThankYou] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(true);
  const getHiddenFieldValue = (): string => {
    const hiddenField = document.querySelector('input[name="website"]') as HTMLInputElement;
    return hiddenField?.value;
  };

  if (!props.fields) {
    return <></>;
  }

  const initialValues = {
    about: 'homeowner',
    trades: '',
    reasonForContact: '',
    company: '',
    first_name: '',
    last_name: '',
    title: '',
    address1: '',
    country: FormsConstants.Country.USA,
    city: '',
    state: '',
    location: '',
    zip: '',
    contact: '',
    email: '',
    mobile: '',
    message: '',
  };

  const validationSchema = {
    trades: Yup.string().when('about', ([about], schema) => {
      return about === 'professional' ? schema.required('This field is required') : schema;
    }),
    reasonForContact: Yup.string().trim().required('This field is required'),
    company: Yup.string().when('about', ([about], schema) => {
      return about === 'professional' ? schema.required('This field is required') : schema;
    }),
    first_name: Yup.string().trim().required('This field is required'),
    last_name: Yup.string().trim().required('This field is required'),
    address1: Yup.string().when('about', ([about], schema) => {
      return about === 'professional' ? schema.required('This field is required') : schema;
    }),
    city: Yup.string().when('about', ([about], schema) => {
      return about === 'professional' ? schema.required('This field is required') : schema;
    }),
    state: Yup.string().when('about', ([about], schema) => {
      return about === 'professional' ? schema.required('This field is required') : schema;
    }),
    zip: Yup.string().when('country', ([country], schema) => {
      if (country === 'Other') {
        return schema;
      } else {
        return schema
          .required('This field is required')
          .matches(new RegExp(zipValidationRegex[country]), 'Please enter a valid zip code.');
      }
    }),
    contact: Yup.string().trim().required('This field is required'),
    email: Yup.string()
      .required('This field is required')
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid address.'),

    mobile: Yup.string()
      .required('This field is required')
      .matches(
        /^(1\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
        'Please enter a valid mobile number.'
      ),

    message: Yup.string().trim().required('This field is required'),
  };

  const tradesOptions = [
    {
      label: 'Architect or Designer',
      value: 'Architect or Designer',
    },
    {
      label: 'Builder',
      value: 'Builder',
    },
    {
      label: 'Commercial Contractor',
      value: 'Commercial Contractor',
    },
    {
      label: 'Dealer or Distributor',
      value: 'Dealer or Distributor',
    },
    {
      label: 'Other',
      value: 'Other',
    },
    {
      label: 'Remodeler',
      value: 'Remodeler',
    },
    {
      label: 'Window/Door Replacer',
      value: 'Window/Door Replacer',
    },
  ];

  const reasonForContactOptions = [
    {
      label: 'Sales and Pre-Purchase Information',
      value: 'Sales and Pre-Purchase Information',
    },
    {
      label: 'Other',
      value: 'Other',
    },
  ];

  const aboutRadioOptions = [
    {
      id: 'contactUS_aboutHomeowner',
      value: 'homeowner',
      label: "I'm a homeowner",
    },
    {
      id: 'contactUS_aboutProfessional',
      value: 'professional',
      label: "I'm a trade professional",
    },
  ];

  const contactRadioOptions = [
    {
      id: 'contactUS_contactEmail',
      value: 'email',
      label: 'Email',
    },
    {
      id: 'contactUS_contactMobile',
      value: 'mobile',
      label: 'Mobile',
    },
  ];
  // Explanation: This is needed as we are uncertain about types of form values
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getFormData = (values: FormikValues): Record<string, any> => {
    const COOKIE_NAME = 'awSourceKey';
    const QUERYSTRING_NAME = 'sourceKey';
    const isHomeOwner = values['about'] === 'homeowner';
    const isDealer = !isHomeOwner && values['trades'] === 'Dealer or Distributor';
    const today = new Date();

    // Access the query parameter
    const queryParamValue = searchParams?.get(QUERYSTRING_NAME) ?? undefined;

    // Access the cookie value
    const cookieValue = getCookie(COOKIE_NAME);

    // Decide which value to store in your variable
    const ORIGINALSOURCE_VALUE = queryParamValue ?? cookieValue ?? '';

    //Access the utm_id cookie value
    const campaignId = getCookie('awCampaignId');
    const campaignIdValue = campaignId ?? props.fields?.campaignIds?.value;

    // conditional field Id
    let recordType;

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedValues: Record<string, any> = {};

    mappedValues[FIELD_IDS.RECORDTYPE] = recordType;
    mappedValues[FIELD_IDS.ORGID] = config.salesforce.salesCloud.orgIds.aw;
    mappedValues[FIELD_IDS.QUESTIONCOMMENT] = values['reasonForContact'] + ': ' + values['message'];
    mappedValues[FIELD_IDS.CAMPAIGNIDS] = campaignIdValue;
    mappedValues[FIELD_IDS.LEADSOURCE] = props.fields?.leadSource?.value;
    mappedValues[FIELD_IDS.FIRSTNAME] = values['first_name'];
    mappedValues[FIELD_IDS.LASTNAME] = values['last_name'];
    mappedValues[FIELD_IDS.TITLE] = values['title'];
    mappedValues[FIELD_IDS.COMPANYNAME] = values['company'];
    mappedValues[FIELD_IDS.EMAIL] = values['email'];
    mappedValues[FIELD_IDS.MOBILE] = values['mobile'];
    mappedValues[FIELD_IDS.ADDRESS1] = values['address1'];
    mappedValues[FIELD_IDS.CITY] = values['city'];
    mappedValues[FIELD_IDS.STATE] = values['state'];
    mappedValues[FIELD_IDS.ZIPCODE] = values['zip'];
    mappedValues[FIELD_IDS.COUNTRY] = country;
    mappedValues[FIELD_IDS.USERTYPE] = userType;
    mappedValues[FIELD_IDS.PROCESSSTATE] = 'New';
    mappedValues[FIELD_IDS.CONTACTME] = '0';
    mappedValues[FIELD_IDS.PREFERREDMETHOD] = values['contact'];
    mappedValues[FIELD_IDS.SMSOPTINID] = true; // keep smsOptIn for both
    mappedValues[FIELD_IDS.ORIGINALSOURCE] = ORIGINALSOURCE_VALUE;
    mappedValues[FIELD_IDS.INTERACTIONDATE] =
      ('0' + (today.getMonth() + 1)).slice(-2) +
      '/' +
      ('0' + today.getDate()).slice(-2) +
      '/' +
      today.getFullYear();
    mappedValues[FIELD_IDS.SESSIONDATA] =
      today + ' /// ' + today.getTime() + ' /// ' + navigator.userAgent;

    return mappedValues;
  };

  return (
    <section
      data-component="forms/contactus"
      id={props?.fields?.sectionId?.value ?? `id${hashCode(props.rendering.dataSource)}`}
    >
      {showThankYou ? (
        <>
          <Headline
            classes="text-theme-text text-sm-m md:text-m font-heavy mb-s"
            fields={{
              headlineText: props.fields?.thankYouHeading,
            }}
          />
          <BodyCopy
            classes="text-theme-body text-body text-black mb-s"
            fields={{ body: props.fields?.thankYouText }}
          />
        </>
      ) : (
        <>
          <Eyebrow {...props} classes="font-sans font-heavy text-sm-xxs mb-xxxs" />
          <Headline {...props} classes="text-theme-text text-sm-m md:text-m font-heavy mb-xxs" />

          <BodyCopy {...props} classes="text-theme-body text-body mb-s text-black" />

          <Formik
            initialValues={initialValues}
            validationSchema={Yup.object().shape(validationSchema)}
            onSubmit={async (values) => {
              setIsButtonEnabled(false);
              const actionHandler = formActionFactory(
                {
                  templateName: 'Salesforce Web To Lead',
                },
                getFormData(values)
              );

              if (getHiddenFieldValue() === '') {
                const result = await actionHandler?.executeAction(true);
                if (result?.success) {
                  TagManager.dataLayer({
                    dataLayer: {
                      event: 'contact_us_form',
                      form_name: 'Contact Us Request',
                      form_submit_text: 'Submit',
                      user_type: values['about'] === 'homeowner' ? 'Homeowner' : values['trades'],
                    },
                  });
                  setIsButtonEnabled(true);
                  setShowThankYou(true);
                }
              } else {
                // bot submission
                setIsButtonEnabled(true);
                setShowThankYou(true);
              }
            }}
          >
            {({ values, handleSubmit, isValid, submitCount }) => {
              const isInvalid = !isValid && submitCount > 0;
              return (
                <form noValidate className=" grid grid-cols-12 gap-s" onSubmit={handleSubmit}>
                  <div className="col-span-12 md:col-span-6">
                    <Subheadline
                      classes={classNames('text-s font-medium')}
                      fields={{ subheadlineText: { value: 'Tell us about you' } }}
                    />
                  </div>

                  {/* filler col */}
                  <div className="col-span-6 hidden md:block" />

                  {/* About You Radio Group */}
                  <div className="col-span-12 md:col-span-6">
                    <RadioGroup options={aboutRadioOptions} name="about" />
                  </div>

                  {/* filler col */}
                  <div className="col-span-6 hidden md:block" />

                  {/* Trades Dropdown - conditional */}
                  {values['about'] === 'professional' && (
                    <>
                      <div className="col-span-12 mb-s md:col-span-6">
                        <Dropdown
                          name="trades"
                          id="contactUs_trades"
                          options={tradesOptions}
                          required
                          aria-label="Select trade"
                          aria-required="true"
                        >
                          <option value="" selected disabled>
                            Select One
                          </option>
                        </Dropdown>
                      </div>

                      {/* filler col */}
                      <div className="col-span-6 hidden md:block" />
                    </>
                  )}

                  <div className="col-span-12 md:col-span-6">
                    <Subheadline
                      classes="inline-block text-s font-medium"
                      fields={{ subheadlineText: { value: 'Reason for contact' } }}
                    />

                    <span className="">{' *'}</span>
                  </div>
                  {/* filler col */}
                  <div className="col-span-6 hidden md:block" />

                  <div className="col-span-12 mb-s md:col-span-6">
                    {/* Reason for contact - dropdown */}
                    <Dropdown
                      name="reasonForContact"
                      id="contactUs_reasonForContact"
                      options={reasonForContactOptions}
                      aria-label="Reason for contact"
                      required={true}
                      aria-required="true"
                    >
                      <option value="" selected disabled>
                        Select One
                      </option>
                    </Dropdown>
                  </div>

                  {/* filler col */}
                  <div className="col-span-6 hidden md:block" />

                  <div className="col-span-12">
                    <Subheadline
                      classes="text-s font-medium"
                      fields={{ subheadlineText: { value: 'Contact information' } }}
                    />
                  </div>

                  {/* Company */}
                  {values['about'] === 'professional' && (
                    <>
                      <div className="col-span-12 md:col-span-6">
                        <InputText
                          id="contactUs_company"
                          name="company"
                          type="text"
                          label="Company"
                          placeholder="Company"
                          required
                          aria-required="true"
                          maxLength={100}
                        />
                      </div>

                      {/* filler col */}
                      <div className="col-span-6 hidden md:block" />
                    </>
                  )}

                  {/* first name */}
                  <div className="col-span-12  md:col-span-6">
                    <InputText
                      id="contactUs_first_name"
                      name="first_name"
                      type="text"
                      label="First name"
                      placeholder="First name"
                      required
                      maxLength={25}
                      aria-required="true"
                    />
                  </div>

                  {/* last name */}
                  <div className="col-span-12 md:col-span-6">
                    <InputText
                      id="contactUs_last_name"
                      name="last_name"
                      type="text"
                      label="Last name"
                      placeholder="Last name"
                      required
                      maxLength={25}
                      aria-required="true"
                    />
                  </div>

                  {/* title */}
                  {values['about'] === 'professional' && (
                    <>
                      <div className="col-span-12 md:col-span-6">
                        <InputText
                          id="contactUs_title"
                          name="title"
                          type="text"
                          label="Title"
                          placeholder="Title"
                          maxLength={25}
                        />
                      </div>

                      {/* filler col */}
                      <div className="col-span-6 hidden md:block" />
                    </>
                  )}

                  <AddressGroup
                    address1={{
                      id: 'contactUs_address1',
                      name: 'address1',
                      label: 'Address',
                      placeholder: 'Address',
                      classes: 'md:col-span-6',
                      required: values['about'] === 'professional',
                    }}
                    country={{
                      id: 'contactUs_country',
                      name: 'country',
                      label: 'Country',
                      classes: 'md:col-span-6',
                      required: values['about'] === 'professional',
                    }}
                    city={{
                      id: 'contactUs_city',
                      name: 'city',
                      label:
                        values['country'] === FormsConstants.Country.Canada
                          ? 'Municipality'
                          : 'City',
                      placeholder:
                        values['country'] === FormsConstants.Country.Canada
                          ? 'Municipality'
                          : 'City',
                      classes: 'md:col-span-6',
                      required: values['about'] === 'professional',
                    }}
                    state={{
                      id: 'contactUs_state',
                      name: 'state',
                      label:
                        values['country'] === FormsConstants.Country.Canada ? 'Province' : 'State',
                      classes: 'md:col-span-3',
                      required: values['about'] === 'professional',
                    }}
                    location={{
                      id: 'contactUs_location',
                      name: 'location',
                      label: 'Location',
                      placeholder: 'Location',
                      classes: 'md:col-span-3',
                      required: values['about'] === 'professional',
                    }}
                    zipCode={{
                      id: 'contactUs_zipCode',
                      name: 'zip',
                      label:
                        values['country'] === FormsConstants.Country.Canada
                          ? 'Postal Code'
                          : 'Zip Code',
                      placeholder:
                        values['country'] === FormsConstants.Country.Canada
                          ? 'Postal Code'
                          : 'Zip Code',
                      classes: 'md:col-span-3',
                      required: values['about'] === 'professional',
                    }}
                  />

                  {/* contact method */}
                  <div className="col-span-12">
                    <Subheadline
                      classes="inline-block text-s font-medium"
                      fields={{ subheadlineText: { value: 'Preferred contact method' } }}
                    />

                    <span className="">{' *'}</span>
                  </div>
                  <div className="col-span-12">
                    <RadioGroup options={contactRadioOptions} name="contact" />
                  </div>

                  {/* Email */}
                  <div className="col-span-12 md:col-span-6">
                    <InputText
                      id="contactUs_email"
                      name="email"
                      type="email"
                      label="Email"
                      placeholder="Email"
                      maxLength={50}
                      subLabel={props?.fields?.privacyPolicyText?.value}
                      required
                      aria-required
                    />
                  </div>

                  <div className="col-span-12 md:col-span-6">
                    <InputPhone
                      id="contactUs_mobile"
                      name="mobile"
                      label="Mobile"
                      placeholder="Phone"
                      required
                      aria-required
                    />
                  </div>

                  <div className="col-span-12 md:col-span-6">
                    <CustomTextArea
                      placeholder="Message"
                      rows={5}
                      name="message"
                      maxLength={450}
                      required
                      aria-required
                      id="contactUs_message"
                      label="Message"
                    />
                  </div>
                  <div className="h-0 overflow-hidden p-0" aria-hidden="true">
                    <InputText
                      label="Do not fill out this field."
                      placeholder={'Do not fill out this field.'}
                      name="website"
                    />
                  </div>
                  <div className="col-span-12 p-0 pb-3 ">
                    <DisclaimerText
                      fields={props.fields?.disclaimerText}
                      disclaimerClasses={themeData.classes.disclaimerText}
                    />
                  </div>

                  <div className="col-span-12">
                    <NavigationButton
                      className="mx-auto md:mx-0"
                      type="submit"
                      name="submit"
                      disabled={!isButtonEnabled}
                    >
                      Submit
                    </NavigationButton>
                    {(!isButtonEnabled || isInvalid) && (
                      <span
                        className={
                          isInvalid
                            ? classNames(
                                themeData.classes.errorMessage,
                                themeData.classes.errorTextColor,
                                'mx-auto w-fit md:mx-0'
                              )
                            : classNames('my-xxs block w-fit font-serif text-body text-dark-gray')
                        }
                      >
                        {isButtonEnabled
                          ? 'Please fill out all required fields.'
                          : 'Processing... please wait'}
                      </span>
                    )}
                  </div>
                </form>
              );
            }}
          </Formik>
        </>
      )}
    </section>
  );
}
