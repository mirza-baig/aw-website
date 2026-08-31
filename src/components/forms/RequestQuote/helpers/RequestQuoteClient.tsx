'use client';

import { event, identity } from '@sitecore-content-sdk/events';
import classNames from 'classnames';
import { Formik, FormikHelpers, FormikTouched, FormikValues } from 'formik';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import Button from 'helpers/Button/Button';
import AddressGroup from 'helpers/CustomForms/AddressGroup/AddressGroup';
import { CustomTextArea } from 'helpers/CustomForms/CustomTextArea';
import CustomTileButton from 'helpers/CustomForms/CustomTileButton';
import Dropdown from 'helpers/CustomForms/Dropdown';
import { FormFieldsTheme } from 'helpers/CustomForms/FormFields.Theme';
import { InputPhone } from 'helpers/CustomForms/InputPhone';
import { InputText } from 'helpers/CustomForms/InputText';
import NavigationButton from 'helpers/CustomForms/NavigationButton.Helper';
import ZippopotamusZipCode from 'helpers/CustomForms/ZippopotamusZIPCode';
import DisclaimerText from 'helpers/DisclaimerText/DisclaimerText';
import Headline from 'helpers/Headline/Headline';
import ModalWrapper from 'helpers/ModalWrapper/ModalWrapper';
import { FormsConstants } from 'lib/constants/forms-constants';
import { StringConstants } from 'lib/constants/string-constants';
import { useTheme } from 'lib/context/ThemeContext';
import { FormsContext } from 'lib/custom-forms/FormContext';
import { getCookie } from 'lib/utils/client-storage-utils/get-cookie';
import { clearSessionStorageItems, setSessionStorageItems } from 'lib/utils/session-storage';
import { useSearchParams } from 'next/navigation';
import { JSX, useEffect, useRef, useState } from 'react';
import TagManager from 'react-gtm-module';
import { twMerge } from 'tailwind-merge';
import * as Yup from 'yup';

import { AbandonReason, buildRaqAbandonExtensionData } from './buildRaqAbandonPayload';
import { fireAbandonEvent } from './FireAbandonEvent.helper';
import { fireSubmitEvent } from './FireSubmitEvent.helper';
import {
  fieldsToValidatePerPage,
  getRequestQuotePayload,
  requestQuoteFlow,
  requestQuoteInitialValues,
  requestQuoteSteps,
  requestQuoteValidationSchema,
} from './RequestQuote.helper';
import Steps from './Steps';
import { Sitecore } from '.sitecore/AndersenWindows.model';
import { formActionFactory } from '.sitecore/aw-form-action-factory';

type RequestQuoteClientProps = {
  fields: Sitecore.Forms.Custom.RequestAQuote.RequestAQuote['fields'];
  cardsPlaceholders?: Record<string, React.ReactNode>;
  params?: Record<string, string>;
};

type UserType = 'homeowner' | 'professional';

// Session keys
const RAQ_SESSION_KEYS = [
  StringConstants.AW.RequestQuote.ActiveJourneyKey,
  StringConstants.AW.RequestQuote.AbandonPayloadKey,
  StringConstants.AW.RequestQuote.StartTimeKey,
  StringConstants.AW.RequestQuote.SubmittedKey,
  StringConstants.AW.RequestQuote.AbandonEventTriggered,
  StringConstants.AW.RequestQuote.FromExperienceKey,
  StringConstants.AW.RequestQuote.ExperienceIdKey,
];

export function RequestQuoteClient(props: Readonly<RequestQuoteClientProps>): JSX.Element {
  const keysIcons = [
    'replacementIcon',
    'newBuildIcon',
    'remodelOrAdditionIcon',
    'serviceOrRepairIcon',
  ];
  //Used for inactivity timer
  const parsedAbandonMinutes = Number(props.fields?.cdpInactivityMinutes?.value);
  const abandonTimeoutMinutes =
    Number.isFinite(parsedAbandonMinutes) && parsedAbandonMinutes > 0 ? parsedAbandonMinutes : 15;
  const abandonTimeoutMs = abandonTimeoutMinutes * 60 * 1000;
  const abandonTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abandonTrackingStartedRef = useRef(false);
  const hasSubmittedRef = useRef(false);
  const hasAbandonedRef = useRef(false);
  // Tracks WHY an abandon fired ('timeout' vs 'navigation') so the payload can
  // include elapsedMinutes.
  const abandonReasonRef = useRef<AbandonReason>(null);
  const latestFormValuesRef = useRef<FormikValues>(requestQuoteInitialValues);
  const latestPageIndexRef = useRef(0);

  const icons = keysIcons.map((key) => props?.fields[key]).filter(Boolean);
  const homeownerProjectInformation = requestQuoteFlow.homeowner.projectInformation.map(
    (projectType) => {
      switch (projectType.value) {
        case 'Windows or door replacement only':
          return {
            ...projectType,
            title: props.fields?.replacementTitle?.value ?? '',
            subtitle: props.fields?.replacementSubtitle?.value ?? '',
          };

        case 'New Construction':
          return {
            ...projectType,
            title: props.fields?.newBuildTitle?.value ?? '',
            subtitle: props.fields?.newBuildSubtitle?.value ?? '',
          };

        case 'Remodeling':
          return {
            ...projectType,
            title: props.fields?.remodelTitle?.value ?? '',
            subtitle: props.fields?.remodelSubtitle?.value ?? '',
          };

        default:
          return {
            ...projectType,
            title: '',
            subtitle: '',
          };
      }
    }
  );
  const getHiddenFieldValue = (): string => {
    const hiddenField = document.querySelector('input[name="website"]') as HTMLInputElement;
    return hiddenField?.value;
  };
  const [pageIndex, setPageIndex] = useState(0);
  const [currentFlow, setCurrentFlow] = useState<UserType>('homeowner');
  const [formValues, setFormValues] = useState<FormikValues>();
  const [showFormError, setShowFormError] = useState<false | string>(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(true);
  const [cardVariants, setCardVariants] = useState<Record<string, unknown>[]>([]);
  const [typeVariant, setTypeVariant] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [hasModalBeenShown, setHasModalBeenShown] = useState(false);
  const lastIdentifiedEmailRef = useRef<string>('');

  const searchParams = useSearchParams();
  const { themeData } = useTheme(FormFieldsTheme);

  const supplierValue = formValues?.['supplier'];
  const rawTimer = props?.fields?.countdownDuration;
  const timer = rawTimer?.value ? Number(rawTimer.value) * 1000 : 0; // Extract `value`

  const resetTimer = () => {
    if (!isModalOpen && !hasModalBeenShown) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (!Number.isNaN(timer) && timer > 0) {
        timeoutRef.current = setTimeout(() => {
          setIsModalOpen(true);
        }, timer);
      } else {
        console.warn('Invalid timer duration:', rawTimer);
      }
    }
  };

  // Begin - Abandon Timer helper functions
  const clearAbandonTimer = () => {
    if (abandonTimeoutRef.current) {
      clearTimeout(abandonTimeoutRef.current);
      abandonTimeoutRef.current = null;
    }
  };

  // current abandon payload into sessionStorage and mark RAQ as
  // the active journey.
  // on the next route mount and fires an abandon event if the user
  // SPA-navigated away from RAQ without submitting.
  const updateRaqAbandonSession = (values: FormikValues, currentPageIndex: number) => {
    if (globalThis.window === undefined) {
      return;
    }

    // Once the form has been submitted. We don't want to fire the abandon event.
    if (hasSubmittedRef.current) {
      return;
    }

    const extensionData = buildRaqAbandonExtensionData({
      values,
      inactivityMinutes: abandonTimeoutMinutes,
      pageIndex: currentPageIndex,
      reason: 'navigation',
    });

    setSessionStorageItems({
      [StringConstants.AW.RequestQuote.ActiveJourneyKey]: JSON.stringify({
        journey: StringConstants.AW.RequestQuote.JourneyName,
        prevPath: globalThis.location.pathname,
        eventType: StringConstants.AW.RequestQuote.AbandonEventType,
        payloadKey: StringConstants.AW.RequestQuote.AbandonPayloadKey,
      }),
      [StringConstants.AW.RequestQuote.AbandonPayloadKey]: JSON.stringify(extensionData),
    });
    // A fresh snapshot means beforeunload has NOT fired for this journey yet.
    clearSessionStorageItems([StringConstants.AW.RequestQuote.AbandonEventTriggered]);
  };

  const clearRaqAbandonSession = () => {
    if (globalThis.window === undefined) {
      return;
    }
    clearSessionStorageItems(RAQ_SESSION_KEYS);
  };

  const fireAbandonIfNeeded = () => {
    if (!abandonTrackingStartedRef.current || hasSubmittedRef.current || hasAbandonedRef.current) {
      return;
    }

    hasAbandonedRef.current = true;

    fireAbandonEvent({
      values: latestFormValuesRef.current,
      inactivityMinutes: abandonTimeoutMinutes,
      pageIndex: latestPageIndexRef.current,
      reason: abandonReasonRef.current,
    });
  };

  const startAbandonTimer = () => {
    if (!abandonTrackingStartedRef.current || hasSubmittedRef.current) {
      return;
    }

    clearAbandonTimer();

    abandonTimeoutRef.current = setTimeout(() => {
      abandonReasonRef.current = 'timeout';
      fireAbandonIfNeeded();
    }, abandonTimeoutMs);
  };

  const beginAbandonTracking = () => {
    if (abandonTrackingStartedRef.current || hasSubmittedRef.current) {
      return;
    }

    abandonTrackingStartedRef.current = true;
    hasAbandonedRef.current = false;
    startAbandonTimer();
  };

  const handleFormInteraction = () => {
    if (!abandonTrackingStartedRef.current || hasSubmittedRef.current) {
      return;
    }

    // User became active again — allow a future abandon event.
    hasAbandonedRef.current = false;

    startAbandonTimer();

    updateRaqAbandonSession(latestFormValuesRef.current, latestPageIndexRef.current);
  };

  const handleSubmitSuccess = () => {
    hasSubmittedRef.current = true;
    setSessionStorageItems({ [StringConstants.AW.RequestQuote.SubmittedKey]: 'true' });
    clearAbandonTimer();
    clearRaqAbandonSession();
  };
  // End - Abandon Timer helper functions

  // Fire abandon on hard nav / tab close and mark the flag
  useEffect(() => {
    const handleBeforeUnload = () => {
      abandonReasonRef.current = 'navigation';
      fireAbandonIfNeeded();
      setSessionStorageItems({
        [StringConstants.AW.RequestQuote.AbandonEventTriggered]: 'true',
      });
    };

    globalThis.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      globalThis.removeEventListener('beforeunload', handleBeforeUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abandonTimeoutMinutes]);

  // Keep latest step in a ref for the inactivity timer + beforeunload paths.
  useEffect(() => {
    latestPageIndexRef.current = pageIndex;
  }, [pageIndex]);

  // Refresh the sessionStorage snapshot whenever the step index changes.
  useEffect(() => {
    if (!abandonTrackingStartedRef.current || hasSubmittedRef.current) {
      return;
    }
    updateRaqAbandonSession(latestFormValuesRef.current, pageIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      clearAbandonTimer();
    };
  }, []);

  useEffect(() => {
    if (currentFlow === 'homeowner' && pageIndex === 2) {
      const events = ['mousemove', 'keydown', 'click', 'scroll'];

      const reset = () => {
        resetTimer();
      };

      events.forEach((event) => globalThis.addEventListener(event, reset));
      resetTimer();

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        events.forEach((event) => globalThis.removeEventListener(event, reset));
      };
    } else {
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, currentFlow, pageIndex, timer]);

  useEffect(() => {
    if (formValues && formValues?.['supplier'] === 'No') {
      formValues['supplier_name'] = '';
    }
    // We can ignore the react-hooks/exhaustive-deps warning to avoid adding formValues as dependency.
    // This useEffect is expected to be only dependent on supplierValue out of whole formValues object
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplierValue]);

  const pushFormInteraction = (step: number | 'final', formName = 'request_quote') => {
    TagManager.dataLayer({
      dataLayer: {
        event: 'form_interaction',
        form_name: formName,
        form_step_number: step,
      },
    });
  };
  const isDesignToolRAQ = props?.params?.IsDesignToolRAQ === 'true';
  // Send GTM Step 1 on page load
  useEffect(() => {
    if (isDesignToolRAQ) {
      return;
    }
    pushFormInteraction(1);
  }, [isDesignToolRAQ]);
  // To handle the step 1 from Design Tool RAQ and PDT RAQ
  useEffect(() => {
    if (!isDesignToolRAQ) {
      return;
    }

    const handleRAQOpened = () => {
      pushFormInteraction(1);
    };

    globalThis.addEventListener('aw-raq-opened', handleRAQOpened);

    return () => {
      globalThis.removeEventListener('aw-raq-opened', handleRAQOpened);
    };
  }, [isDesignToolRAQ]);
  if (!props.fields) {
    return <></>;
  }

  const updatePageIndex = (navigationStep: 1 | -1) => {
    handleFormInteraction();
    setPageIndex((prevPageIndex) => prevPageIndex + navigationStep);
  };

  const buttonAlignment: Record<'left' | 'right' | 'center', string> = {
    left: 'mr-auto',
    right: 'ml-auto',
    center: 'mx-auto',
  };

  //Access the utm_id cookie value
  const campaignId = getCookie('awCampaignId');
  const campaignIdValue = campaignId ?? props.fields?.campaignIds?.value;

  const setCardDetails = (cardVariants: Record<string, unknown>[], typeVariant: string) => {
    setCardVariants(cardVariants);
    setTypeVariant(typeVariant);
  };
  const trackProfessionalStepThree = (values: FormikValues, currentPageIndex: number) => {
    const isProfessionalStepOne = values['about'] === 'professional' && currentPageIndex === 1;

    if (isProfessionalStepOne) {
      pushFormInteraction(3);
    }
  };
  const handleNextButtonClick = async (
    values: FormikValues,
    touched: FormikTouched<FormikValues>,
    setTouched: (touched: FormikTouched<FormikValues>, shouldValidate?: boolean) => void,
    validateForm: FormikHelpers<FormikValues>['validateForm']
  ) => {
    const updateTouchedState = (): Record<string, unknown> => {
      // @ts-ignore we can ignore typescript error "Element implicitly has an 'any' type because expression of type 'any' can't be used to index type"
      const touchedState = fieldsToValidatePerPage[values['about']][pageIndex]?.reduce(
        (acc: Record<string, boolean>, field: string) => {
          acc[field] = true;
          return acc;
        },
        {}
      );

      const _touched = { ...touched, ...touchedState };

      setTouched(_touched, true);
      return _touched;
    };
    updateTouchedState();

    if (values?.project_type === 'New Construction') {
      setCardDetails(props?.fields?.newConstruction, 'newConstruction');
    } else if (values?.project_type === 'Windows or door replacement only') {
      setCardDetails(props?.fields?.replacement, 'windowsOrDoorReplacement');
    } else if (values?.project_type === 'Remodeling') {
      setCardDetails(props?.fields?.remodeling, 'remodeling');
    }

    globalThis.scrollTo({ top: 0, behavior: 'smooth' });

    const errorFieldsObject = await validateForm();

    if (Object.keys(errorFieldsObject).length === 0) {
      trackProfessionalStepThree(values, pageIndex);

      if (pageIndex === 2) {
        fireIdentify(values);
        setIsButtonEnabled(false);
        setShowFormError('Processing... please wait');
        if (getHiddenFieldValue() === '') {
          const COOKIE_NAME = 'awSourceKey';
          const QUERYSTRING_NAME = 'sourceKey';

          // Access the query parameter (App Router way)
          const queryParamValue = searchParams?.get(QUERYSTRING_NAME) ?? undefined;

          // Access the cookie value
          const cookieValue = getCookie(COOKIE_NAME);

          // Decide which value to store in your variable
          const originalSourceValue = queryParamValue ?? cookieValue ?? '';

          // Fire submit event
          fireSubmitEvent(values);

          // If its last page submit the form
          const actionHandler = formActionFactory(
            {
              templateName: 'Salesforce Web To Lead',
            },
            getRequestQuotePayload(
              values,
              campaignIdValue,
              props.fields?.leadSource.value,
              originalSourceValue,
              props.fields?._injectedFields
            )
          );
          const result = await actionHandler?.executeAction(true);
          // If form submission is successful then push data to GTM
          TagManager.dataLayer({
            dataLayer: {
              event: 'request_quote_form',
              form_name: 'Request Quote',
              form_submit_text: 'Request a quote',
              user_type: values['about'] === 'homeowner' ? 'Homeowner' : values['trades'],
              project_type: values['project_type'],
            },
          });
          // Send GTM Step 4/ final when user submits the form
          pushFormInteraction('final');

          if (!result?.success) {
            setIsButtonEnabled(true);
            setShowFormError('Something went wrong');
            handleFormInteraction();
            return;
          }
          handleSubmitSuccess();
        }
      }
      // Fire CDP step-complete event for step 1 and 2 transitions
      if (pageIndex === 1 || pageIndex === 2) {
        fireStepComplete(values);
      }
      updatePageIndex(1);
    } else {
      setShowFormError('Please fill out all required fields.');
    }
  };

  const handleCloseModal = () => {
    setHasModalBeenShown(true); // mark modal as shown
    setIsModalOpen(false);
  };

  const renderModal = () => {
    return (
      <ModalWrapper
        size="fluid"
        handleClose={handleCloseModal}
        isModalOpen={isModalOpen}
        customOverlayclass="bg-black bg-opacity-50"
        customContentWrapperclass="md:w-[93vw] lg:w-[50vw] w-[93vw]"
      >
        <div className="flex flex-col items-center pb-4 pt-0">
          <div className="flex flex-col items-center">
            <Headline
              fields={{ headlineText: props.fields?.blackHeadline }}
              classes="col-span-12 text-center text-theme-text text-sm-m md:text-m font-heavy"
            />
            <Headline
              fields={{ headlineText: props.fields?.orangeHeadline }}
              classes="col-span-12 text-center text-theme-text text-sm-m md:text-m font-heavy lg:-mt-2 mb-xxs text-orange-500"
            />
            <div className="w-[70%]">
              <BodyCopy
                classes="col-span-12 text-center mb-4"
                fields={{ body: props.fields?.bodyCopy }}
              />
            </div>
          </div>
          <Button
            variant={props.fields?.ctaButton}
            field={{
              value: {
                text: props.fields?.ctaText?.value,
                anchor: props?.fields?.ctaButton?.value?.anchor,
                class: props?.fields?.ctaButton?.value?.class,
                href: props?.fields?.ctaButton?.value?.href,
                id: props?.fields?.ctaButton?.value?.id,
                linktype: props?.fields?.ctaButton?.value?.linktype,
                target: props?.fields?.ctaButton?.value?.target,
                title: props?.fields?.ctaButton?.value?.title,
              },
            }}
            icon={props.fields?.ctaIcon}
            classes=" md:w-fit! justify-center w-[200px] p-2.5 opacity-100"
          />
        </div>
      </ModalWrapper>
    );
  };

  const renderHomeOwnerFlow = (values: FormikValues) => {
    switch (pageIndex) {
      case 1:
        return (
          <>
            <div className="col-span-10 hidden text-center md:col-start-2 md:block">
              <p className="font-sans text-sm-xxs font-heavy">CHOOSE A PROJECT TYPE</p>
            </div>
            {homeownerProjectInformation.map((projectType, index, arr) => {
              const isLastSingleTile = arr.length % 2 === 1 && index === arr.length - 1;
              return (
                <div
                  key={projectType.value}
                  className={classNames(
                    'col-span-12 md:col-span-6',
                    isLastSingleTile && 'md:col-start-4'
                  )}
                >
                  <CustomTileButton
                    value={projectType.value}
                    title={projectType.title}
                    subtitle={projectType.subtitle}
                    icons={icons[index]}
                    name="project_type"
                    isMultiSelectEnabled={false}
                    onClick={() => {
                      // Send GTM Step 3 when user clicks on a project type (Replacement/ Remodeling/ New Construction)
                      pushFormInteraction(3);
                      fireStepComplete(values, { project_type: projectType.value });
                      updatePageIndex(1);
                    }}
                  />
                </div>
              );
            })}
          </>
        );
      case 2:
        return (
          <>
            {requestQuoteFlow.homeowner.businessInformation.map((field, index) => {
              return (
                <div key={index} className={twMerge('col-span-12', field.columnClasses)}>
                  {field.type === 'tel' ? (
                    <InputPhone {...field} required />
                  ) : (
                    <InputText {...field} required />
                  )}
                  {props.fields?.useModalDuration?.value === true ? renderModal() : null}
                </div>
              );
            })}
            <div className="col-span-6 md:col-span-5">
              <ZippopotamusZipCode
                {...{
                  id: 'requestQuote-zip',
                  name: '',
                  url: '',
                  templateId: '',
                  templateName: '',
                  displayName: '',
                  fields: {
                    fieldName: { value: 'zip' },
                    placeholderText: { value: 'Zip Code' },
                    label: { value: 'Zip Code *' },
                    cityField: {
                      id: 'requestQuote-city',
                      name: '',
                      url: '',
                      fields: {
                        fieldName: { value: 'city' },
                      },
                    },
                    stateField: {
                      id: 'requestQuote-state',
                      name: '',
                      url: '',
                      fields: {
                        fieldName: { value: 'state' },
                      },
                    },
                    validations: [],
                    tooltipImage: {
                      value: {},
                    },
                    tooltipText: {
                      value: '',
                    },
                    subLabel: {
                      value: '',
                    },
                    defaultValue: {
                      value: '',
                    },
                    valueProviders: [],
                    _AW_TemplateId: {
                      value: '',
                    },
                  },
                }}
              />
            </div>

            {/*Message box for Service or Repair types */}
            {(formValues?.project_type === 'Service' || formValues?.project_type === 'Repair') && (
              <div className="col-span-12 md:col-span-10 md:col-start-2">
                <CustomTextArea
                  id="requestQuote-additional-details"
                  name="additional_details"
                  label="Tell us about your project..."
                  placeholder="Specify window and door sizes, unique project requirements, additional questions, etc"
                  rows={6}
                  maxLength={500}
                  showRemainingCharacters
                />
              </div>
            )}

            <div className="h-0 overflow-hidden p-0" aria-hidden="true">
              <InputText
                label="Do not fill out this field."
                placeholder={'Do not fill out this field.'}
                name="website"
              />
            </div>
            <div className="col-span-12 md:col-start-2">
              <span className="text-body">
                {'By clicking "Request a quote", I agree to the terms below.'}
              </span>
            </div>
          </>
        );
      default:
        return <></>;
    }
  };

  const renderProfessionalFlow = (values: FormikValues) => {
    switch (pageIndex) {
      case 1:
        return (
          <>
            {requestQuoteFlow.professional.projectInformation.map(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (info: any, index) => {
                return (
                  <div key={index} className={twMerge('col-span-12', info.columnClasses)}>
                    {info.type === 'text' || info.type === 'email' ? (
                      <InputText {...info} type={info.type} required={!!info.isRequired} />
                    ) : (
                      <Dropdown
                        {...info}
                        options={info.options || []}
                        aria-label={info.label}
                        aria-required={!!info.isRequired}
                        required={!!info.isRequired}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select One
                        </option>
                      </Dropdown>
                    )}
                  </div>
                );
              }
            )}
          </>
        );
      case 2:
        return (
          <>
            {requestQuoteFlow.professional.businessInformation.map(
              // We can ignore this type warning, as we're using proxy array for mapping our customForm elements
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (info: any, index) => {
                if (info.name === 'supplier_name' && values['supplier'] !== 'Yes') {
                  return null;
                }

                return (
                  <div key={index} className={twMerge('col-span-12', info.columnClasses)}>
                    {info.type === 'text' ? (
                      <InputText {...info} required={!!info.isRequired} />
                    ) : info.type === 'tel' ? (
                      <InputPhone {...info} required={!!info.isRequired} />
                    ) : (
                      <Dropdown
                        {...info}
                        options={info.options ?? []}
                        aria-label={info.label}
                        aria-required={!!info.isRequired}
                        required={!!info.isRequired}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select One
                        </option>
                      </Dropdown>
                    )}
                  </div>
                );
              }
            )}
            <AddressGroup
              address1={{
                id: 'requestQuote-address1',
                name: 'address1',
                label: 'Street Address',
                placeholder: 'Enter Street Address',
                classes: 'col-span-12 md:col-span-10 md:col-start-2',
                required: true,
              }}
              country={{
                id: 'requestQuote-country',
                name: 'country',
                label: 'Country',
                classes: 'col-span-12 md:col-span-10 md:col-start-2',
                required: true,
              }}
              city={{
                id: 'requestQuote-city',
                name: 'city',
                label:
                  values['country'] === FormsConstants.Country.Canada ? 'Municipality' : 'City',
                placeholder:
                  values['country'] === FormsConstants.Country.Canada ? 'Municipality' : 'City',
                classes: 'col-span-12 md:col-span-10 md:col-start-2',
                required: true,
              }}
              state={{
                id: 'requestQuote-state',
                name: 'state',
                label: values['country'] === FormsConstants.Country.Canada ? 'Province' : 'State',
                classes: 'col-span-12 md:col-span-5 md:col-start-2!',
                required: true,
              }}
              location={{
                id: 'requestQuote-location',
                name: 'location',
                label: 'Location',
                placeholder: 'Location',
                classes: 'col-span-12 md:col-span-5 md:col-start-2!',
                required: true,
              }}
              zipCode={{
                id: 'requestQuote-zipCode',
                name: 'zip',
                label:
                  values['country'] === FormsConstants.Country.Canada ? 'Postal Code' : 'Zip Code',
                placeholder:
                  values['country'] === FormsConstants.Country.Canada ? 'Postal Code' : 'Zip Code',
                classes: 'col-span-12 md:col-span-5!',
                required: true,
              }}
            />
            <div className="col-span-12 md:col-span-10 md:col-start-2">
              <CustomTextArea
                placeholder="Specify window and door sizes, unique project requirements, additional questions, etc"
                rows={8}
                name="additional_details"
                maxLength={450}
                id="requestQuote-additional-details"
                label="Tell Us More About Your Project"
                showRemainingCharacters
              />
            </div>
            <div className="h-0 overflow-hidden p-0" aria-hidden="true">
              <InputText
                label="Do not fill out this field."
                placeholder={'Do not fill out this field.'}
                name="website"
              />
            </div>
          </>
        );
      default:
        return <></>;
    }
  };
  // --------------- Start - Sitecore Personalize -------------
  const fireIdentify = (values: FormikValues) => {
    const email = values['email']?.trim();

    if (!email || email === lastIdentifiedEmailRef.current) {
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return;
    }

    lastIdentifiedEmailRef.current = email;

    const lastName = values['last_name'] ?? '';
    const postalCode = values['zip'] ?? '';
    const awContactKey = `${lastName}|${postalCode}|${email}`;
    const isHomeowner = values['about'] === 'homeowner';
    const userType = isHomeowner ? 'Homeowner' : 'Professional';
    let city = '';
    let state = '';
    let street = '';
    let country = '';
    if (userType === 'Professional') {
      city = values['city'] ?? '';
      state = values['state'] ?? '';
      street = values['address1'] ?? '';
      country = isHomeowner ? 'USA' : (values['country'] ?? '');
    }
    const identifyPayload = {
      type: 'IDENTITY',
      language: 'EN',
      identifiers: [{ provider: 'AW_CONTACT_KEY', id: awContactKey }],
      email,
      firstName: values['first_name'] ?? '',
      lastName,
      mobile: values['mobile_number'] ?? '',
      postalCode: postalCode,
      city: city,
      state: state,
      street: street ? [street] : [],
      country: country,
      extensionData: {
        contactKey: awContactKey,
        userType,
        proType: values['trades'] ?? '',
      },
    };
    identity(identifyPayload).catch(console.debug);
  };

  const fireStart = (userType: 'homeowner' | 'professional') => {
    // Start abandonment tracking when the first step is completed
    beginAbandonTracking();

    // Add the sessionStorage as soon as the journey begins so
    // AbandonRouteTracker has something to send if the user SPA-navigates
    // away before the inactivity timer fires.
    updateRaqAbandonSession(latestFormValuesRef.current, latestPageIndexRef.current);

    setSessionStorageItems({
      [StringConstants.AW.RequestQuote.StartTimeKey]: String(Date.now()),
      [StringConstants.AW.RequestQuote.SubmittedKey]: 'false',
    });

    const startPayload = {
      type: StringConstants.AW.RequestQuote.StartEventType,
      channel: 'WEB',
      language: 'EN',
      ext: {
        timestamp: new Date().toISOString(),
        pageUrl: globalThis.location.href,
        referrer: document.referrer,
        userType: userType === 'homeowner' ? 'Homeowner' : 'Professional',
      },
    };
    event(startPayload).catch((err) => {
      console.error('[CDP] RAQ fireStart Event error', err);
    });
  };
  const fireStepComplete = (values: FormikValues, overrides?: Record<string, string>) => {
    const mergedValues = { ...values, ...overrides };
    const isHomeowner = mergedValues['about'] === 'homeowner';

    let currentSupplierName = '';
    if (!isHomeowner && mergedValues['supplier'] === 'Yes') {
      currentSupplierName = mergedValues['supplier_name'] ?? '';
    }

    const stepCompletePayload = {
      type: StringConstants.AW.RequestQuote.StepCompleteEventType,
      channel: 'WEB',
      language: 'EN',
      ext: {
        timestamp: new Date().toISOString(),
        pageUrl: globalThis.location.href,
        stepCompleted: String(pageIndex),
        userType: isHomeowner ? 'Homeowner' : 'Professional',
        projectType: mergedValues['project_type'] ?? '',
        firstName: mergedValues['first_name'] ?? '',
        lastName: mergedValues['last_name'] ?? '',
        email: mergedValues['email'] ?? '',
        mobile: mergedValues['mobile_number'] ?? '',
        zip: mergedValues['zip'] ?? '',
        city: mergedValues['city'] ?? '',
        state: mergedValues['state'] ?? '',
        country: isHomeowner ? 'USA' : (mergedValues['country'] ?? ''),
        estimatedWindows: isHomeowner ? '' : (mergedValues['estimated_windows'] ?? ''),
        estimatedDoors: isHomeowner ? '' : (mergedValues['estimated_doors'] ?? ''),
        typeOfBusiness: isHomeowner ? '' : (mergedValues['trades'] ?? ''),
        businessName: isHomeowner ? '' : (mergedValues['company'] ?? ''),
        currentSupplier: isHomeowner ? '' : (mergedValues['supplier'] ?? ''),
        currentSupplierName,
        projectTiming: isHomeowner ? '' : (mergedValues['project_timing'] ?? ''),
        address: isHomeowner ? '' : (mergedValues['address1'] ?? ''),
        tellUsMore: mergedValues['additional_details'] ?? '',
      },
    };
    event(stepCompletePayload).catch(console.debug);

    // Refresh the snapshot after each completed step so the payload has the
    updateRaqAbandonSession(mergedValues, pageIndex);
  };
  // --------------- End - Sitecore Personalize -------------
  return (
    // @ts-ignore We need to use existing form context with only pageIndex
    <FormsContext.Provider {...{ value: { pageIndex: pageIndex } }}>
      <div data-component="forms/requestquote">
        <Formik
          initialValues={requestQuoteInitialValues}
          validationSchema={
            pageIndex <= 2 &&
            // @ts-ignore We can ignore this type-error element implicitly has an 'any' type because expression of type 'number' can't be used to index
            Yup.object().shape(
              // @ts-ignore We can ignore this type-error element implicitly has an 'any' type because expression of type 'number' can't be used to index
              Object.keys(requestQuoteValidationSchema).reduce(
                (acc, field): Record<string, unknown> =>
                  // @ts-ignore We can ignore this type-errorm element implicitly has an 'any' type because expression of type 'number' can't be used to index
                  (
                    fieldsToValidatePerPage[currentFlow][pageIndex].includes(field) &&
                      // @ts-ignore We can ignore this type-error element implicitly has an 'any' type because expression of type 'number' can't be used to index
                      (acc[field] = requestQuoteValidationSchema[field]),
                    acc
                  ),
                {}
              )
            )
          }
          validateOnChange={false}
          validateOnBlur={true}
          onSubmit={() => undefined}
        >
          {({ values, touched, setTouched, validateForm, isValid }) => {
            setFormValues(values);
            latestFormValuesRef.current = values;
            return (
              <form onChange={handleFormInteraction} onInput={handleFormInteraction}>
                <div className="grid grid-cols-12 gap-xxs gap-y-m md:gap-s">
                  <Headline
                    {...props}
                    classes="col-span-12 text-center text-theme-text text-sm-m md:text-m font-heavy mb-xxs"
                  />
                  <BodyCopy classes="col-span-12 text-center" {...props} />

                  {requestQuoteSteps.length > 1 && (
                    <Steps
                      steps={requestQuoteSteps}
                      wrapperClasses="col-span-12"
                      backgroundVariant="white"
                    />
                  )}
                  {/* First step */}
                  {pageIndex === 0 && (
                    <>
                      {requestQuoteFlow.userTypes.map((user, index) => {
                        return (
                          <div
                            key={index}
                            className={classNames(
                              'col-span-12 md:col-span-5',
                              index % 2 === 0 && 'md:col-start-2!'
                            )}
                          >
                            <CustomTileButton
                              value={user.value}
                              title={user.title}
                              name="about"
                              isMultiSelectEnabled={false}
                              onClick={() => {
                                // Send GTM Step 2 when user selects homeowner or professional
                                pushFormInteraction(2);
                                setCurrentFlow(user.value as UserType);
                                // Support Personalization | UC-1 & UC-2 | RAQ Start Event
                                fireStart(user.value as UserType);
                                fireStepComplete({ ...values, about: user.value });
                                updatePageIndex(1);
                              }}
                            />
                          </div>
                        );
                      })}
                    </>
                  )}
                  {/* Second step */}
                  {values['about' as keyof typeof values] === 'homeowner'
                    ? renderHomeOwnerFlow(values)
                    : renderProfessionalFlow(values)}

                  {/* Third step */}

                  {/* Navigation buttons */}
                  {pageIndex <= 2 && (
                    <>
                      <div className="col-span-12 mt-s flex gap-m md:col-span-10 md:col-start-2">
                        {pageIndex !== 0 && (
                          <>
                            <NavigationButton
                              icon="arrow"
                              type="button"
                              startWithIcon={true}
                              onClick={() => updatePageIndex(-1)}
                              className={classNames('mr-0!', buttonAlignment['left'])}
                            >
                              Previous
                            </NavigationButton>
                            {((values['about' as keyof typeof values] === 'homeowner' &&
                              pageIndex === 2) ||
                              values['about' as keyof typeof values] === 'professional') && (
                              <NavigationButton
                                icon="arrow"
                                type="button"
                                disabled={!isButtonEnabled && pageIndex === 2}
                                onClick={() =>
                                  handleNextButtonClick(values, touched, setTouched, validateForm)
                                }
                                className={classNames('mr-0!', buttonAlignment['left'])}
                              >
                                {pageIndex < 2 ? 'Next' : 'Request a quote'}
                              </NavigationButton>
                            )}
                          </>
                        )}
                      </div>

                      <div className="col-span-12 md:col-span-10 md:col-start-2">
                        {(!isValid || !isButtonEnabled) && pageIndex === 2 && (
                          <span
                            className={
                              !isButtonEnabled && pageIndex === 2
                                ? classNames(
                                    'my-xxs block w-fit basis-full font-serif text-body text-dark-gray'
                                  )
                                : classNames(
                                    'my-auto',
                                    themeData.classes.errorMessage,
                                    themeData.classes.errorTextColor
                                  )
                            }
                          >
                            {showFormError}
                          </span>
                        )}
                      </div>
                    </>
                  )}

                  {/* Disclaimer Text */}
                  {values['about' as keyof typeof values] === 'homeowner' && pageIndex === 2 && (
                    <DisclaimerText
                      fields={{
                        ...props?.fields,
                      }}
                      disclaimerLayoutClasses="col-span-12 md:col-span-10 md:col-start-2"
                      disclaimerClasses="text-dark-gray!"
                    />
                  )}
                  {values['about' as keyof typeof values] === 'professional' && pageIndex === 2 && (
                    <DisclaimerText
                      fields={{
                        ...props?.fields,
                      }}
                      disclaimerLayoutClasses="col-span-12 md:col-span-10 md:col-start-2"
                      disclaimerClasses="text-dark-gray!"
                    />
                  )}
                  {pageIndex === 3 && props.fields && (
                    <>
                      <div className="col-span-12">
                        <Headline
                          classes="text-theme-text text-center text-sm-m md:text-m font-heavy mb-s"
                          fields={{
                            headlineText: props.fields.thankYouHeading,
                          }}
                        />
                        <BodyCopy
                          classes="text-theme-body text-center text-body text-black mb-s"
                          fields={{ body: props.fields?.thankYouText ?? '' }}
                        />
                      </div>
                      {cardVariants.length > 0 &&
                        typeVariant &&
                        props.cardsPlaceholders?.[typeVariant] && (
                          <>
                            <div className="col-span-12">
                              <Headline
                                classes="text-theme-text text-center text-sm-m font-heavy mb-s"
                                fields={{
                                  headlineText: {
                                    value: 'In the meantime, here are some topics to explore!',
                                  },
                                }}
                              />
                            </div>
                            <div className="col-span-12">
                              {props.cardsPlaceholders?.[typeVariant]}
                            </div>
                          </>
                        )}
                    </>
                  )}
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
    </FormsContext.Provider>
  );
}
