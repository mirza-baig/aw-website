'use client';

import { setCookie } from 'cookies-next';
import Component from 'helpers/Component/Component';
import { RichTextWrapper } from 'helpers/RichTextWrapper';
import { Spinner } from 'helpers/Spinner';
import { useTheme } from 'lib/context/ThemeContext';
import { useAsPath } from 'lib/hooks/use-as-path';
import { ReactNode, useEffect, useState } from 'react';
import useSWR from 'swr';

import { RbAConsultRequestTheme } from './RbAConsultRequest.theme';
import { ResultsData } from './ResultsData';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type RbAConsultRequestClientProps =
  Sitecore.Components.General.RbAConsultRequest.RbAConsultRequest & {
    placeholder: ReactNode;
  };

export function RbAConsultRequestClient(props: RbAConsultRequestClientProps) {
  const asPath = useAsPath();
  const showFormSidebar = props.fields?.showFormSidebar?.value ?? false;
  const { themeData } = useTheme(RbAConsultRequestTheme(showFormSidebar));

  const [dataFetchComplete, setDataFetchComplete] = useState(false);
  const [displayErrorMsg, setDisplayErrorMsg] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [resultData, setResultData] = useState<ResultsData | null>(null);

  function AddScore() {
    const percentile = (Number(resultData?.reviewRating) / 5) * 100;
    const myElement = document.querySelector('#starRating') as HTMLElement;
    if (!myElement) {
      return;
    } else {
      const starSpan =
        '<span class="stars-container">★★★★★<style>.stars-container:after { width: ' +
        percentile +
        '%} </style></span>';
      myElement.innerHTML = starSpan;
    }
  }

  function ReplaceKeyValues(item: HTMLElement) {
    const myElement = item;
    if (myElement.id === 'rbaConsultReqForm') {
      return;
    } else {
      let html = myElement.outerHTML;
      for (const key in resultData) {
        const re = new RegExp('{{' + key + '}}', 'gi');
        html = html.replace(re, resultData[key as keyof ResultsData]);
      }
      myElement.outerHTML = html;
    }
  }

  function ReplaceTokens() {
    document.title = resultData?.name ?? 'Andersen Windows | Renewal by Andersen';
    const main = document.querySelectorAll(
      '#main section:not([data-component="rbaConsultRequest"])'
    );
    main.forEach(ReplaceKeyValues);
  }

  function HideElements() {
    const searchButton = document.querySelector('div.headerBottomPosElement div > button');
    const searhButtonMobile = document.querySelector('div.nav-bar > button:last-of-type');
    const hamburgerMobile = document.querySelector('div.nav-bar > button:last-of-type');

    if (searchButton) {
      (searchButton as HTMLElement).style.display = 'none';
    }

    if (searhButtonMobile) {
      (searhButtonMobile as HTMLElement).style.display = 'none';
    }

    if (hamburgerMobile) {
      (hamburgerMobile as HTMLElement).style.display = 'none';
    }
  }

  async function Fetcher(url: string) {
    const urlSearchParams = new URLSearchParams(asPath.split('?')[1]);
    let queryStringStoreId = '';
    urlSearchParams.forEach((value, key) => {
      if (key.toLowerCase() === 'storeid') {
        queryStringStoreId = value.toString();
      }
    });

    if (queryStringStoreId) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({ storeId: queryStringStoreId }), // Wrapping storeId in an object
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error('API response not OK', response); // Log response error
          throw new Error(response.statusText);
        }

        const responseData = await response.json();
        setDisplayErrorMsg(false);
        return responseData;
      } catch (error) {
        console.error('Error in fetcher:', error); // Log any error that occurs in the fetch process
        throw error;
      }
    } else {
      setDisplayErrorMsg(true);
      setDataFetchComplete(true);
      throw new Error('Missing store id from query string.');
    }
  }

  const { data: offerResults } = useSWR(
    '/api/aw/rba-consult-request/get-offer-by-store-id',
    (url) => Fetcher(url)
  );

  // Check if the page is fully loaded
  useEffect(() => {
    if (isPageLoaded) {
      return;
    }

    const handleLoad = () => {
      setIsPageLoaded(true);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      window.removeEventListener('load', handleLoad);
    };
    // Only observe isPageLoaded changes
  }, [isPageLoaded]);

  // Handle window resize to update document title
  useEffect(() => {
    if (!resultData) {
      return;
    }

    let resizeId: NodeJS.Timeout | undefined;

    const doneResizing = () => {
      document.title = resultData?.name || 'Andersen Windows | Renewal by Andersen';
    };

    // Check if window is resized after load
    window.addEventListener('resize', function () {
      clearTimeout(resizeId);
      resizeId = setTimeout(doneResizing, 500);
    });

    return () => {
      window.removeEventListener('resize', function () {
        clearTimeout(resizeId);
        resizeId = setTimeout(doneResizing, 500);
      });
    };
    // Only observe resultData changes
  }, [resultData]);

  // When offerResults are retrieved, update resultData
  useEffect(() => {
    if (!offerResults) {
      return;
    }

    setResultData(offerResults.results.data ?? null);
    setDataFetchComplete(true);
  }, [offerResults]);

  // When resultData or isPageLoaded change, update document title and replace tokens
  useEffect(() => {
    if (!resultData || !isPageLoaded) {
      return;
    }

    HideElements();
    ReplaceTokens();
    AddScore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultData, isPageLoaded]);

  // Handle missing store id error display
  useEffect(() => {
    if (!displayErrorMsg || !isPageLoaded) {
      return;
    }
    // Store Id is required, display the error message and hide other content if the store id is not present
    document.title = 'Error 404';

    const nodes = document.querySelectorAll<HTMLElement>(
      '#main section:not([data-component="rbaConsultRequest"])'
    );
    nodes.forEach((el) => {
      el.style.display = 'none';
    });
    // Only observe setDisplayErrorMsg and isPageLoaded changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setDisplayErrorMsg, isPageLoaded]);

  // Set cookies for rbaSource and rbaBreakdown on component mount
  useEffect(() => {
    const encodeOverride = (value: string) => {
      return value;
    };
    // Set cookies safely only if the values exist
    if (props.fields?.rbaSource?.value) {
      setCookie('rbaSource', props.fields.rbaSource.value, { encode: encodeOverride });
    }
    if (props.fields?.rbaBreakdown?.value) {
      setCookie('rbaBreakdown', props.fields.rbaBreakdown.value, { encode: encodeOverride });
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Component
      variant="lg"
      backgroundVariant=""
      sectionWrapperClasses=""
      dataComponent="rbaConsultRequest"
      {...props}
    >
      <div className="col-span-12">
        {displayErrorMsg && props.fields?.missingStoreIdErrorMessage?.value && (
          <RichTextWrapper
            field={{ value: props.fields?.missingStoreIdErrorMessage.value }}
            classes={themeData.classes.body}
          />
        )}
        {!displayErrorMsg && (
          <div className={themeData.classes.contentContainer}>
            <div className={themeData.classes.content}>
              {props.fields?.standardIntroContentHeading?.value && (
                <h2 className={themeData.classes.headlineClass}>
                  {props.fields?.standardIntroContentHeading.value}
                </h2>
              )}
              <RichTextWrapper
                field={{ value: props.fields?.standardIntroContentBody?.value ?? '' }}
                classes={themeData.classes.body}
              />
              <div id="rbaConsultReqForm">{props.placeholder}</div>
            </div>
            {showFormSidebar && resultData && (
              <div id="rbaConsultRequestSideBar" className={themeData.classes.sidebar}>
                <div className={themeData.classes.sidebarWrapper}>
                  <h2 className={themeData.classes.sidebarH2}>
                    {resultData?.headlineText ? resultData?.headlineText : ''}
                  </h2>
                  <h3 className={themeData.classes.sidebarH3}>
                    {resultData?.subHeadlineText ? resultData?.subHeadlineText : ''}
                  </h3>
                  <p className={themeData.classes.offerDetails}>
                    {resultData?.offerDetails ? resultData?.offerDetails : ''}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        {!dataFetchComplete && (
          <div className={themeData.classes.spinnerWrapper} id="cover">
            <div className={themeData.classes.spinner}>
              <Spinner size={48} />
            </div>
          </div>
        )}
      </div>
    </Component>
  );
}
