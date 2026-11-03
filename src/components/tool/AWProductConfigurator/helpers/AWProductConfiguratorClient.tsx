'use client';

import config from 'aw.config.client';
import classNames from 'classnames';
import Component from 'helpers/Component/Component';
import ImageWrapper from 'helpers/Media/ImageWrapper';
import { Spinner } from 'helpers/Spinner';
import { useTheme } from 'lib/context/ThemeContext';
import { useAsPath } from 'lib/hooks/use-as-path';
import Script from 'next/script';
import { JSX, useCallback, useEffect, useRef, useState } from 'react';

import { AWProductConfiguratorTheme } from './AWProductConfigurator.theme';
import { DEALER_MODE, HOMEOWNER_MODE } from './constants';
import ProjectComponent from './project';
import QuestionsComponent from './questions';
import StepNavigationComponent from './stepNavigation';
import StepsBarComponent from './StepsBar';
import SummaryComponent from './summary';
import { convertThreekitConfigToObject } from './threekitUtils';
import { isExpiringSoon } from './tokenUtil';
import { ActiveStepData } from './types/activeStepData';
import { Step } from './types/step';
import { SummarySteps } from './types/summary-steps';
import { ThreekitConfiguration } from './types/threekitConfiguration';
import { Sitecore } from '.sitecore/AndersenWindows.model';

// NOSONAR_BEGIN
// Not currently used, but will be for My Project button icons
// import SvgIcon from 'helpers/SvgIcon/SvgIcon';
// NOSONAR_END

// Define types for Threekit
interface ThreekitPlayer {
  getConfigurator: () => Promise<ThreekitConfigurator>;
  on?: (event: string, handler: () => void) => void;
  off: (event: string, handler: () => void) => void;
  evaluate?: () => Promise<void>;
}

interface ThreekitConfigurator {
  setConfiguration: (config: Record<string, string | number | boolean>) => void;
}

interface ThreekitWindow extends Window {
  threekitPlayer?: (config: ThreekitConfig) => Promise<ThreekitPlayer>;
  player?: ThreekitPlayer;
  configurator?: ThreekitConfigurator;
}

interface ThreekitConfig {
  authToken: string;
  el: HTMLElement | null;
  assetId: string;
  showLoadingThumbnail: boolean;
  showConfigurator: boolean;
  showAR: boolean;
  locale: string;
  classnames: {
    ar: {
      button: string;
      popup: string;
    };
  };
  publishStage: string;
}

type ApiDuration = {
  dateTime: string;
  label: string;
  ms: number;
};

type AWProductConfiguratorProps = Sitecore.Components.Tool.AwproductConfigrator.ProductConfigurator;

export function AWProductConfiguratorClient(props: AWProductConfiguratorProps): JSX.Element {
  type ConfigSession = Awaited<ReturnType<typeof createConfigSession>>;

  const asPath = useAsPath();
  const { themeData } = useTheme(AWProductConfiguratorTheme());
  const baseURL = config.paradigm.baseUrl;

  // Threekit Player variables
  const [configurator, setConfigurator] = useState<ThreekitConfigurator | null>(null);
  const [isSdkReady, setIsSdkReady] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const assetIdValue = props.fields?.tkAssetId?.value ?? '';
  const threekitAuthToken = props.fields?.tkAuthToken?.value ?? '';

  // Initial load to get token and quote
  const [configAccessToken, setConfigAccessToken] = useState<string | null>(null);
  const [configAccessTokenExpiry, setConfigAccessTokenExpiry] = useState<string | null>(null);
  const [quoteId, setQuoteId] = useState<string | null>(null);
  const [quoteNumber, setQuoteNumber] = useState<string | null>(null);

  // Paradigm Configurator Data
  const [configuratorKey, setConfiguratorKey] = useState<string | null>(null);
  const [configuratorCookie, setConfiguratorCookie] = useState<string | null>(null);
  const [steps, setSteps] = useState<Step[] | null>(null);
  const [activeStepData, setActiveStepData] = useState<ActiveStepData | null>(null);
  const [summarySteps, setSummarySteps] = useState<SummarySteps[] | null>(null);
  const [lineItemIds, setLineItemIds] = useState<string[]>([]);
  const [threekitConfiguration, setThreekitConfiguration] = useState<ThreekitConfiguration | null>(
    null
  );

  // Hide the Product Selection and Ext Trim/EJs step
  const excludedStepIds = [4644, 0];

  // User interaction state
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [showProjectComponent, setShowProjectComponent] = useState<boolean>(false);
  const [mode, setMode] = useState<typeof DEALER_MODE | typeof HOMEOWNER_MODE>(HOMEOWNER_MODE);

  // Refs
  const navRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const [playerContainerReady, setPlayerContainerReady] = useState(false);
  const playerRef = useRef<ThreekitPlayer | null>(null);
  const questionsContainerRef = useRef<HTMLDivElement | null>(null);

  // Used to show spinner when fetching data
  const [fetchingData, setFetchingData] = useState<boolean>(true);

  // API Performance tracking variables
  const MAX_DURATIONS = props.fields?.numberOfMetrics?.value ?? 10;
  const [paradigmApiDurations, setParadigmApiDurations] = useState<ApiDuration[]>([]);
  const [threekitApiDurations, setThreekitApiDurations] = useState<ApiDuration[]>([]);
  const [showMetrics, setShowMetrics] = useState<boolean>(true);
  const showAPIMetrics = props.fields?.showAPIMetrics?.value ?? false;
  const toggleMetrics = () => setShowMetrics((prev) => !prev);
  const clearMetrics = () => setParadigmApiDurations([]);
  const clearThreekitMetrics = () => setThreekitApiDurations([]);

  /**************************************************
   * BEGIN: constant functions section
   **************************************************/
  // Called once the Threekit SDK script is loaded
  const onSdkLoaded = () => setIsSdkReady(true);

  const changeModeConfigurator = () => {
    if (mode === HOMEOWNER_MODE) {
      setMode(DEALER_MODE);
    } else if (mode === DEALER_MODE) {
      setMode(HOMEOWNER_MODE);
    }
  };

  const setPlayerContainer = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      playerContainerRef.current = node;
      setPlayerContainerReady(true);
    }
  }, []);

  // Step 1: Fetch token (returns a string)
  const fetchAuthToken = async (): Promise<{ accessToken: string; expires: string }> => {
    // Start timing the API call
    const startTime = performance.now();

    const response = await fetch('/api/aw/product-configurator/auth-token', {
      method: 'POST',
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error ?? 'Failed to fetch Auth Token');
    }

    const data = await response.json();
    const accessToken = data.access_token ?? '';
    const expires = data.expires ?? '';

    // End timing
    const endTime = performance.now();
    const elapsed = endTime - startTime;
    setParadigmApiDurations((prev) =>
      prev.length < MAX_DURATIONS
        ? [
            ...prev,
            {
              dateTime: new Date().toISOString(),
              label: 'auth-token',
              ms: elapsed,
            },
          ]
        : [
            ...prev.slice(1),
            {
              dateTime: new Date().toISOString(),
              label: 'auth-token',
              ms: elapsed,
            },
          ]
    );

    return { accessToken, expires };
  };

  // Step 2: Create quote (returns a quoteId and quoteNumber)
  const createQuote = async (
    token: string
  ): Promise<{ quoteId: string | null; quoteNumber: string | null }> => {
    // Use saved quote ID and Number if exists
    const savedQuoteId = localStorage.getItem('aw_product_configurator_quote_id');
    const savedQuoteNumber = localStorage.getItem('aw_product_configurator_quote_number');

    if (savedQuoteId && savedQuoteNumber) {
      setQuoteId(savedQuoteId);
      setQuoteNumber(savedQuoteNumber);
      return { quoteId: savedQuoteId, quoteNumber: savedQuoteNumber };
    }

    // Start timing the API call
    const startTime = performance.now();

    const response = await fetch('/api/aw/product-configurator/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error('Error creating quote: ', err);
    }
    const data = await response.json();
    const qID = data?.quoteId ?? null;
    const qNumber = data?.quoteNumber ?? null;

    // Save to local storage for reuse
    localStorage.setItem('aw_product_configurator_quote_id', qID);
    localStorage.setItem('aw_product_configurator_quote_number', qNumber);

    // End timing
    const endTime = performance.now();
    const elapsed = endTime - startTime;
    setParadigmApiDurations((prev) =>
      prev.length < MAX_DURATIONS
        ? [
            ...prev,
            {
              dateTime: new Date().toISOString(),
              label: 'quote',
              ms: elapsed,
            },
          ]
        : [
            ...prev.slice(1),
            {
              dateTime: new Date().toISOString(),
              label: 'quote',
              ms: elapsed,
            },
          ]
    );

    return { quoteId: qID, quoteNumber: qNumber };
  };

  // Step 3: Create configurator session (returns structured session data)
  const createConfigSession = async (
    token: string,
    qid: string,
    favoriteId: string
  ): Promise<{
    configuratorKey: string | null;
    configuratorCookie: string | null;
    steps: Step[] | null;
    activeStepData: ActiveStepData | null;
    activeStep: number | null;
    threekitConfiguration: ThreekitConfiguration | null;
  }> => {
    // Start timing the API call
    const startTime = performance.now();

    const response = await fetch('/api/aw/product-configurator/config-session-from-favorite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        quoteId: qid,
        favoriteId: favoriteId,
      }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error ?? 'Failed to create configurator session');
    }
    const data = await response.json();
    const configuratorKey = data?.data?.ConfiguratorKey ?? null;
    const configuratorCookie = data?.setCookie ?? null;

    const rawSteps: Step[] | null = Array.isArray(data?.data?.ConfiguratorState?.StepsInfo)
      ? data.data.ConfiguratorState.StepsInfo
      : null;
    // Filter the steps to exclude unwanted step IDs
    const steps = rawSteps ? rawSteps.filter((s: Step) => !excludedStepIds.includes(s.ID)) : null;

    const activeStepData: ActiveStepData | null =
      data?.data?.ConfiguratorState?.CurrentStepData ?? null;
    const activeStep: number | null = data?.data?.ConfiguratorState?.CurrentStepData?.ID ?? null;
    const threekitConfiguration: ThreekitConfiguration | null =
      data?.data?.ConfiguratorState?.ThreekitConfiguration ?? null;

    // End timing
    const endTime = performance.now();
    const elapsed = endTime - startTime;
    setParadigmApiDurations((prev) =>
      prev.length < MAX_DURATIONS
        ? [
            ...prev,
            {
              dateTime: new Date().toISOString(),
              label: 'config-session-from-favorite',
              ms: elapsed,
            },
          ]
        : [
            ...prev.slice(1),
            {
              dateTime: new Date().toISOString(),
              label: 'config-session-from-favorite',
              ms: elapsed,
            },
          ]
    );

    return {
      configuratorKey,
      configuratorCookie,
      steps,
      activeStepData,
      activeStep,
      threekitConfiguration,
    };
  };

  // Step 4: Initialize Threekit (depends on SDK script + DOM)
  const initializeThreekit = async (): Promise<void> => {
    if (isPlayerReady) {
      return;
    }

    const tkw = window as ThreekitWindow;
    if (!tkw?.threekitPlayer || !playerContainerReady) {
      console.error('Threekit player or container not available');
      return;
    }

    const player = await tkw.threekitPlayer({
      authToken: threekitAuthToken,
      el: playerContainerRef.current,
      assetId: assetIdValue,
      showLoadingThumbnail: true,
      showConfigurator: false,
      showAR: true,
      locale: 'EN',
      classnames: { ar: { button: 'arButton', popup: 'arPopup' } },
      publishStage: 'published',
    });

    playerRef.current = player;
    const config = await player.getConfigurator();
    setConfigurator(config);
    setIsPlayerReady(true);
  };

  // Define the listener as a named function using useCallback
  const setConfigurationListener = useCallback(() => {
    const startTime = performance.now();
    if (typeof playerRef.current?.evaluate === 'function') {
      playerRef.current.evaluate().then(() => {
        const endTime = performance.now();
        const elapsed = endTime - startTime;
        if (elapsed > 0) {
          setThreekitApiDurations((prev) =>
            prev.length < MAX_DURATIONS
              ? [
                  ...prev,
                  {
                    dateTime: new Date().toISOString(),
                    label:
                      'start: ' + startTime.toFixed(2) + ' ms, end: ' + endTime.toFixed(2) + ' ms',
                    ms: elapsed,
                  },
                ]
              : [
                  ...prev.slice(1),
                  {
                    dateTime: new Date().toISOString(),
                    label:
                      'start: ' + startTime.toFixed(2) + 'ms, end: ' + endTime.toFixed(2) + 'ms',
                    ms: elapsed,
                  },
                ]
          );
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerRef]);

  // Set Threekit Configuration in Player
  const threekitConfigurationUpdate = () => {
    if (!isPlayerReady || !threekitConfiguration) {
      return;
    }

    const configObject = convertThreekitConfigToObject(threekitConfiguration);
    configurator?.setConfiguration(configObject);
  };

  // Get the Step Data on Step Change
  const getStep = async (
    token: string,
    configCookie: string,
    configKey: string,
    step: string
  ): Promise<{
    activeStepData: ActiveStepData | null;
  }> => {
    const params = new URLSearchParams();
    params.set('configId', configKey || '');
    params.set('stepId', step);

    // Start timing the API call
    const startTime = performance.now();

    const response = await fetch(`/api/aw/product-configurator/steps?${params.toString()}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'x-paradigm-cookie': configCookie ?? '',
      },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error ?? 'Failed to get step data');
    }
    const data = await response.json();
    const activeStepData: ActiveStepData | null = data ?? null;

    // End timing
    const endTime = performance.now();
    const elapsed = endTime - startTime;
    setParadigmApiDurations((prev) =>
      prev.length < MAX_DURATIONS
        ? [
            ...prev,
            {
              dateTime: new Date().toISOString(),
              label: 'steps',
              ms: elapsed,
            },
          ]
        : [
            ...prev.slice(1),
            {
              dateTime: new Date().toISOString(),
              label: 'steps',
              ms: elapsed,
            },
          ]
    );

    return { activeStepData };
  };

  // Get the Summary Step Data
  const getSummary = async (
    token: string,
    configCookie: string,
    configKey: string
  ): Promise<{
    summaryStepData: SummarySteps[] | null;
  }> => {
    const params = new URLSearchParams();
    params.set('configId', configKey || '');

    // Start timing the API call
    const startTime = performance.now();

    const response = await fetch(`/api/aw/product-configurator/summary?${params.toString()}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'x-paradigm-cookie': configCookie ?? '',
      },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error ?? 'Failed to get summary step data');
    }
    const data = await response.json();
    const summaryStepData: SummarySteps[] | null = data?.Steps ?? null;

    // End timing
    const endTime = performance.now();
    const elapsed = endTime - startTime;
    setParadigmApiDurations((prev) =>
      prev.length < MAX_DURATIONS
        ? [
            ...prev,
            {
              dateTime: new Date().toISOString(),
              label: 'summary',
              ms: elapsed,
            },
          ]
        : [
            ...prev.slice(1),
            {
              dateTime: new Date().toISOString(),
              label: 'summary',
              ms: elapsed,
            },
          ]
    );

    return { summaryStepData };
  };

  // Update answer for a question
  const updateQuestion = async (
    token: string,
    configCookie: string,
    configKey: string,
    questionId: string,
    value: string,
    classification: string
  ): Promise<{
    activeStepData: ActiveStepData | null;
    threekitConfiguration: ThreekitConfiguration | null;
  }> => {
    // Start timing the API call
    const startTime = performance.now();

    const response = await fetch('/api/aw/product-configurator/update-question', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'x-paradigm-cookie': configCookie ?? '',
      },
      body: JSON.stringify({
        configId: configKey,
        questionId: questionId,
        questionClassification: classification,
        selectedAnswerId: value,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error ?? 'Unknown error');
    }

    const data = await response.json();
    const activeStepData: ActiveStepData | null = data?.CurrentStepData ?? null;
    setActiveStep(data?.CurrentStepData?.ID ?? null);
    const threekitConfiguration: ThreekitConfiguration | null = data?.ThreekitConfiguration ?? null;

    // End timing
    const endTime = performance.now();
    const elapsed = endTime - startTime;
    setParadigmApiDurations((prev) =>
      prev.length < MAX_DURATIONS
        ? [
            ...prev,
            {
              dateTime: new Date().toISOString(),
              label: 'update-question',
              ms: elapsed,
            },
          ]
        : [
            ...prev.slice(1),
            {
              dateTime: new Date().toISOString(),
              label: 'update-question',
              ms: elapsed,
            },
          ]
    );

    return { activeStepData, threekitConfiguration };
  };

  // Save the line item and return the LineItemId
  const saveLineItem = async (
    token: string,
    configCookie: string,
    configKey: string
  ): Promise<string> => {
    // Start timing the API call
    const startTime = performance.now();

    const response = await fetch('/api/aw/product-configurator/save-configuration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'x-paradigm-cookie': configCookie ?? '',
      },
      body: JSON.stringify({
        configId: configKey,
        finishAction: 'exit',
      }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error('Error creating quote: ', err);
    }
    const data = await response.json();

    // End timing
    const endTime = performance.now();
    const elapsed = endTime - startTime;
    setParadigmApiDurations((prev) =>
      prev.length < MAX_DURATIONS
        ? [
            ...prev,
            {
              dateTime: new Date().toISOString(),
              label: 'save-configuration',
              ms: elapsed,
            },
          ]
        : [
            ...prev.slice(1),
            {
              dateTime: new Date().toISOString(),
              label: 'save-configuration',
              ms: elapsed,
            },
          ]
    );

    return data.LineItemMasterId as string;
  };

  // Clear selections and reset configurator
  const clearConfigSelections = async (
    token: string,
    configCookie: string,
    configKey: string
  ): Promise<boolean> => {
    const params = new URLSearchParams();
    params.set('configId', configKey || '');

    // Start timing the API call
    const startTime = performance.now();

    const response = await fetch(
      `/api/aw/product-configurator/delete-configuration?${params.toString()}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'x-paradigm-cookie': configCookie ?? '',
        },
      }
    );

    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(data.error ?? 'Failed to delete configuration');
    }

    // Success
    setConfiguratorKey(null);
    setConfiguratorCookie(null);
    setSteps(null);
    setThreekitConfiguration(null);
    setActiveStepData(null);
    setActiveStep(null);
    setLineItemIds([]);

    // End timing
    const endTime = performance.now();
    const elapsed = endTime - startTime;
    setParadigmApiDurations((prev) =>
      prev.length < MAX_DURATIONS
        ? [
            ...prev,
            {
              dateTime: new Date().toISOString(),
              label: 'delete-configuration',
              ms: elapsed,
            },
          ]
        : [
            ...prev.slice(1),
            {
              dateTime: new Date().toISOString(),
              label: 'delete-configuration',
              ms: elapsed,
            },
          ]
    );

    return true;
  };

  /**************************************************
   * END: constant functions section
   **************************************************/

  /**************************************************
   * BEGIN: handlers section
   **************************************************/
  // Handle active step change
  const handleSetActiveStep = useCallback(
    (stepId: number) => {
      if (
        stepId === activeStep ||
        !steps ||
        steps.length === 0 ||
        !configAccessToken ||
        !configuratorCookie ||
        !configuratorKey
      ) {
        return;
      }

      if (activeStepData?.Complete === false) {
        globalThis.alert('Please answer all step questions before proceeding.');
        return;
      }

      (async () => {
        try {
          setFetchingData(true);

          if (stepId === 4645) {
            // Display Summary instead of Product Information step
            const summaryData = await getSummary(
              configAccessToken,
              configuratorCookie,
              configuratorKey
            );

            setSummarySteps(summaryData.summaryStepData);
          } else {
            const stepData = await getStep(
              configAccessToken,
              configuratorCookie,
              configuratorKey,
              stepId.toString()
            );

            setActiveStepData(stepData.activeStepData);
          }

          // Scroll the window to the very top-left
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
          // Scroll the questions container to the top
          if (questionsContainerRef.current) {
            questionsContainerRef.current.scrollTo({
              top: 0,
              behavior: 'smooth',
            });
          }
        } catch (error) {
          console.error('Error fetching step data: ', error);
        } finally {
          setActiveStep(stepId);
          setFetchingData(false);
        }
      })();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeStep, steps, configAccessToken, configuratorCookie, configuratorKey, activeStepData]
  );

  // Handle answer changes from QuestionsComponent
  const handleAnswerChange = useCallback(
    (questionId: string, value: string, classification: string) => {
      if (!questionId || !value || !classification || !configuratorKey || !configuratorCookie) {
        return;
      }

      (async () => {
        try {
          setFetchingData(true);

          const updatedData = await updateQuestion(
            configAccessToken ?? '',
            configuratorCookie,
            configuratorKey,
            questionId,
            value,
            classification
          );

          setActiveStepData(updatedData.activeStepData);
          setThreekitConfiguration(updatedData.threekitConfiguration);
        } catch (error) {
          console.error('Error updating question: ', error);
        } finally {
          setFetchingData(false);
        }
      })();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [configAccessToken, configuratorCookie, configuratorKey]
  );

  // Handle saving the line item
  const handleSaveLineItem = useCallback(
    (saveLine: boolean) => {
      if (!saveLine || !configAccessToken || !configuratorCookie || !configuratorKey) {
        return;
      }
      (async () => {
        try {
          setFetchingData(true);

          const lineItemId = await saveLineItem(
            configAccessToken,
            configuratorCookie,
            configuratorKey
          );
          setLineItemIds((prevIds) => [...prevIds, lineItemId]);
        } catch (error) {
          console.error('Error saving line item: ', error);
        } finally {
          setShowProjectComponent(true);
          setFetchingData(false);
        }
      })();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [configAccessToken, configuratorCookie, configuratorKey]
  );

  // Handle adding a new line item
  const handleAddLineItem = useCallback(
    (addLine: boolean) => {
      if (!addLine || !configAccessToken || !configuratorKey || !quoteId) {
        return;
      }

      (async () => {
        try {
          setFetchingData(true);

          const session = await createConfigSession(
            configAccessToken,
            quoteId,
            props.fields?.iqPlusFavoriteId?.value
          );

          setConfiguratorKey(session.configuratorKey);
          setConfiguratorCookie(session.configuratorCookie);
          setSteps(session.steps);
          setActiveStepData(session.activeStepData);
          setActiveStep(session.activeStep);
          setThreekitConfiguration(session.threekitConfiguration);
        } catch (error) {
          console.error('Error creating new configurator session: ', error);
        } finally {
          setShowProjectComponent(false);
          setFetchingData(false);
        }
      })();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [configAccessToken, configuratorKey, quoteId, props.fields?.iqPlusFavoriteId?.value]
  );

  // Handle clearing selections
  const handleClearSelections = useCallback(
    (clear: boolean) => {
      if (!clear || !configAccessToken || !configuratorCookie || !configuratorKey || !quoteId) {
        return;
      }

      (async () => {
        try {
          setFetchingData(true);

          // Delete existing configuration
          const lineDeleted = await clearConfigSelections(
            configAccessToken,
            configuratorCookie,
            configuratorKey
          );

          if (lineDeleted) {
            // Create a new configurator session
            const session = await createConfigSession(
              configAccessToken,
              quoteId,
              props.fields?.iqPlusFavoriteId?.value
            );

            setConfiguratorKey(session.configuratorKey);
            setConfiguratorCookie(session.configuratorCookie);
            setSteps(session.steps);
            setActiveStepData(session.activeStepData);
            setActiveStep(session.activeStep);
            setThreekitConfiguration(session.threekitConfiguration);
          }
        } catch (error) {
          console.error('Error clearing configuration selections: ', error);
        } finally {
          setFetchingData(false);
        }
      })();
    },
    // Only re-create if these change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      configAccessToken,
      configuratorCookie,
      configuratorKey,
      quoteId,
      props.fields?.iqPlusFavoriteId?.value,
    ]
  );
  /**************************************************
   * END: handlers section
   **************************************************/

  /**************************************************
   * BEGIN: useEffects section
   **************************************************/
  // Attach and cleanup the listener
  useEffect(() => {
    if (!isPlayerReady) {
      return;
    }

    const player = playerRef.current;
    if (!player || typeof player.on !== 'function') {
      return;
    }

    player.on('setConfiguration', setConfigurationListener);

    // Cleanup to prevent duplicate listeners or memory leaks
    return () => {
      // Only remove if 'off' is available
      if (typeof player.off === 'function') {
        player.off('setConfiguration', setConfigurationListener);
      }
    };
    // Call once the player is ready
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlayerReady, playerRef]);

  useEffect(() => {
    // If the Threekit SDK was already loaded on a previous page,
    // onLoad won't fire again. Detect and mark ready.
    const tkw = window as ThreekitWindow;
    if (tkw?.threekitPlayer && !isSdkReady) {
      setIsSdkReady(true);
    }
    // Run this once per mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initial loader: runs the 3 API steps sequentially, then initializes Threekit
  useEffect(() => {
    let cancelled = false;

    if (!isSdkReady || !playerContainerReady) {
      return;
    }

    async function getToken() {
      if (configAccessToken && !isExpiringSoon(configAccessTokenExpiry ?? '', 30)) {
        return { token: configAccessToken, tokenExpiry: configAccessTokenExpiry };
      }

      const tokenData = await fetchAuthToken();
      return { token: tokenData.accessToken, tokenExpiry: tokenData.expires };
    }

    async function getQuote(token: string) {
      if (quoteId && quoteNumber) {
        return { qId: quoteId, qNumber: quoteNumber };
      }

      const quoteData = await createQuote(token);
      return { qId: quoteData.quoteId ?? '', qNumber: quoteData.quoteNumber ?? '' };
    }

    async function resetConfiguratorSession(token: string) {
      if (configuratorKey && configuratorCookie) {
        await clearConfigSelections(token, configuratorCookie, configuratorKey);
      }
    }

    function updateTokenState(token: string, tokenExpiry: string | null) {
      if (token !== configAccessToken) {
        setConfigAccessToken(token);
      }
      if (tokenExpiry !== configAccessTokenExpiry) {
        setConfigAccessTokenExpiry(tokenExpiry);
      }
    }

    function updateQuoteState(qId: string, qNumber: string) {
      if (qId !== quoteId) {
        setQuoteId(qId);
      }
      if (qNumber !== quoteNumber) {
        setQuoteNumber(qNumber);
      }
    }

    function updateSessionState(session: ConfigSession | null) {
      if (!session) {
        return;
      }
      setConfiguratorKey(session.configuratorKey);
      setConfiguratorCookie(session.configuratorCookie);
      setSteps(session.steps);
      setActiveStepData(session.activeStepData);
      setActiveStep(session.activeStep);
      setThreekitConfiguration(session.threekitConfiguration);
    }

    function resetSessionState() {
      setConfiguratorKey(null);
      setConfiguratorCookie(null);
      setSteps(null);
      setActiveStepData(null);
      setActiveStep(null);
      setThreekitConfiguration(null);
    }

    async function initialLoad() {
      try {
        setFetchingData(true);
        if (cancelled) {
          return;
        }

        const { token, tokenExpiry } = await getToken();
        updateTokenState(token, tokenExpiry);

        const { qId, qNumber } = await getQuote(token);
        updateQuoteState(qId, qNumber);

        await resetConfiguratorSession(token);

        const session = await createConfigSession(
          token,
          qId,
          props.fields?.iqPlusFavoriteId?.value
        );

        updateSessionState(session);
      } catch (error) {
        if (!cancelled) {
          console.error('Error loading configuration: ', error);
          resetSessionState();
        }
      } finally {
        if (!cancelled) {
          setFetchingData(false);
        }
      }
    }

    initialLoad();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    asPath,
    isSdkReady,
    playerContainerReady,
    threekitAuthToken,
    props.fields?.iqPlusFavoriteId?.value,
  ]);

  // Update Threekit Configuration in Player when it changes
  useEffect(() => {
    if (!threekitConfiguration || !isPlayerReady) {
      return;
    }

    threekitConfigurationUpdate();
    // Only run when threekitConfiguration changes and the player is ready
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threekitConfiguration, isPlayerReady]);

  useEffect(() => {
    if (!assetIdValue || !isSdkReady || !playerContainerReady) {
      return;
    }

    initializeThreekit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetIdValue, isSdkReady, playerContainerReady]);

  // Setup token refresh before expiry
  useEffect(() => {
    if (!configAccessTokenExpiry) {
      return;
    }

    const expiryMs = new Date(configAccessTokenExpiry).getTime();
    const now = Date.now();
    const refreshAt = Math.max(0, expiryMs - now - 30 * 60 * 1000); // 30 min before

    const timer = setTimeout(async () => {
      try {
        const { accessToken, expires } = await fetchAuthToken();
        setConfigAccessToken(accessToken);
        setConfigAccessTokenExpiry(expires);
        console.log('Token refreshed successfully');
      } catch (e) {
        console.error('Token refresh failed', e);
      }
    }, refreshAt);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configAccessTokenExpiry]);

  /**************************************************
   * END: useEffects section
   **************************************************/

  return (
    <>
      <Script
        src={props.fields?.tkScriptSource?.value}
        strategy="afterInteractive"
        onLoad={onSdkLoaded}
      />
      <Component
        variant="lg"
        padding="none"
        dataComponent="general/awproductconfigurator"
        {...props}
      >
        <div className="col-span-12">
          {props.fields?.showLogo?.value && (
            <div className={themeData.classes.headerContainer}>
              <div className={themeData.classes.logoWrapper}>
                <ImageWrapper
                  image={props.fields?.logo}
                  additionalDesktopClasses=" "
                  additionalMobileClasses=" "
                  priority
                  ratio="auto"
                />
              </div>
              <div></div>
              {/* Commenting out for now until we decide on My Project functionality */}
              {/* <button
            className="text-gray-800 relative inline-flex h-10 min-w-[2.5rem] select-none items-center justify-center whitespace-nowrap px-4 align-middle text-base font-semibold leading-[1.2] transition duration-200"
            onClick={toggleView}
          >
            <SvgIcon
              icon="arrow-left"
              className={classNames(showProjectComponent ? 'block' : 'hidden', 'mr-4')}
            />
            <div>{showProjectComponent ? 'Back to Configurator' : 'View Project'}</div>
            <SvgIcon
              icon="arrow-right"
              className={classNames(showProjectComponent ? 'hidden' : 'block', 'ml-4')}
            />
          </button> */}
            </div>
          )}
          <div className={`${showProjectComponent ? 'visible' : 'hidden'}`}>
            <ProjectComponent
              lineItemIds={lineItemIds}
              setAddNewLineItem={handleAddLineItem}
              quoteNumber={quoteNumber ?? ''}
            />
          </div>
          <div className={`${showProjectComponent ? 'hidden' : 'visible'}`}>
            <div className={themeData.classes.bodyContainer}>
              <div className={themeData.classes.sectionContainer}>
                <section id="steps" className={themeData.classes.stepsSection}>
                  <div className="sticky top-0 z-10 mb-5 h-16 border border-gray max-ml:border-x-0 ml:rounded-[6rem] ml:shadow-[0_3px_5px_3px_rgba(0,0,0,0.08)]">
                    {steps && (
                      <StepsBarComponent
                        navText={props.fields?.navText?.value}
                        steps={steps}
                        activeStep={activeStep}
                        setActiveStep={handleSetActiveStep}
                        navRefs={navRefs}
                      />
                    )}
                  </div>
                </section>
                <section id="visualizer" className={themeData.classes.visualizerSection}>
                  <div className="flex flex-col">
                    <div className="order-1 mt-3 mb-4 mr-6 flex ml:order-2">
                      <div className="relative rounded-full border border-gray text-center">
                        <button
                          onClick={changeModeConfigurator}
                          className={
                            mode === DEALER_MODE
                              ? themeData.classes.activeButtonStyle
                              : themeData.classes.inactiveButtonStyle
                          }
                        >
                          PRO VIEW
                        </button>
                        <button
                          onClick={changeModeConfigurator}
                          className={
                            mode === HOMEOWNER_MODE
                              ? themeData.classes.activeButtonStyle
                              : themeData.classes.inactiveButtonStyle
                          }
                        >
                          HOMEOWNER VIEW
                        </button>
                      </div>
                    </div>
                    <div className="order-2 border border-solid border-[#979797] bg-[#979797] ml:order-1 ml:mr-4">
                      <div
                        id="threekit-player"
                        ref={setPlayerContainer}
                        className="h-80 w-full ml:mr-6 ml:h-128"
                      ></div>
                    </div>
                  </div>
                </section>
                <section id="questions" className={themeData.classes.questionsSection}>
                  {activeStepData && Array.isArray(activeStepData.Questions) && (
                    <>
                      <div className="ml:max-h-128 ml:overflow-y-auto" ref={questionsContainerRef}>
                        <div className="w-full bg-black py-4 px-6">
                          <div className="font-semibold text-white">
                            {activeStep === 4639 ? 'Select window dimensions' : ''}
                            {activeStep === 4640 ? 'Select window colors' : ''}
                            {activeStep === 4641 ? 'Select glass and grille options' : ''}
                            {activeStep === 4642 ? 'Select hardware, screens, and accessories' : ''}
                            {activeStep === 4644 ? 'Select exterior trim options' : ''}
                            {activeStep === 4645 ? 'Review Your Selections' : ''}
                          </div>
                        </div>
                        {activeStep === 4645 && summarySteps && (
                          <div>
                            <SummaryComponent
                              steps={summarySteps}
                              selectedProduct={
                                props.fields?.selectedProductListTileBackendName?.value
                              }
                            />
                          </div>
                        )}
                        {activeStep !== 4645 && (
                          <QuestionsComponent
                            Questions={activeStepData.Questions}
                            onChange={handleAnswerChange}
                            imageBaseUrl={baseURL}
                            mode={mode}
                          />
                        )}
                      </div>
                      <div>
                        <StepNavigationComponent
                          steps={steps || []}
                          activeStep={activeStep}
                          setActiveStep={handleSetActiveStep}
                          onClearSelections={handleClearSelections}
                          onSaveLineItem={handleSaveLineItem}
                        />
                      </div>
                    </>
                  )}
                </section>
              </div>
            </div>
          </div>
          {showAPIMetrics && (
            <>
              <div
                className={classNames(showProjectComponent ? 'mt-4' : '-mt-12', 'px-5 ml:px-12')}
              >
                <button
                  onClick={toggleMetrics}
                  className="cursor-pointer mb-3 text-sm text-blue-600 underline"
                >
                  {showMetrics ? 'Hide Metrics' : 'Show Metrics'}
                </button>
              </div>
              {showMetrics && (
                <div className="flex">
                  <div className="px-5 ml:px-12 w-1/2">
                    <strong className="pb-3 inline-block">Paradigm API Calls</strong>
                    <button
                      onClick={clearMetrics}
                      className="cursor-pointer ml-3 mb-3 text-sm text-blue-600 underline"
                    >
                      Clear
                    </button>
                    <table>
                      <thead>
                        <tr>
                          <th className="pr-3 bg-slate-200 text-left">Time</th>
                          <th className="pr-3 bg-slate-200 text-left">API</th>
                          <th className="bg-slate-200 text-left">Duration ms (s)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paradigmApiDurations
                          .slice()
                          .reverse()
                          .map((item) => (
                            <tr key={item.label + item.ms.toFixed(2)}>
                              <td className="pr-3">
                                {new Date(item.dateTime).toLocaleTimeString()}
                              </td>
                              <td className="pr-3">{item.label}</td>
                              <td>
                                {item.ms.toFixed(2)} ({(item.ms / 1000).toFixed(3)})
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-5 ml:px-12 w-1/2">
                    <strong className="pb-3 inline-block">Threekit evaluate() Calls</strong>
                    <button
                      onClick={clearThreekitMetrics}
                      className="cursor-pointer ml-3 mb-3 text-sm text-blue-600 underline"
                    >
                      Clear
                    </button>
                    <table>
                      <thead>
                        <tr>
                          <th className="pr-3 bg-slate-200 text-left">Time</th>
                          <th className="pr-3 bg-slate-200 text-left">Listener</th>
                          <th className="bg-slate-200 text-left">Duration ms (s)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {threekitApiDurations
                          .slice()
                          .reverse()
                          .map((item) => (
                            <tr key={item.label + item.ms.toFixed(2)}>
                              <td className="pr-3">
                                {new Date(item.dateTime).toLocaleTimeString()}
                              </td>
                              <td className="pr-3">{item.label}</td>
                              <td>
                                {item.ms.toFixed(2)} ({(item.ms / 1000).toFixed(3)})
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {fetchingData && (
            <div className="fixed top-0 left-0 z-10001 flex h-screen w-screen transform items-center justify-center bg-black opacity-50">
              <div id="spinner-container" className="space-y-10">
                <div className="flex justify-center">
                  <Spinner size={48} />
                </div>
              </div>
            </div>
          )}
        </div>
      </Component>
    </>
  );
}
