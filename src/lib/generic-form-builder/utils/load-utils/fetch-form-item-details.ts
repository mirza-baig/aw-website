import {
  ComponentPropsCollection,
  ComponentRendering,
  Field,
  Item,
  PlaceholdersData,
} from '@sitecore-content-sdk/nextjs';
import chalk from 'chalk';
import { getErrorMessage } from 'lib/utils/error-utils/get-error-message';

import { FormItemDetail } from './form-item-detail';
import { formItemDetailProviderFactory } from '.sitecore/aw-form-item-detail-provider-factory';

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

type FormItemDetailsRequest = {
  rendering: ComponentRendering;
  getFormItemDetail: (rendering: AppComponentProps) => Promise<FormItemDetail | undefined>;
};

export async function fetchFormItemDetails(
  placeholderData: PlaceholdersData,
  componentProps: ComponentPropsCollection
): Promise<FormItemDetail[]> {
  const requests = await collectRequests(placeholderData);
  const results = await execRequests(requests, componentProps);

  return results;
}

async function collectRequests(
  placeholderData: PlaceholdersData,
  requests?: FormItemDetailsRequest[]
): Promise<FormItemDetailsRequest[]> {
  if (!requests) {
    requests = [];
  }

  const renderings = flatRenderings(placeholderData);

  const actions = renderings.map(async (rendering) => {
    const getFormItemDetail = formItemDetailProviderFactory(rendering.componentName);

    if (getFormItemDetail != undefined) {
      requests.push({
        getFormItemDetail,
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
  requests: FormItemDetailsRequest[],
  componentProps: ComponentPropsCollection
): Promise<FormItemDetail[]> {
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
      const result = await request.getFormItemDetail(
        modifyComponentProps(initialProps, componentProps)
      );
      return result;
    } catch (error) {
      const message = `Error during fetch of form item details for component ${request.rendering.componentName} (${uid}): ${getErrorMessage(error)}`;
      console.error(chalk.red(message));
    }
  });

  const results = await Promise.all(promises);
  const formItemDetails = results.filter((value) => value != undefined);

  return formItemDetails;
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
