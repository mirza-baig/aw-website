'use client';

import { AppInsightsContext, ReactPlugin } from '@microsoft/applicationinsights-react-js';
import { ApplicationInsights, ITelemetryItem } from '@microsoft/applicationinsights-web';
import { PropsWithChildren } from 'react';

interface State {
  appInsights: ApplicationInsights;
  reactPlugin: ReactPlugin;
}

// store the AI state on `window` so we aren't constantly re-initializing it on every hot-reload during `npm run dev`
// we can't use a `Symbol` for this, as we'd get a new symbol on every hot-reload
const getState = () =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (typeof window !== 'undefined' && ((window as any).__AI_STATE__ as State | undefined)) ||
  undefined;

const setState = (state: State) => {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;

    w.__AI_STATE__ = state;
  }
};

function getOrInit(
  connectionString: string,
  roleName?: string,
  roleInstance?: string,
  additionalProperties: { [key: string]: string } = {}
): State {
  let state = getState();
  if (state) {
    return state;
  }

  const reactPlugin = new ReactPlugin();
  const appInsights = new ApplicationInsights({
    config: {
      connectionString: connectionString,
      enableAutoRouteTracking: true, // we don't have a browserHistory to pass to this, so it'll have to use automatic route tracking
      enableRequestHeaderTracking: true,
      enableResponseHeaderTracking: true,
      enableAjaxPerfTracking: true,
      isBrowserLinkTrackingEnabled: true,
      extensions: [reactPlugin],
      extensionConfig: {
        [reactPlugin.identifier]: {},
      },
    },
  });

  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;

    w.appInsights = appInsights.loadAppInsights();
  } else {
    appInsights.loadAppInsights();
  }

  const telemetryInitializer = (envelope: ITelemetryItem) => {
    if (envelope.tags == undefined) {
      return;
    }

    envelope.tags['ai.cloud.role'] = roleName;
    envelope.tags['ai.cloud.roleInstance'] = roleInstance;

    const data = envelope.data ?? {};
    envelope.data = {
      ...data,
      ...additionalProperties,
    };
  };
  appInsights.addTelemetryInitializer(telemetryInitializer);

  state = {
    appInsights,
    reactPlugin,
  };

  setState(state);
  return state;
}

export interface AzureAppInsightsProps {
  connectionString?: string;
  roleName?: string;
  roleInstance?: string;
  additionalProperties?: { [key: string]: string };
}

export const AppInsightsClient = ({
  connectionString,
  roleName,
  roleInstance,
  additionalProperties = {},
  children,
}: PropsWithChildren<AzureAppInsightsProps>) => {
  // we don't want to run this AI setup server-side - that has a separate setup
  if (process.env.NEXT_RUNTIME || !connectionString) {
    return <>{children}</>;
  }

  const state = getOrInit(connectionString, roleName, roleInstance, additionalProperties);

  return (
    <AppInsightsContext.Provider value={state.reactPlugin}>{children}</AppInsightsContext.Provider>
  );
};
