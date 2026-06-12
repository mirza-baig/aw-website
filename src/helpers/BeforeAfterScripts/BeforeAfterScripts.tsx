'use client';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { JSX, useEffect } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

export const BeforeAfterScript = (): JSX.Element | null => {
  const { page } = useSitecore();

  useEffect(() => {
    const pageItem = page.layout.sitecore.route as Sitecore.BaseTemplates.BasePage;

    const beforeHeadCloseScript =
      (pageItem?.fields?.pageAddScriptsBeforeHeadClose?.value as string) ?? '';
    const afterBodyOpenScript =
      (pageItem?.fields?.pageAddScriptsAfterBodyOpen?.value as string) ?? '';
    const beforeBodyCloseScript =
      (pageItem?.fields?.pageAddScriptsBeforeBodyClose?.value as string) ?? '';

    const beforeHeadCloseFragment = document
      .createRange()
      .createContextualFragment(beforeHeadCloseScript);
    document.head.append(beforeHeadCloseFragment);

    const afterBodyOpenFragment = document
      .createRange()
      .createContextualFragment(afterBodyOpenScript);
    document.body.prepend(afterBodyOpenFragment);

    const beforeBodyCloseFragment = document
      .createRange()
      .createContextualFragment(beforeBodyCloseScript);
    document.body.append(beforeBodyCloseFragment);

    return () => {
      // Handles the case where element is already removed, in that case there would be no parent
      // element and it will do nothing rather than throw an error.
      beforeHeadCloseFragment.parentElement?.removeChild(beforeHeadCloseFragment);
      afterBodyOpenFragment.parentElement?.removeChild(afterBodyOpenFragment);
      beforeBodyCloseFragment.parentElement?.removeChild(beforeBodyCloseFragment);
    };
  }, [page]);

  return null;
};
