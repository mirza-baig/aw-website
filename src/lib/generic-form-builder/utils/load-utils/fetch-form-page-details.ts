import {
  ComponentPropsCollection,
  ComponentRendering,
  Field,
  Item,
  PlaceholdersData,
} from '@sitecore-content-sdk/nextjs';
import chalk from 'chalk';
import { getErrorMessage } from 'lib/utils/error-utils/get-error-message';

import { FormPageDetail } from './form-page-detail';
import { formPageDetailProviderFactory } from '.sitecore/aw-form-page-detail-provider-factory';

interface AppComponentProps {
  fields: {
    [name: string]: Field | Item | Item[];
  };
  params: {
    [name: string]: string;
  };
  rendering: ComponentRendering;
}

interface FormComponentProps {
  fields: {
    [name: string]: Field | Item | Item[];
  };
  params: {
    [name: string]: string;
  };
  rendering: ComponentRendering;
  componentProps: ComponentPropsCollection;
}

type FormPageDetailsRequest = {
  rendering: ComponentRendering;
  getFormPageDetail: (rendering: AppComponentProps) => Promise<FormPageDetail | undefined>;
};

export async function fetchFormPageDetails(
  placeholderData: PlaceholdersData,
  componentProps: ComponentPropsCollection
): Promise<FormPageDetail[]> {
  const requests = await collectRequests(placeholderData);
  const results = await execRequests(requests, componentProps);

  return results;
}

async function collectRequests(
  placeholderData: PlaceholdersData,
  requests?: FormPageDetailsRequest[]
): Promise<FormPageDetailsRequest[]> {
  if (!requests) {
    requests = [];
  }

  const renderings = flatRenderings(placeholderData);

  const actions = renderings.map(async (rendering) => {
    const getFormPageDetail = formPageDetailProviderFactory(rendering.componentName);

    if (getFormPageDetail != undefined) {
      requests.push({
        getFormPageDetail,
        rendering,
      });
    }

    if (rendering.placeholders != undefined) {
      await collectRequests(rendering.placeholders, requests);
    }
  });

  await Promise.all(actions);

  return requests;
}

async function execRequests(
  requests: FormPageDetailsRequest[],
  componentProps: ComponentPropsCollection
): Promise<FormPageDetail[]> {
  const promises = requests.map(async (request) => {
    const { uid } = request.rendering;

    if (!uid) {
      console.log(
        `Component ${request.rendering.componentName} doesn't have uid, can't store data for this component`
      );
      return;
    }

    try {
      const initialProps = {
        ...{ fields: { ...request.rendering.fields } },
        ...{ params: { ...request.rendering.params } },
        rendering: request.rendering,
      };
      const modifiedDomponentProps = modifyComponentProps(initialProps, componentProps);
      const result = await request.getFormPageDetail(modifiedDomponentProps);
      return result;
    } catch (error) {
      const message = `Error during fetch of form page details for component ${request.rendering.componentName} (${uid}): ${getErrorMessage(error)}`;
      console.error(chalk.red(message));
    }
  });

  const results = await Promise.all(promises);
  const formPageDetails = results.filter((value) => value != undefined);
  return formPageDetails;
}

function flatRenderings(placeholderData: PlaceholdersData): ComponentRendering[] {
  const allComponentRenderings: ComponentRendering[] = [];
  const placeholders = Object.values(placeholderData);

  placeholders.forEach((placeholder) => {
    allComponentRenderings.push(...placeholder);
  });

  return allComponentRenderings;
}

function modifyComponentProps(
  initialProps: AppComponentProps,
  componentProps: ComponentPropsCollection
): FormComponentProps {
  if (!initialProps.rendering.uid) {
    return { ...initialProps, componentProps };
  }

  const data = componentProps[initialProps.rendering.uid] as Record<string, unknown> | undefined;

  if (data === undefined) {
    return { ...initialProps, componentProps };
  }

  return {
    ...initialProps,
    ...data,
    componentProps,
  };
}
