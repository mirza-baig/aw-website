'use client';

// child app (inside the iframe)
import IframeResizer from '@iframe-resizer/react';
import config from 'aw.config.client';
import Component, { ComponentBackgroundVariants } from 'helpers/Component/Component';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX } from 'react';

import { IframeTheme } from './helpers/Iframe.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type IframeProps = ComponentProps & Sitecore.Components.General.Iframe.Iframe;

function ParseNameValuePairs(source: string): Array<[string, string]> {
  const returnValue: Array<[string, string]> = [];

  const parameters = source?.split('&');

  if (parameters?.length > 0) {
    for (const x of parameters) {
      const splitX = x.split('=');

      if (splitX?.length > 1) {
        returnValue.push([splitX[0], splitX[1]]);
      }
    }
  }
  return returnValue;
}

function GetIframeHtml(parameters: Array<[string, string]>): JSX.Element {
  const iframeResizerProps: { [key: string]: unknown } = {};
  const iframeLicenseKey = config.iframeResizer.license;

  if (!iframeLicenseKey) {
    console.log(
      'Missing NEXT_PUBLIC_IFRAMERESIZER_LICENSE. Provide your commercial key (or "GPLv3" for OSS).'
    );
  }
  for (const [key, value] of parameters) {
    iframeResizerProps[key] = value;
  }

  // Render IframeResizer correctly as a React component
  return <IframeResizer license={iframeLicenseKey} {...iframeResizerProps} />;
}

function Iframe_Default(props: IframeProps) {
  const { themeData } = useTheme(IframeTheme());
  const style = getEnum<ComponentBackgroundVariants>(props.fields?.backgroundColor) ?? 'white';

  const resizerOptions = ParseNameValuePairs(props?.fields?.iframeResizerOptions?.value ?? '');
  const iframeAttributes = ParseNameValuePairs(props?.fields?.iframeAttributes?.value ?? '');
  let finalIframeAttributes: Array<[string, string]> = [
    ['className', themeData.classes.iframeContainerClass],
    ['src', props?.fields?.iframeUrl?.value],
  ];

  if (props?.fields?.iframeTitle?.value) {
    finalIframeAttributes.push(['title', props?.fields?.iframeTitle?.value]);
  }

  try {
    if (resizerOptions?.length > 0) {
      finalIframeAttributes = finalIframeAttributes.concat(resizerOptions);
    }

    if (iframeAttributes?.length > 0) {
      finalIframeAttributes = finalIframeAttributes.concat(iframeAttributes);
    }
  } catch {}

  return (
    <Component
      variant="full"
      backgroundVariant={style}
      padding=" "
      dataComponent="general/iframe"
      sectionWrapperClasses=""
      {...props}
    >
      {GetIframeHtml(finalIframeAttributes)}
    </Component>
  );
}

export const Default = withDatasourceCheck(Iframe_Default);
