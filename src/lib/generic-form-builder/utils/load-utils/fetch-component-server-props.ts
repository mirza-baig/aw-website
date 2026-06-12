import {
  ComponentPropsCollection,
  ComponentRendering,
  PlaceholdersData,
} from '@sitecore-content-sdk/nextjs';
import chalk from 'chalk';
import { getErrorMessage } from 'lib/utils/error-utils/get-error-message';

import { componentServerPropsProviderFactory } from '.sitecore/aw-component-server-props-provider-factory';

type ComponentPropsRequest = {
  rendering: ComponentRendering;
  getComponentServerProps: (rendering: ComponentRendering) => Promise<unknown>;
};

export async function fetchComponentServerProps(
  placeholderData: PlaceholdersData
): Promise<ComponentPropsCollection> {
  const requests = await collectRequests(placeholderData);
  const results = await execRequests(requests);

  return results;
}

async function collectRequests(
  placeholderData: PlaceholdersData,
  requests?: ComponentPropsRequest[]
): Promise<ComponentPropsRequest[]> {
  if (!requests) {
    requests = [];
  }

  const renderings = flatRenderings(placeholderData);

  const actions = renderings.map(async (rendering) => {
    const getComponentServerProps = componentServerPropsProviderFactory(rendering.componentName);

    if (getComponentServerProps != undefined) {
      requests.push({
        getComponentServerProps,
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

async function execRequests(requests: ComponentPropsRequest[]): Promise<ComponentPropsCollection> {
  const componentProps: ComponentPropsCollection = {};
  const promises = requests.map(async (request) => {
    const { uid } = request.rendering;

    if (!uid) {
      console.log(
        `Component ${request.rendering.componentName} doesn't have uid, can't store data for this component`
      );
      return;
    }

    try {
      const result = await request.getComponentServerProps(request.rendering);
      componentProps[uid] = result;
    } catch (error) {
      const message = `Error during preload data for component ${request.rendering.componentName} (${uid}): ${getErrorMessage(error)}`;
      console.error(chalk.red(message));

      componentProps[uid] = {
        error: message,
        componentName: request.rendering.componentName,
      };
    }
  });

  await Promise.all(promises);

  return componentProps;
}

function flatRenderings(placeholderData: PlaceholdersData): ComponentRendering[] {
  const allComponentRenderings: ComponentRendering[] = [];
  const placeholders = Object.values(placeholderData);

  placeholders.forEach((placeholder) => {
    allComponentRenderings.push(...placeholder);
  });

  return allComponentRenderings;
}
