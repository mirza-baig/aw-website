'use client';

import { ComponentPropsCollection } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import { Formik } from 'formik';
import {
  GenericFormBuilderContextProvider,
  GenericFormBuilderContextState,
} from 'helpers/GenericFormBuilder/GenericFormBuilderContext';
import { Steps } from 'helpers/GenericFormBuilder/Steps';
import { useTheme } from 'lib/context/ThemeContext';
import { FormPage } from 'lib/generic-form-builder/form-props';
import { buildForm } from 'lib/generic-form-builder/utils/load-utils/build-form';
import { createUUID } from 'lib/utils/string-utils/create-uuid';
import { useSimpleReducer } from 'lib/utils/use-simple-reducer';
import { JSX, ReactNode, RefObject, useCallback, useEffect, useMemo, useRef } from 'react';

import { FormTheme } from './GenericFormBuilder.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

function FetchFormFieldElements(formRef: RefObject<HTMLFormElement | null>): Element[] {
  const inputElements = formRef.current?.querySelectorAll('input') || [];
  const dropdownElements = formRef.current?.querySelectorAll('select') || [];
  const textAreaElements = formRef.current?.querySelectorAll('textarea') || [];

  return [...inputElements, ...dropdownElements, ...textAreaElements];
}

type FormState = {
  formPages?: FormPage[];
  currentPage: number;
  isErrorOnSubmit: false | string;
  isFormInteracted: boolean;
  initialValues: Record<string, unknown>;
  botCheckers: string[];
};

type GenericFormBuilder = Sitecore.Forms.GenericFormBuilder.GenericFormBuilder & {
  placeholder: ReactNode;
  componentProps: ComponentPropsCollection;
};

export function GenericFormBuilderClient(props: GenericFormBuilder): JSX.Element | null {
  const { themeData } = useTheme(FormTheme());
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, setFormState] = useSimpleReducer<FormState>({
    currentPage: 0,
    isErrorOnSubmit: false,
    isFormInteracted: false,
    initialValues: {},
    botCheckers: [],
  });

  useEffect(
    function BuildFormPages() {
      async function fetchFormPages() {
        const { botCheckers, formPages, initialValues } = await buildForm(
          props.componentProps,
          props.rendering
        );
        setFormState({ formPages, initialValues, botCheckers });
      }
      fetchFormPages();
    },
    [props.componentProps, props.rendering, setFormState]
  );

  const handleFormFocus = useCallback(() => {
    setFormState({ isFormInteracted: true });
  }, [setFormState]);

  useEffect(() => {
    if (formState.formPages == undefined) {
      return;
    }

    try {
      if (formState.formPages[formState.currentPage].initialHiddenFieldExists) {
        setFormState({ isFormInteracted: false });
        return;
      }
      FetchFormFieldElements(formRef).forEach((element) =>
        element.addEventListener('focus', handleFormFocus)
      );
    } catch {}
  }, [handleFormFocus, formState, setFormState]);

  useEffect(() => {
    if (!formState.isFormInteracted) {
      return;
    }

    FetchFormFieldElements(formRef).forEach((element) =>
      element.removeEventListener('focus', handleFormFocus)
    );
  }, [handleFormFocus, formState]);

  /* common function to update pageIndex for next/prev Button,
     and udpate validationSchema accordingly,
     hence keeping it within formContext as rest of navigation logic are within Button Component iteself.
  */
  const updatePageIndex = useCallback(
    (navigationStep: number) => {
      if (formState.formPages == undefined) {
        return;
      }
      setFormState({ currentPage: navigationStep });
    },
    [formState, setFormState]
  );

  const formContext = useMemo(
    (): GenericFormBuilderContextState => ({
      currentPage: formState.currentPage,
      navigateToPage: updatePageIndex,
      sessionId: createUUID().toUpperCase(),
      isErrorOnSubmit: formState.isErrorOnSubmit,
      setIsErrorOnSubmit: (isErrorOnSubmit: false | string) => {
        setFormState({ isErrorOnSubmit });
      },
      botCheckers: formState.botCheckers,
      isFormInteracted: formState.isFormInteracted,
      formPages: formState.formPages ?? [],
      initialValues: formState.initialValues,
      formDetails: { id: props.rendering.uid, name: props.fields?.formName.value },
    }),
    [
      formState.botCheckers,
      formState.currentPage,
      formState.formPages,
      formState.initialValues,
      formState.isErrorOnSubmit,
      formState.isFormInteracted,
      props,
      setFormState,
      updatePageIndex,
    ]
  );

  if (formState.formPages === undefined) {
    return null;
  }

  const showStepper =
    formState.formPages.filter((step: FormPage) => step.includeInSteps).length > 1;

  return (
    <GenericFormBuilderContextProvider initialState={formContext}>
      <div
        data-component="forms/form"
        className={classNames(themeData.classes.form, props.classes)}
      >
        <Formik
          initialValues={formState.initialValues}
          validationSchema={formState.formPages[formState.currentPage]?.validationSchema}
          validateOnChange={false}
          validateOnBlur={true}
          onSubmit={() => undefined}
          enableReinitialize={true}
        >
          {() => {
            return (
              <form ref={formRef} className="scroll-container">
                {showStepper && !formState.formPages![formState.currentPage].hideStepper && (
                  <Steps steps={formState.formPages!} />
                )}
                <div className="pages">{props.placeholder}</div>
              </form>
            );
          }}
        </Formik>
      </div>
    </GenericFormBuilderContextProvider>
  );
}
