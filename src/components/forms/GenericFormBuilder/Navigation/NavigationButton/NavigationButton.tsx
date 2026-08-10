'use client';

import { ComponentRendering, useSitecore } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import { FormikValues, useFormikContext } from 'formik';
import { useGenericFormBuilderContext } from 'helpers/GenericFormBuilder/GenericFormBuilderContext';
import { IconTypes } from 'helpers/SvgIcon/SvgIcon';
import { ComponentProps } from 'lib/component-props';
import { FormsConstants } from 'lib/constants/forms-constants';
import { useTheme } from 'lib/context/ThemeContext';
import { FormField, isCompositeField, isStandardField } from 'lib/generic-form-builder/form-props';
import {
  ActionProps,
  ContextValue,
  submitActionFactory,
} from 'lib/generic-form-builder/submit-actions';
import { mapItemFieldResultsToObject } from 'lib/graphql/mappers/map-item-field-results-to-object';
import { mapSearchResults } from 'lib/graphql/mappers/map-search-results';
import { IntegratedGraphQlResult } from 'lib/graphql/types/integrated-graphql-result';
import { ItemFieldResult } from 'lib/graphql/types/item-field-result';
import { ItemSearchResults } from 'lib/graphql/types/item-search-results';
import { startTimer } from 'lib/personalize/abandon-timer';
import { getEnum } from 'lib/utils/get-enum';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX, useState } from 'react';

import { NavigationButtonHelper } from './helpers/NavigationButton.helper';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type FieldAttribute = Sitecore.Forms.GenericFormBuilder.Attributes.FieldAttribute & {
  id: string;
};

type SubmitAction = Sitecore.BaseTemplates.BaseSubmitAction & {
  id: string;
  attributes: FieldAttribute[];
};

export type NavigationButtonProps = ComponentProps &
  Sitecore.Forms.GenericFormBuilder.Navigation.NavigationButton.NavigationButton & {
    submitActions: SubmitAction[];
  };

type Alignment = 'left' | 'right' | 'center';

enum ButtonWidth {
  fullWidth = '12',
  halfWidth = '6',
}

enum FieldWidth {
  fullWidth = '12',
  halfWidth = '6',
  thirdWidth = '4',
  quarterWidth = '3',
  sixthWidth = '2',
  twelthWidth = '1',
}

const mobileWidthClasses: Record<ButtonWidth, string> = {
  [ButtonWidth.fullWidth]: 'col-span-12',
  [ButtonWidth.halfWidth]: 'col-span-6',
};

const desktopWidthClasses: Record<FieldWidth, string> = {
  [FieldWidth.fullWidth]: 'md:col-span-12',
  [FieldWidth.halfWidth]: 'md:col-span-6',
  [FieldWidth.thirdWidth]: 'md:col-span-4',
  [FieldWidth.quarterWidth]: 'md:col-span-3',
  [FieldWidth.sixthWidth]: 'md:col-span-2',
  [FieldWidth.twelthWidth]: 'md:col-span-1',
};

function NavigationButton_Default(props: NavigationButtonProps): JSX.Element | null {
  const { fields, submitActions } = getComponentServerProps(props.rendering);
  const {
    currentPage,
    navigateToPage,
    formPages,
    formDetails,
    isErrorOnSubmit,
    setIsErrorOnSubmit,
    botCheckers,
    initialValues,
    sessionId,
  } = useGenericFormBuilderContext();

  const { validateForm, setTouched, touched, values, setFieldError } =
    useFormikContext<FormikValues>();
  const { page } = useSitecore();

  const [isButtonEnabled, setIsButtonEnabled] = useState(true);
  const { themeName } = useTheme();
  let submitActionNextStep = -1;

  if (fields == undefined) {
    return null;
  }

  const navigationStep = Number(getEnum<number>(fields.navigationStep) ?? 0);

  // keeping this util function here, as useFormikContext hook can be only be invoked within Formik node

  function updateTouchedState() {
    const touchedFields = formPages[currentPage].fields
      .map((field: FormField) => {
        if (isStandardField(field)) {
          if (initialValues[field.name] != undefined && initialValues[field.name] != null) {
            return field.name;
          }
        }
        if (isCompositeField(field)) {
          for (const subfield of field.subfields) {
            if (initialValues[subfield.name] != undefined && initialValues[subfield.name] != null) {
              return subfield.name;
            }
          }
        }

        return null;
      })
      .flat();

    const touchedState = touchedFields.reduce(
      (acc, field) => {
        if (field != null) {
          acc[field] = true;
        }
        return acc;
      },
      {} as Record<string, boolean>
    );

    setTouched({ ...touched, ...touchedState }, true);
  }

  function trimStringValues(formikValues: FormikValues) {
    // Iterate through the object properties
    for (const key in formikValues) {
      // Check if the property value is a string
      if (typeof formikValues[key] === 'string') {
        // Trim the string value
        formikValues[key] = formikValues[key].trim();
      }
    }
    // Return the updated object with trimmed string values
    return formikValues;
  }

  const executeActions = async () => {
    const context: Record<string, ContextValue> = {};
    //Reset error upon submitting the form
    if (isErrorOnSubmit) {
      setIsErrorOnSubmit(false);
    }

    if (submitActions.length > 0) {
      // Logic here to execute actions if available

      for (const action of submitActions) {
        const actionHandler = submitActionFactory(action);

        const actionProps: ActionProps = {
          formDetails,
          formValues: trimStringValues(values),
          submitButton: { ...props, fields },
          sessionId,
          context,
          formPages,
        };

        if (actionHandler == undefined) {
          continue;
        }

        const result = await actionHandler.execute(actionProps);

        if (result.nextPageIndex) {
          submitActionNextStep = result.nextPageIndex;
        }

        // if (action.name === 'Recaptcha') {
        //   formProps.googleRecaptchaData = {
        //     googleRecaptchaActionId: action.id,
        //     googleRecaptchaResponse: (result && result?.verificationResult) || undefined,
        //   };
        // }

        if (!result.success && action.fields?.stopOnError.value) {
          setIsErrorOnSubmit(result.errorMessage ?? '');
          throw new Error();
        }
      }
    }
  };

  function updateFormStep(navigationStep: number) {
    let currentStep = Number(sessionStorage.getItem(FormsConstants.AW.Form.CCPFormStep) || 1);

    // STORE completed step BEFORE updating
    sessionStorage.setItem(FormsConstants.AW.Form.CCPFormCompleted, String(currentStep));

    // update based on navigationStep
    if (navigationStep === 1) {
      currentStep += 1; // next
    } else if (navigationStep === -1) {
      currentStep -= 1; // previous
    }
    // save updated step
    sessionStorage.setItem(FormsConstants.AW.Form.CCPFormStep, String(currentStep));
    return currentStep;
  }

  function resetAbandonTimer() {
    startTimer(
      () => {
        globalThis.dispatchEvent(
          new CustomEvent('aw_ccp_abandon', {
            detail: {
              isInactivity: true,
            },
          })
        );
      },
      sessionStorage.getItem(FormsConstants.AW.Form.CCPFormTimeout)
        ? Number(sessionStorage.getItem(FormsConstants.AW.Form.CCPFormTimeout))
        : 15 * 60 * 1000
    );
  }

  function handleBotCheck(
    botCheckers: string[],
    values: FormikValues,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFieldError: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setIsErrorOnSubmit: any
  ) {
    for (const botChecker of botCheckers) {
      if (values[botChecker]) {
        setFieldError(botChecker, 'Submission Unsuccessful');
        setIsErrorOnSubmit('Submission Unsuccessful');
        return false;
      }
      delete values[botChecker];
    }
    return true;
  }

  const handleButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    /* first check if botchecker field have value and if found,
     set the Error messages and,
     stop the execution and return click handler */
    if (!handleBotCheck(botCheckers, values, setFieldError, setIsErrorOnSubmit)) {
      return;
    }

    // Validate the current step's fields if skip validation is not checked
    const errors = fields?.skipValidation?.value ? [] : await validateForm();
    if (Object.keys(errors).length === 0 || navigationStep === -1) {
      setIsErrorOnSubmit(false);
      setIsButtonEnabled(false);
      // Form is valid, execute actions if available
      try {
        // update the FormStep
        updateFormStep(navigationStep);
        // reset timer
        resetAbandonTimer();

        await executeActions(); // Execute actions and handle any errors
        // Actions executed successfully, advance to the next page (for next and submit buttons)
        if (submitActionNextStep > -1) {
          navigateToPage(submitActionNextStep);
        } else {
          navigateToPage(currentPage + navigationStep);
        }
        setIsButtonEnabled(true);
        if (navigationStep !== -1) {
          updateTouchedState();
        }
      } catch {
        setIsButtonEnabled(true);
      }
    } else {
      // Some fields are invalid, set them as touched to display validation errors
      updateTouchedState();
      setIsErrorOnSubmit('Please fill out all required fields.');

      //  scroll to the first field that is having error
      const ErrorFieldName = Object.keys(errors)[0];
      const FormElement: HTMLElement | null = document.querySelector(
        `input[name="${ErrorFieldName}"], select[name="${ErrorFieldName}"], textarea[name="${ErrorFieldName}"]`
      );

      if (FormElement) {
        FormElement.focus();
      }
    }
  };

  const mobileWidth = getEnum<ButtonWidth>(fields.mobileWidth) ?? ButtonWidth.fullWidth;
  const desktopWidth = getEnum<FieldWidth>(fields.width) ?? FieldWidth.fullWidth;

  const mobileColClass = mobileWidthClasses[mobileWidth] ?? 'col-span-12';
  const desktopColClass = desktopWidthClasses[desktopWidth] ?? 'md:col-span-12';

  const _icon = getEnum<IconTypes>(fields.icon);
  const linkTheme = _icon === 'form-link';

  const buttonAlignment: Record<Alignment, string> = {
    left: 'mr-auto',
    right: 'ml-auto',
    center: 'mx-auto',
  };

  let extraPadding = '';

  if (themeName === 'rba' && !linkTheme) {
    extraPadding = 'pb-ml';
  }
  return (
    <div
      className={classNames('relative self-center', mobileColClass, desktopColClass, extraPadding)}
    >
      <NavigationButtonHelper
        icon={_icon}
        type="button"
        disabled={!isButtonEnabled}
        startWithIcon={navigationStep === -1}
        hideIcon={linkTheme}
        onClick={(e) => handleButtonClick(e)}
        className={classNames(
          buttonAlignment[getEnum<Alignment>(fields?.alignment) || 'left'],
          page.mode.isEditing ? 'pointer-events-none' : ''
        )}
      >
        {fields?.label?.value}
      </NavigationButtonHelper>
      {!isButtonEnabled && (
        <span
          className={classNames(
            'my-xxs block w-fit font-serif text-body text-dark-gray',
            buttonAlignment[getEnum<Alignment>(fields?.alignment) || 'left']
          )}
        >
          Processing... please wait
        </span>
      )}
    </div>
  );
}

export const Default = withDatasourceCheck(NavigationButton_Default);

type IntegratedGraphQl = IntegratedGraphQlResult<{
  item: {
    fields: ItemFieldResult[];
    children: ItemSearchResults<{
      id: string;
      fields: ItemFieldResult[];
      children: ItemSearchResults<{
        id: string;
        fields: ItemFieldResult[];
      }>;
    }>;
  };
}>;

function getComponentServerProps(rendering: ComponentRendering) {
  const fields = rendering.fields as unknown as IntegratedGraphQl;

  const result = {
    fields: {
      ...mapItemFieldResultsToObject(fields.data.item.fields),
    },
    submitActions:
      mapSearchResults(fields.data.item.children, (child1) => ({
        id: child1.id,
        fields: {
          ...mapItemFieldResultsToObject(child1.fields),
        },
        attributes:
          mapSearchResults(child1.children, (child2) => ({
            id: child2.id,
            fields: {
              ...mapItemFieldResultsToObject(child2.fields),
            },
          })) ?? [],
      })) ?? [],
  };
  return result;
}
