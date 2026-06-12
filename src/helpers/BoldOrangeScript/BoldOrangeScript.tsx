'use client';

import { useSitecore } from '@sitecore-content-sdk/nextjs';
import Script from 'next/script';
import { JSX } from 'react';
import { environment } from 'startup/environment';

export const BoldOrangeScript = (): JSX.Element | null => {
  const { page } = useSitecore();

  /* Set the beacon script src based on Vercel CONTENT_ROLE environment variable. */
  const beaconSrc = environment.isWww()
    ? '//cdn.evgnet.com/beacon/renewalbyandersen/aw_prod24/scripts/evergage.min.js'
    : '//cdn.evgnet.com/beacon/renewalbyandersen/aw_dev24/scripts/evergage.min.js';
  if (!environment.isLocal() && page.siteName === 'AndersenWindows') {
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    return <Script type="text/javascript" strategy="beforeInteractive" src={beaconSrc}></Script>;
  }

  return null;
};

export default BoldOrangeScript;
