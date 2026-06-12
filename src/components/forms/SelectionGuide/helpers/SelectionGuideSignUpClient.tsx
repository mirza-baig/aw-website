'use client';

import config from 'aw.config.client';
import classNames from 'classnames';
import { Formik, FormikValues } from 'formik';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import Dropdown from 'helpers/CustomForms/Dropdown';
import { FormFieldsTheme } from 'helpers/CustomForms/FormFields.Theme';
import { InputText } from 'helpers/CustomForms/InputText';
import NavigationButton from 'helpers/CustomForms/NavigationButton.Helper';
import DisclaimerText from 'helpers/DisclaimerText/DisclaimerText';
import { Eyebrow } from 'helpers/Eyebrow';
import Headline from 'helpers/Headline/Headline';
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

type SelectionGuideSignUpProps =
  Sitecore.Forms.Custom.SelectionGuideSignUpForm.SelectionGuideSignUpForm;

export function SelectionGuideSignUpClient(props: SelectionGuideSignUpProps) {
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

  const validationSchema = {
    first_name: Yup.string().trim().required('This field is required'),
    last_name: Yup.string().trim().required('This field is required'),

    email: Yup.string()
      .required('This field is required')
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid address.'),
    zip: Yup.string()
      .required('This field is required')
      .matches(/^\d{5}$/, 'Please enter a valid zip code.'),
  };

  const tradesOptions = props?.fields?.iWorkAs?.map(
    (item: { fields: { Value: { value: unknown } }; displayName: unknown }) => ({
      value: item.fields.Value.value,
      label: item.displayName,
    })
  );
  //Access the utm_id cookie value
  const campaignId = getCookie('awCampaignId');
  const campaignIdValue = campaignId ?? props.fields?.campaignIds?.value;

  // Explanation: This is needed as we are uncertain about types of form values
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getFormData = (values: FormikValues): Record<string, any> => {
    const COOKIE_NAME = 'awSourceKey';
    const QUERYSTRING_NAME = 'sourceKey';
    const isHomeOwner = values['userType'] === 'Homeowner';
    const isDealer = !isHomeOwner && values['trades'] === 'Dealer or Distributor';
    const today = new Date();

    // Access the query parameter
    const queryParamValue = searchParams?.get(QUERYSTRING_NAME) ?? undefined;
    // Access the cookie value
    const cookieValue = getCookie(COOKIE_NAME);

    // Decide which value to store in your variable
    const ORIGINALSOURCE_VALUE = queryParamValue ?? cookieValue ?? '';

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedValues: Record<string, any> = {};

    mappedValues[FIELD_IDS.RECORDTYPE] = recordType;
    mappedValues[FIELD_IDS.ORGID] = config.salesforce.salesCloud.orgIds.aw;
    mappedValues[FIELD_IDS.CAMPAIGNIDS] = campaignIdValue;
    mappedValues[FIELD_IDS.LEADSOURCE] = props.fields?.leadSource?.value;
    mappedValues[FIELD_IDS.FIRSTNAME] = values['first_name'];
    mappedValues[FIELD_IDS.LASTNAME] = values['last_name'];
    mappedValues[FIELD_IDS.EMAIL] = values['email'];
    mappedValues[FIELD_IDS.ZIPCODE] = values['zip'];
    mappedValues[FIELD_IDS.USERTYPE] = userType;
    mappedValues[FIELD_IDS.PROCESSSTATE] = 'New';
    mappedValues[FIELD_IDS.SMSOPTINID] = '1';
    mappedValues[FIELD_IDS.PROJECTTYPE] = values['projectType'];
    mappedValues[FIELD_IDS.ORIGINALSOURCE] = ORIGINALSOURCE_VALUE;
    mappedValues[FIELD_IDS.SELECTEDUSERTYPE] = userType;
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
  const initialValues = {
    userType: '',
    projectType: '',
    trades: '',
    first_name: '',
    last_name: '',
    zip: '',
    email: '',
  };
  const userTypes = [
    {
      id: 'Homeowner',
      label: 'Homeowner',
      value: 'Homeowner',
    },
    {
      id: 'TradeProfessional',
      label: 'Trade Professional',
      value: 'Trade Professional',
    },
  ];
  const homeOwnerOptions = props?.fields?.myProjectAs?.map(
    (item: { fields: { Value: { value: unknown } }; displayName: unknown }) => ({
      value: item.fields.Value.value,
      label: item.displayName,
    })
  );
  return (
    <section
      data-component="forms/selectionGuideSignUp"
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
          <Headline
            {...props}
            classes="text-theme-text text-sm-m md:text-m font-heavy mb-xxs text-center"
          />
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
                      event: 'selection_guide_signUp_form',
                      form_name: 'Selection Guide SignUp',
                      form_submit_text: 'Submit',
                      user_type:
                        values['userType'] === 'Homeowner' ? 'Homeowner' : values['trades'],
                    },
                  });
                  setIsButtonEnabled(true);
                  setShowThankYou(true);
                }
              } else {
                setShowThankYou(true);
              }
            }}
          >
            {({ values, handleSubmit, isValid, submitCount }) => {
              const isInvalid = !isValid && submitCount > 0;
              console.log('Usertpe', values['userType']);
              return (
                <form noValidate className=" grid grid-cols-12 gap-s" onSubmit={handleSubmit}>
                  <div className="col-span-12">
                    <label
                      className="flex w-full items-center text-body font-regular"
                      htmlFor="userType"
                    >
                      I am a..
                    </label>
                    {/* Drop down for type of user */}
                    <Dropdown
                      name="userType"
                      id="userType"
                      options={userTypes}
                      aria-label="I am a.."
                      aria-required="true"
                    >
                      <option value="" selected disabled>
                        Select One
                      </option>
                    </Dropdown>
                  </div>

                  {/* user type values conditional trade professional */}
                  {values['userType'] === 'Trade Professional' && (
                    <div className="col-span-12">
                      <label
                        className="flex w-full items-center text-body font-regular"
                        htmlFor="trades"
                      >
                        I work as a ...
                      </label>
                      <Dropdown
                        name="trades"
                        id="trades"
                        options={tradesOptions}
                        aria-label="Select trade"
                        aria-required="true"
                      >
                        <option value="" selected disabled>
                          Select One
                        </option>
                      </Dropdown>
                    </div>
                  )}
                  {/* user type values conditional Homeowner */}
                  {values['userType'] === 'Homeowner' && (
                    <div className="col-span-12">
                      <label
                        className="flex w-full items-center text-body font-regular"
                        htmlFor="projectType"
                      >
                        My project is a ...
                      </label>
                      <Dropdown
                        name="projectType"
                        id="projectType"
                        options={homeOwnerOptions}
                        aria-label="Select project"
                        aria-required="true"
                      >
                        <option value="" selected disabled>
                          Select One
                        </option>
                      </Dropdown>
                    </div>
                  )}

                  {/* first name */}
                  <div className="col-span-12  md:col-span-6">
                    <InputText
                      id="first_name"
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
                      id="last_name"
                      name="last_name"
                      type="text"
                      label="Last name"
                      placeholder="Last name"
                      required
                      maxLength={25}
                      aria-required="true"
                    />
                  </div>

                  {/* Email */}
                  <div className="col-span-12 md:col-span-6">
                    <InputText
                      id="email"
                      name="email"
                      type="email"
                      label="Email"
                      placeholder="Email"
                      maxLength={50}
                      required
                      aria-required
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <InputText
                      id="zip"
                      name="zip"
                      type="zip"
                      label="Zip code"
                      placeholder="Zip code"
                      required
                      aria-required
                    />
                  </div>
                  <div className=" h-0  overflow-hidden p-0  " aria-hidden="true">
                    <InputText
                      label="Do not fill out this field."
                      placeholder={'Do not fill out this field.'}
                      name="website"
                    />
                  </div>
                  <div className="col-span-12">
                    <BodyCopy
                      fields={{ body: props?.fields?.privacyPolicyText }}
                      classes={themeData.classes.disclaimerText}
                    />
                  </div>
                  <DisclaimerText
                    fields={props.fields?.disclaimerText}
                    disclaimerClasses={themeData.classes.disclaimerText}
                  />

                  <div className="col-span-12 mb-s">
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
