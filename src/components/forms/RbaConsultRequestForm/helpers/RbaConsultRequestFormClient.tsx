'use client';

import classNames from 'classnames';
import { Field, FieldProps, Form, Formik } from 'formik';
import { RichTextWrapper } from 'helpers/RichTextWrapper';
import { useTheme } from 'lib/context/ThemeContext';
import { useAsPath } from 'lib/hooks/use-as-path';
import { useState } from 'react';
import TagManager from 'react-gtm-module';
import { MaskedInput } from 'react-text-mask-modern';
import * as Yup from 'yup';

import { RbaConsultRequestFormTheme } from './RbaConsultRequestForm.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type RbaConsultRequestFormProps = Sitecore.Forms.Custom.RbaConsultRequestForm.RbaConsultRequestForm;

export function RbaConsultRequestFormClient(props: RbaConsultRequestFormProps) {
  const { themeData } = useTheme(RbaConsultRequestFormTheme);
  const [showSubmitError, setShowSubmitError] = useState(false);
  const [responseOk, setResponseOk] = useState(false);
  const asPath = useAsPath();
  if (!props.fields) {
    return <></>;
  }

  // Check if disclaimer text for Canada is provided.
  // If it is, then the form will require users to check a box to acknowledge the disclaimer before submitting the form.
  const isDisclaimerForCanada = props.fields?.disclaimerTextCanada?.value.trim() !== '';

  interface FormModel {
    firstName: string;
    lastName: string;
    zipCode: string;
    email: string;
    phoneNumber: string;
    contactType: string;
    rbaSource: string;
    rbaBreakdown: string;
    rbaSender: string;
    canadaDisclaimer: boolean;
  }

  const formInitialValues: FormModel = {
    firstName: '',
    lastName: '',
    zipCode: '',
    email: '',
    phoneNumber: '',
    contactType: 'in-home',
    rbaSource: props.fields?.rbaSource?.value,
    rbaBreakdown: props.fields?.rbaBreakdown?.value,
    rbaSender: 'AW.com',
    canadaDisclaimer: false,
  };

  const validationSchemaUS = Yup.object().shape({
    email: Yup.string()
      .email('Please enter a valid email address')
      .required('This field is required'),
    firstName: Yup.string().required('This field is required'),
    lastName: Yup.string().required('This field is required'),
    zipCode: Yup.string()
      .required('This field is required.')
      .matches(/^\d+$/, 'Please enter a valid zip code.')
      .min(5, 'Please enter a valid zip code.')
      .max(5, 'Please enter a valid zip code.'),
    phoneNumber: Yup.string()
      .required('This field is required.')
      .matches(/^(\(\d{3}\) \d{3}-\d{4})$/gm, 'Please enter a valid phone number.'),
  });
  const validationSchemaCanada = Yup.object().shape({
    email: Yup.string()
      .email('Please enter a valid email address')
      .required('This field is required'),
    firstName: Yup.string().required('This field is required'),
    lastName: Yup.string().required('This field is required'),
    zipCode: Yup.string()
      .required('This field is required.')
      .matches(
        /^[a-zA-Z]\d[a-zA-Z] \d[a-zA-Z]\d$|^[a-zA-Z]\d[a-zA-Z]\d[a-zA-Z]\d$/,
        'Please enter a valid postal code.'
      ),
    phoneNumber: Yup.string()
      .required('This field is required.')
      .matches(/^(\(\d{3}\) \d{3}-\d{4})$/gm, 'Please enter a valid phone number.'),
    canadaDisclaimer: Yup.bool().oneOf([true], 'This field is required.'),
  });

  const getValidationSchema = () => {
    return isDisclaimerForCanada ? validationSchemaCanada : validationSchemaUS;
  };

  const urlSearchParams = new URLSearchParams(asPath?.split('?')[1]);
  let queryStringStoreId = '';
  urlSearchParams.forEach((value, key) => {
    if (key.toLowerCase() === 'storeid') {
      queryStringStoreId = value.toString();
    }
  });
  const validationSchema = getValidationSchema();
  return (
    <section data-component="forms/rbaconsultrequestform">
      {responseOk ? (
        <div className="col-span-12 mt-20 md:col-span-10 md:col-start-2">
          <div className="items-top mb-s text-center font-sans text-sm-m font-heavy text-theme-text md:text-m [&_a:hover]:underline">
            <h2>{props.fields?.thankYouHeading?.value}</h2>
          </div>
          <div className="mb-s text-center text-body text-theme-body text-black">
            <div className="body-copy">{props.fields?.thankYouText?.value}</div>
          </div>
        </div>
      ) : (
        <>
          <Formik<FormModel>
            initialValues={formInitialValues}
            validationSchema={validationSchema}
            validateOnChange={false}
            validateOnBlur={true}
            onSubmit={async (values, { setSubmitting }) => {
              const submitFormURL = '/api/aw/rba-consult-request/send-rba-consult-request';
              // in-home is currently the only option available
              const formTypeValue = '2';
              const formJson = {
                FirstName: values.firstName,
                LastName: values.lastName,
                EmailAddress: values.email,
                PhoneNumber: values.phoneNumber,
                Zip: values.zipCode,
                ConsultationType: values.contactType,
                FormType: formTypeValue,
                RbASource: values.rbaSource,
                RbABreakdown: values.rbaBreakdown,
                Sender: values.rbaSender,
              };
              try {
                const response = await fetch(submitFormURL, {
                  method: 'POST',
                  body: JSON.stringify(formJson),
                });
                if (response.ok) {
                  setSubmitting(false);
                  setShowSubmitError(false);
                  setResponseOk(true);
                  // If form submission is successful then push data to GTM
                  TagManager.dataLayer({
                    dataLayer: {
                      event: 'rba_request_quote_form',
                      form_name: 'Rba Consult Request Form',
                      form_submit_text: 'Request a Consultation',
                      request_type: values.contactType,
                      store_location: values.zipCode,
                      store_number: queryStringStoreId,
                    },
                  });
                } else {
                  console.error('Error:', response.statusText);
                  setSubmitting(false);
                  setShowSubmitError(true);
                }
              } catch (error) {
                console.error('Error occurred:', error);
                setSubmitting(false);
                setShowSubmitError(true);
              }
            }}
          >
            {(formikProps) => {
              const { values, touched, errors, isSubmitting } = formikProps;
              return (
                <Form className="mt-2 w-full">
                  <Field type="hidden" name="rbaSource" value={values.rbaSource}></Field>
                  <Field type="hidden" name="rbaBreakdown" value={values.rbaBreakdown}></Field>
                  <Field type="hidden" name="rbaSender" value={values.rbaSender}></Field>

                  <div className={themeData.classes.formRow}>
                    <div className={themeData.classes.formColumnThree}>
                      <label className={themeData.classes.formLabel} htmlFor="firstName">
                        First Name <span className={themeData.classes.requiredIndicator}> *</span>
                      </label>
                      <div className="md:mr-4">
                        <Field
                          name="firstName"
                          type="text"
                          placeholder="Enter First Name"
                          value={values.firstName}
                          className={classNames(
                            themeData.classes.textInput,
                            errors.firstName && touched.firstName
                              ? themeData.classes.textInputError
                              : ''
                          )}
                        ></Field>
                        {errors.firstName && touched.firstName && (
                          <div className={themeData.classes.inputFeedback}>{errors.firstName}</div>
                        )}
                      </div>
                    </div>
                    <div className={themeData.classes.formColumnThree}>
                      <label className={themeData.classes.formLabel} htmlFor="lastName">
                        Last Name <span className={themeData.classes.requiredIndicator}> *</span>
                      </label>
                      <div className="md:mr-4">
                        <Field
                          name="lastName"
                          type="text"
                          placeholder="Enter Last Name"
                          value={values.lastName}
                          className={classNames(
                            themeData.classes.textInput,
                            errors.lastName && touched.lastName
                              ? themeData.classes.textInputError
                              : ''
                          )}
                        ></Field>
                        {errors.lastName && touched.lastName && (
                          <div className={themeData.classes.inputFeedback}>{errors.lastName}</div>
                        )}
                      </div>
                    </div>
                    <div className={themeData.classes.formColumnThree}>
                      <label className={themeData.classes.formLabel} htmlFor="zipCode">
                        {isDisclaimerForCanada ? 'Postal Code' : 'Zip Code'}{' '}
                        <span className={themeData.classes.requiredIndicator}> *</span>
                      </label>
                      <div className="">
                        <Field
                          name="zipCode"
                          type="text"
                          placeholder={isDisclaimerForCanada ? 'Postal code' : 'Zip code'}
                          value={values.zipCode}
                          className={classNames(
                            themeData.classes.textInput,
                            errors.zipCode && touched.zipCode
                              ? themeData.classes.textInputError
                              : ''
                          )}
                        ></Field>
                        {errors.zipCode && touched.zipCode && (
                          <div className={themeData.classes.inputFeedback}>{errors.zipCode}</div>
                        )}
                      </div>
                    </div>
                    <div className={themeData.classes.formColumnTwo}>
                      <label className={themeData.classes.formLabel} htmlFor="email">
                        Email Address{' '}
                        <span className={themeData.classes.requiredIndicator}> *</span>
                      </label>
                      <div className="md:mr-4">
                        <Field
                          name="email"
                          type="text"
                          placeholder="Enter Valid Email Address"
                          value={values.email}
                          className={classNames(
                            themeData.classes.textInput,
                            errors.email && touched.email ? themeData.classes.textInputError : ''
                          )}
                        ></Field>
                        {errors.email && touched.email && (
                          <div className={themeData.classes.inputFeedback}>{errors.email}</div>
                        )}
                      </div>
                    </div>
                    <div className={themeData.classes.formColumnTwo}>
                      <label className={themeData.classes.formLabel} htmlFor="phoneNumber">
                        Phone Number <span className={themeData.classes.requiredIndicator}> *</span>
                      </label>
                      <div className="">
                        <Field name="phoneNumber">
                          {({ field }: FieldProps) => (
                            <MaskedInput
                              {...field}
                              mask={[
                                '(',
                                /[1-9]/,
                                /\d/,
                                /\d/,
                                ')',
                                ' ',
                                /\d/,
                                /\d/,
                                /\d/,
                                '-',
                                /\d/,
                                /\d/,
                                /\d/,
                                /\d/,
                              ]}
                              placeholder="(XXX) XXX-XXXX"
                              type="tel"
                              value={values.phoneNumber}
                              className={classNames(
                                themeData.classes.textInput,
                                errors.phoneNumber && touched.phoneNumber
                                  ? themeData.classes.textInputError
                                  : ''
                              )}
                            />
                          )}
                        </Field>
                        {errors.phoneNumber && touched.phoneNumber && (
                          <div className={themeData.classes.inputFeedback}>
                            {errors.phoneNumber}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      {isDisclaimerForCanada && (
                        <div className="relative">
                          <label htmlFor="canadaDisclaimer" className="inline-flex">
                            <Field
                              type="checkbox"
                              id="canadaDisclaimer"
                              name="canadaDisclaimer"
                              checked={values.canadaDisclaimer}
                              className={classNames(
                                'input customTickIcon invalidInput peer h-[20px] w-[20px] cursor-pointer appearance-none border border-dark-gray checked:bg-black! hover:border-black focus:bg-gray focus:ring-0!',
                                errors.canadaDisclaimer && touched.canadaDisclaimer
                                  ? themeData.classes.textInputError
                                  : ''
                              )}
                            />
                            <div>
                              {errors.canadaDisclaimer && touched.canadaDisclaimer && (
                                <div className={themeData.classes.inputFeedback}>
                                  {errors.canadaDisclaimer}
                                </div>
                              )}
                            </div>
                            <RichTextWrapper
                              field={{
                                value: props.fields?.disclaimerTextCanada?.value,
                              }}
                              classes={
                                'ml-2 text-dark-gray font-light font-serif leading-[18px] text-small cursor-pointer'
                              }
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center p-[5px]">
                    <button
                      type="submit"
                      className={themeData.classes.submitButton}
                      disabled={isSubmitting}
                    >
                      Request a Consultation
                    </button>
                  </div>
                  {showSubmitError && (
                    <div className="flex justify-center p-[5px]">
                      <span className={themeData.classes.formErrorMessage}>
                        {props.fields?.errorOnPageMessage?.value}
                      </span>
                    </div>
                  )}
                </Form>
              );
            }}
          </Formik>
          <RichTextWrapper
            field={{ value: props.fields?.disclaimerText?.value }}
            classes={themeData.classes.disclaimer}
          />
        </>
      )}
    </section>
  );
}
