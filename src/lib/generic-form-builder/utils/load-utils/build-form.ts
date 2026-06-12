import { ComponentPropsCollection, ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { FormField, FormPage } from 'lib/generic-form-builder/form-props';
import * as yup from 'yup';
import { Schema } from 'yup';

import { fetchFormPageDetails } from './fetch-form-page-details';
import {
  FormItemDetail,
  isBotCheckerFieldDetail,
  isCompositeFieldDetail,
  isStandardFieldDetail,
} from './form-item-detail';
import { FormPageDetail } from './form-page-detail';

function buildFieldFromDetails(fieldDetail: FormItemDetail): FormField | undefined {
  if (isStandardFieldDetail(fieldDetail)) {
    return {
      id: fieldDetail.id,
      name: fieldDetail.name,
      templateName: fieldDetail.templateName,
    };
  }

  if (isCompositeFieldDetail(fieldDetail)) {
    return {
      id: fieldDetail.id,
      prefix: fieldDetail.prefix,
      templateName: fieldDetail.templateName,
      subfields: fieldDetail.subfields.map((subfield) => ({
        id: subfield.id,
        name: subfield.name,
      })),
    };
  }

  return undefined;
}

function buildPageFromDetails(pageDetail: FormPageDetail): {
  fields: FormField[];
  initialHiddenFieldExists: boolean;
  initialValues: Record<string, unknown>;
  validationSchema: Schema;
  botCheckers: string[];
} {
  const fields: FormField[] = [];
  const initialValues: Record<string, unknown> = {};
  let validationSchema = yup.object();
  const botCheckers: string[] = [];

  // Build formState from formDeatails
  for (const fieldDetail of pageDetail.formFieldDetails) {
    const formField = buildFieldFromDetails(fieldDetail);

    if (formField === undefined) {
      continue;
    }

    if (isStandardFieldDetail(fieldDetail)) {
      initialValues[fieldDetail.name] = fieldDetail.initialValue;

      if (fieldDetail.validationSchema) {
        validationSchema = validationSchema.shape({
          [fieldDetail.name]: fieldDetail.validationSchema,
        });
      }
    }

    if (isCompositeFieldDetail(fieldDetail)) {
      for (const subfieldDetail of fieldDetail.subfields) {
        initialValues[subfieldDetail.name] = subfieldDetail.initialValue;

        if (subfieldDetail.validationSchema === undefined) {
          continue;
        }
        validationSchema = validationSchema.shape({
          [subfieldDetail.name]: subfieldDetail.validationSchema,
        });
      }
    }

    if (isBotCheckerFieldDetail(fieldDetail)) {
      botCheckers.push(fieldDetail.name);
    }

    fields.push(formField);
  }

  const initialHiddenFieldExists = pageDetail.formFieldDetails.some((field) =>
    isStandardFieldDetail(field) ? field.hideOnLoad : false
  );

  return { botCheckers, fields, initialHiddenFieldExists, initialValues, validationSchema };
}

function buildFormFromDetails(formPageDetails: FormPageDetail[]): {
  formPages: FormPage[];
  initialValues: Record<string, unknown>;
  botCheckers: string[];
} {
  const formPages: FormPage[] = [];
  let initialValues: Record<string, unknown> = {};
  let botCheckers: string[] = [];

  // Build formState from formDeatails
  for (const pageDetail of formPageDetails) {
    const {
      botCheckers: pageBotCheckers,
      fields,
      initialHiddenFieldExists,
      initialValues: pageInitialValues,
      validationSchema,
    } = buildPageFromDetails(pageDetail);

    const formPage: FormPage = {
      label: pageDetail.label,
      includeInSteps: pageDetail.includeInSteps,
      hideStepper: pageDetail.hideStepper,
      fields,
      initialHiddenFieldExists,
      validationSchema,
    };

    initialValues = { ...initialValues, ...pageInitialValues };
    botCheckers = [...botCheckers, ...pageBotCheckers];

    formPages.push(formPage);
  }

  return { botCheckers, formPages, initialValues };
}

export async function buildForm(
  componentData: ComponentPropsCollection,
  rendering: ComponentRendering
) {
  const formPageDetails = await fetchFormPageDetails(rendering.placeholders ?? {}, componentData);

  return buildFormFromDetails(formPageDetails);
}
